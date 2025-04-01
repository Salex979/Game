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