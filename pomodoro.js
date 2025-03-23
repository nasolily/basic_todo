let timer;
let timeLeft;
let isWorkTime = true;
let isDragging = false;
let offsetX, offsetY;
let workMinutes = parseInt(document.getElementById("workTime").value);
let breakMinutes = parseInt(document.getElementById("breakTime").value);

const pomodoroTimer = document.getElementById("pomodoro-timer");
const dragHandle = document.getElementById("drag-handle");
const workInput = document.getElementById("workTime");
const breakInput = document.getElementById("breakTime");
const clickSound = document.getElementById("startSound");
const indicator = document.getElementById("pomodoro-indicator");

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

// Set the default heart quote with dotted line
function setHeartQuote() {
    indicator.textContent = "˗ˋˏ ♡ ˎˊ˗";
    indicator.classList.add("heart-quote");  // Apply larger font size for heart quote
}

// Reset timer and bring back the heart quote
function resetTimer() {
    clickSound.currentTime = 0;
    clickSound.play();
    clearInterval(timer);

    if (isWorkTime) {
        timeLeft = workMinutes * 60;
    } else {
        timeLeft = breakMinutes * 60;
    }
    updateDisplay();

    // Reset to the heart quote and apply dotted line
    setHeartQuote();
}

// Update the indicator text based on work/break time
function updateIndicator() {
    if (isWorkTime) {
        indicator.textContent = "let's get to work!";
        indicator.classList.remove("heart-quote");  // Remove larger font for work phase
    } else {
        indicator.textContent = "take a break!";
        indicator.classList.remove("heart-quote");  // Remove larger font for break phase
    }
}

// Function to start the timer
function startTimer() {
    workMinutes = parseInt(workInput.value);
    breakMinutes = parseInt(breakInput.value);
    if (isWorkTime) {
        timeLeft = workMinutes * 60;
    } else {
        timeLeft = breakMinutes * 60;
    }

    clickSound.currentTime = 0;
    clickSound.play();

    // Start timer and update indicator
    updateIndicator();  // Ensure indicator is updated at the start
    timer = setInterval(function() {
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timer);
            document.getElementById("endSound").play();
            isWorkTime = !isWorkTime;
            updateIndicator();  // Update indicator when switching between work and break
            startTimer();  // Restart the timer
        } else {
            updateDisplay();
        }
    }, 1000);
}

// Stop the timer
function stopTimer() {
    clickSound.currentTime = 0;
    clickSound.play();
    clearInterval(timer);
}

// Update the display of the timer
function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let displaySeconds = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById("timer").textContent = minutes + ":" + displaySeconds;
}

// Update the timer display when inputs change
function updateTimerDisplay() {
    if (isWorkTime) {
        timeLeft = parseInt(workInput.value) * 60;
    } else {
        timeLeft = parseInt(breakInput.value) * 60;
    }
    updateDisplay();
}

workInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        updateTimerDisplay();
    }
});

breakInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        updateTimerDisplay();
    }
});

workInput.addEventListener("change", updateTimerDisplay);
breakInput.addEventListener("change", updateTimerDisplay);

document.getElementById("startButton").addEventListener("click", startTimer);
document.getElementById("stopButton").addEventListener("click", stopTimer);
document.getElementById("resetButton").addEventListener("click", resetTimer);

// Set the initial heart quote on page load
window.addEventListener('load', () => {
    const screenWidth = window.innerWidth;
    const timerWidth = pomodoroTimer.offsetWidth;
    const centerPosition = (screenWidth - timerWidth) / 2;

    pomodoroTimer.style.left = centerPosition + 'px';

    // Set the initial default quote in the indicator and match the color
    setHeartQuote();
});
