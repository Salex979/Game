document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");

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
                // Сохраняем в chrome.storage, что пользователь только что вошел
                chrome.storage.local.set({ token: data.token, showWelcome: true });

                // Переход на главную страницу
                chrome.tabs.create({ url: "/src/Main/main.html" });

            } else {
                document.getElementById("status").textContent = "Ошибка: " + data.message;
            }
        });
    }
});
