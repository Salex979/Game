// Функция для открытия/закрытия меню
document.addEventListener("DOMContentLoaded", function () {
    const burgerMenu = document.querySelector(".burger-menu");
    const menu = document.getElementById("menu");

    burgerMenu.addEventListener("click", function () {
        menu.classList.toggle("show");
        burgerMenu.classList.toggle("active");
    });
});

// Переключение темной и светлой темы
document.addEventListener("DOMContentLoaded", function () {
    const themeToggleBtn = document.getElementById("theme-toggle");

    // Проверяем, есть ли сохранённая тема в localStorage
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        document.body.classList.add(savedTheme);
    } else {
        document.body.classList.add("light-theme"); // Тема по умолчанию
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", function (event) {
            event.preventDefault();
            
            // Переключаем классы тем
            document.body.classList.toggle("dark-theme");
            document.body.classList.toggle("light-theme");

            // Определяем текущую тему и сохраняем в localStorage
            const currentTheme = document.body.classList.contains("dark-theme") ? "dark-theme" : "light-theme";
            localStorage.setItem("theme", currentTheme);
        });
    }
});



// Добавление заметки
document.addEventListener("DOMContentLoaded", function () {
    const addNoteBtn = document.getElementById("add-note-btn");

    if (addNoteBtn) {
        addNoteBtn.addEventListener("click", function () {
            const noteInput = document.getElementById("note-input");
            const noteList = document.getElementById("note-list");

            if (noteInput.value.trim() !== "") {
                const note = document.createElement("div");
                note.classList.add("note");
                note.textContent = noteInput.value;
                noteList.appendChild(note);
                noteInput.value = "";
            }
        });
    }
});
