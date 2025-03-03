// Функция для открытия/закрытия меню
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('show');
}

// Переключение темной и светлой темы
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');
}

// Добавление заметки
function addNote() {
    const noteInput = document.getElementById('note-input');
    const noteList = document.getElementById('note-list');
    if (noteInput.value.trim() !== "") {
        const note = document.createElement('div');
        note.classList.add('note');
        note.textContent = noteInput.value;
        noteList.appendChild(note);
        noteInput.value = ""; // Очищаем поле ввода
    }
}