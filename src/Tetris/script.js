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

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", function (event) {
            event.preventDefault();
            document.body.classList.toggle("dark-theme");
            document.body.classList.toggle("light-theme");
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
