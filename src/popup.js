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
                chrome.storage.local.set({ 
                    token: data.token, 
                    showWelcome: true,
                    username: data.user  // 👈 сохраняем username с тегом, типа Alex#0001
                });
                chrome.tabs.create({ 
                    url: "/src/Main/main.html?welcome=true&username=" + encodeURIComponent(data.user)
                });                
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
