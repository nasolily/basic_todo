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

function startTimer() {
    workMinutes = parseInt(workInput.value);
    breakMinutes = parseInt(breakInput.value);
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

function resetTimer() {
    clearInterval(timer);
    if (isWorkTime) {
        timeLeft = workMinutes * 60;
    } else {
        timeLeft = breakMinutes * 60;
    }
    updateDisplay();
}

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
