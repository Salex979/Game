document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("Start_button");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");

    if (startButton) {
        startButton.addEventListener("click", function () {
            window.open("/src/Main/main.html", "_blank");
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", async () => {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                chrome.storage.local.set({ token: data.token });
                document.getElementById("status").textContent = "Успешный вход!";
                
                // Переход на main.html после успешного входа
                setTimeout(() => {
                    window.open("/src/Main/main.html", "_blank");
                }, 1000); // Задержка 1 секунда для отображения статуса
            } else {
                document.getElementById("status").textContent = "Ошибка: " + data.message;
            }
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener("click", async () => {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const response = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                document.getElementById("status").textContent = "Регистрация успешна! Теперь войдите.";
            } else {
                document.getElementById("status").textContent = "Ошибка: " + data.message;
            }
        });
    }
});
