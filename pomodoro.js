let timer = null;
let timeLeft;
let isWorkTime = true;
let isDragging = false;
let offsetX, offsetY;

const pomodoroTimer = document.getElementById("pomodoro-timer");
const dragHandle = document.getElementById("drag-handle");
const workInput = document.getElementById("workTime");
const breakInput = document.getElementById("breakTime");
const clickSound = document.getElementById("startSound");
const indicator = document.getElementById("pomodoro-indicator");

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");

let workMinutes = parseInt(workInput.value);
let breakMinutes = parseInt(breakInput.value);

/* =========================
   DRAG FUNCTIONALITY
========================= */

dragHandle.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - pomodoroTimer.offsetLeft;
    offsetY = e.clientY - pomodoroTimer.offsetTop;
    pomodoroTimer.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;

    const maxX = window.innerWidth - pomodoroTimer.offsetWidth;
    const maxY = window.innerHeight - pomodoroTimer.offsetHeight;

    newX = Math.min(Math.max(0, newX), maxX);
    newY = Math.min(Math.max(0, newY), maxY);

    pomodoroTimer.style.left = newX + "px";
    pomodoroTimer.style.top = newY + "px";
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    pomodoroTimer.style.cursor = "grab";
});

/* =========================
   INDICATOR TEXT
========================= */

function setHeartQuote() {
    indicator.textContent = "˗ˋˏ ♡ ˎˊ˗";
    indicator.classList.add("heart-quote");
}

function updateIndicator() {
    if (isWorkTime) {
        indicator.textContent = "let's get to work!";
        indicator.classList.remove("heart-quote");
    } else {
        indicator.textContent = "take a break!";
        indicator.classList.remove("heart-quote");
    }
}

/* =========================
   TIMER LOGIC
========================= */

function startTimer() {
    if (timer !== null) return; //no speedy time multiplying

    // only set initial timeLeft if currently not paused (null)
    if (timeLeft === undefined || timeLeft === null) {
        workMinutes = parseInt(workInput.value);
        breakMinutes = parseInt(breakInput.value);
        timeLeft = (isWorkTime ? workMinutes : breakMinutes) * 60;
    }

    clickSound.currentTime = 0;
    clickSound.play();

    updateIndicator();
    updateDisplay();

    startButton.disabled = true;

    timer = setInterval(() => {
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            timer = null;
            timeLeft = null; // clear so the next phase starts fresh

            document.getElementById("endSound").play();

            isWorkTime = !isWorkTime;
            startButton.disabled = false;

            startTimer(); // automatically start next phase
        } else {
            updateDisplay();
        }
    }, 1000);
}

function stopTimer() {
    clickSound.currentTime = 0;
    clickSound.play();

    clearInterval(timer);
    timer = null;

    startButton.disabled = false;
}

function resetTimer() {
    clickSound.currentTime = 0;
    clickSound.play();

    clearInterval(timer);
    timer = null;
    timeLeft = null; // Clear saved time on manual reset

    startButton.disabled = false;

    workMinutes = parseInt(workInput.value);
    breakMinutes = parseInt(breakInput.value);

    timeLeft = (isWorkTime ? workMinutes : breakMinutes) * 60;

    updateDisplay();
    setHeartQuote();
}

/* =========================
   DISPLAY
========================= */

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let displaySeconds = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("timer").textContent =
        minutes + ":" + displaySeconds;
}

function updateTimerDisplay() {
    if (timer !== null) return;

    timeLeft = (isWorkTime
        ? parseInt(workInput.value)
        : parseInt(breakInput.value)) * 60;

    updateDisplay();
}

/* =========================
   INPUT EVENTS
========================= */

workInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") updateTimerDisplay();
});

breakInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") updateTimerDisplay();
});

workInput.addEventListener("change", updateTimerDisplay);
breakInput.addEventListener("change", updateTimerDisplay);

/* =========================
   BUTTON EVENTS
========================= */

startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);

/* =========================
   ON LOAD
========================= */

window.addEventListener("load", () => {
    const screenWidth = window.innerWidth;
    const timerWidth = pomodoroTimer.offsetWidth;
    const centerPosition = (screenWidth - timerWidth) / 2;

    pomodoroTimer.style.left = centerPosition + "px";

    timeLeft = workMinutes * 60;
    updateDisplay();
    setHeartQuote();
});