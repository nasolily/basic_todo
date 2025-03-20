let timer;
let timeLeft;
let isWorkTime = true;
let isDragging = false;
let offsetX, offsetY;

const pomodoroTimer = document.getElementById("pomodoro-timer");
const dragHandle = document.getElementById("drag-handle");

dragHandle.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - pomodoroTimer.offsetLeft;
    offsetY = e.clientY - pomodoroTimer.offsetTop;
    pomodoroTimer.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    pomodoroTimer.style.left = e.clientX - offsetX + "px";
    pomodoroTimer.style.top = e.clientY - offsetY + "px";
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    pomodoroTimer.style.cursor = "grab";
});

// Rest of your Pomodoro timer code (startTimer, stopTimer, updateDisplay)
let workMinutes = parseInt(document.getElementById("workTime").value);
let breakMinutes = parseInt(document.getElementById("breakTime").value);

function startTimer() {
    if (isWorkTime) {
        timeLeft = workMinutes * 60;
    } else {
        timeLeft = breakMinutes * 60;
    }

    document.getElementById("startSound").play();

    timer = setInterval(function() {
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timer);
            document.getElementById("endSound").play();
            isWorkTime = !isWorkTime;
            startTimer();
        } else {
            updateDisplay();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let displaySeconds = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById("timer").textContent = minutes + ":" + displaySeconds;
}

document.getElementById("startButton").addEventListener("click", startTimer);
document.getElementById("stopButton").addEventListener("click", stopTimer);
