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
    console.log("Функция startTimer вызвана!");
    timerPaused = false;
    let minutes = document.getElementById("timer").value;
    let time = minutes * 60;
    
    localStorage.setItem("timer", time);
    localStorage.setItem("timerStarted", Date.now());
    localStorage.removeItem("pausedTime");
    notifiedMinutes.clear(); // Сбрасываем уведомления при новом запуске
    localStorage.removeItem("speechMessage"); // Очищаем предыдущее сообщение

    if (document.getElementById("pause-btn")) {
        document.getElementById("pause-btn").innerText = "Пауза";
    }

    checkTimer();
}

// Функция паузы таймера
function pauseTimer() {
    timerPaused = !timerPaused;
    let pauseBtn = document.getElementById("pause-btn");

    if (!timerPaused) {
        localStorage.setItem("timerStarted", Date.now() - (localStorage.getItem("pausedTime") || 0));
        if (pauseBtn) pauseBtn.innerText = "Пауза";
        checkTimer();
    } else {
        localStorage.setItem("pausedTime", Date.now() - localStorage.getItem("timerStarted"));
        if (pauseBtn) pauseBtn.innerText = "Старт";
    }
}

// Основная логика таймера
function checkTimer() {
    if (timerPaused) return;

    let storedTime = localStorage.getItem("timer");
    let startTime = localStorage.getItem("timerStarted");

    if (storedTime && startTime) {
        let timePassed = Math.floor((Date.now() - startTime) / 1000);
        let timeLeft = storedTime - timePassed;
        let minutesLeft = Math.floor(timeLeft / 60);

        if (timeLeft <= 0) {
            showAlert();
            localStorage.removeItem("timer");
            localStorage.removeItem("timerStarted");
            localStorage.removeItem("pausedTime");
            localStorage.removeItem("speechMessage"); // Очищаем сообщение
        } else {
            let timerDisplay = document.getElementById("time-left");
            if (timerDisplay) {
                timerDisplay.innerText = `${minutesLeft} : ${timeLeft % 60}`;
            }

            // Показываем сообщение каждые 10 минут (10, 20, 30...)
            if (minutesLeft > 0 && minutesLeft % 10 === 0 && !notifiedMinutes.has(minutesLeft)) {
                // Сохраняем сообщение для человечка
                localStorage.setItem("speechMessage", `Осталось ${minutesLeft} минут!`);
                // Устанавливаем флаг, что сообщение новое
                localStorage.setItem("newMessage", Date.now());
                notifiedMinutes.add(minutesLeft);
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