console.log("Work");

// Переключение темы
document.addEventListener("DOMContentLoaded", () => {
    const themeSwitch = document.getElementById("theme-switch");

    // Функция переключения темы
    function toggleTheme() {
        document.body.classList.toggle("dark-mode");

        // Сохранение состояния темы в localStorage
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }

    // Устанавливаем тему при загрузке страницы
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    // Назначаем обработчик события
    themeSwitch.addEventListener("click", toggleTheme);
   
});

document.addEventListener("DOMContentLoaded", function () {
    // Проверяем, нужно ли показывать модальное окно
    chrome.storage.local.get(["showWelcome"], function (result) {
        if (result.showWelcome) {
            const modal = document.getElementById("welcomeModal");
            const closeBtn = document.querySelector(".close");

            modal.style.display = "block"; // Показываем модалку

            closeBtn.addEventListener("click", function () {
                modal.style.display = "none"; // Закрытие при клике на крестик
            });

            window.addEventListener("click", function (event) {
                if (event.target === modal) {
                    modal.style.display = "none"; // Закрытие при клике вне окна
                }
            });

            // Сбрасываем флаг, чтобы окно не появлялось постоянно
            chrome.storage.local.set({ showWelcome: false });
        }
    });
});
