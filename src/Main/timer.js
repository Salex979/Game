let timerPaused = false;
let notifiedMinutes = new Set();

// Запуск таймера при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
    checkTimer();

    const startBtn = document.getElementById("start-btn");
    const pauseBtn = document.getElementById("pause-btn");

    if (startBtn) startBtn.addEventListener("click", startTimer);
    if (pauseBtn) pauseBtn.addEventListener("click", pauseTimer);
});

// Функция запуска таймера
function startTimer() {
    timerPaused = false;
    let minutes = document.getElementById("timer").value;
    let time = minutes * 60;
    
    localStorage.setItem("timer", time);
    localStorage.setItem("timerStarted", Date.now());
    localStorage.removeItem("pausedTime");

    if (document.getElementById("pause-btn")) {
        document.getElementById("pause-btn").innerText = "Pause";
    }

    checkTimer();
}

// Функция паузы таймера
function pauseTimer() {
    timerPaused = !timerPaused;
    let pauseBtn = document.getElementById("pause-btn");

    if (!timerPaused) {
        localStorage.setItem("timerStarted", Date.now() - (localStorage.getItem("pausedTime") || 0));
        if (pauseBtn) pauseBtn.innerText = "Pause";
        checkTimer();
    } else {
        localStorage.setItem("pausedTime", Date.now() - localStorage.getItem("timerStarted"));
        if (pauseBtn) pauseBtn.innerText = "Play";
    }
}

// Проверка состояния таймера
function checkTimer() {
    if (timerPaused) return;

    let storedTime = localStorage.getItem("timer");
    let startTime = localStorage.getItem("timerStarted");

    if (storedTime && startTime) {
        let timePassed = Math.floor((Date.now() - startTime) / 1000);
        let timeLeft = storedTime - timePassed;
        let minutesLeft = Math.floor(timeLeft / 60);

        if (timeLeft <= 0) {
            showAlert(); // Показываем всплывающее окно
            localStorage.removeItem("timer");
            localStorage.removeItem("timerStarted");
            localStorage.removeItem("pausedTime");
        } else {
            let timerDisplay = document.getElementById("time-left");
            if (timerDisplay) {
                timerDisplay.innerText = `${minutesLeft} : ${timeLeft % 60}`;
            }

            // Проверяем, осталось ли ровно 10, 20, 30... минут
            if (minutesLeft > 0 && minutesLeft % 10 === 0 && !notifiedMinutes.has(minutesLeft)) {
                notifiedMinutes.add(minutesLeft);
                window.showSpeechBubble(`Осталось ${minutesLeft} минут!`);
            }

            setTimeout(checkTimer, 1000);
        }
    }
}

window.getTimeLeft = function () {
    let storedTime = localStorage.getItem("timer");
    let startTime = localStorage.getItem("timerStarted");

    if (storedTime && startTime) {
        let timePassed = Math.floor((Date.now() - startTime) / 1000);
        let timeLeft = storedTime - timePassed;

        return timeLeft > 0 ? timeLeft : 0;
    }
    return 0;
};


// Функция для всплывающего окна
function showAlert() {
    setTimeout(() => {
        alert("Время истекло!");
    }, 500);
}
