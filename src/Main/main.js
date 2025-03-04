// Переключение темы
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Проверка сохранённой темы
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}