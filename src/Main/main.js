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

    // Проверяем, нужно ли показать приветственное окно
    const urlParams = new URLSearchParams(window.location.search);
    const showWelcome = urlParams.get('welcome') === 'true';
    
    if (showWelcome) {
        // Получаем имя пользователя из localStorage или запрашиваем
        const username = localStorage.getItem('username');
        showWelcomeModal(username);
    }
   
});

function showWelcomeModal(username) {
    const modal = document.getElementById('welcome-modal');
    const usernameDisplay = document.getElementById('username-display');
    const submitBtn = document.getElementById('submit-survey');
    const recommendations = document.getElementById('recommendations');
    const closeBtn = document.getElementById('close-modal');
    
    usernameDisplay.textContent = username;
    modal.style.display = 'flex';
    
    submitBtn.addEventListener('click', function() {
        const profession = document.getElementById('profession').value;
        const tiredness = document.getElementById('tiredness').value;
        
        // Генерируем рекомендации
        const { time, games } = generateRecommendations(profession, tiredness);
        
        document.getElementById('recommended-time').textContent = `Рекомендуемое время: ${time}`;
        document.getElementById('recommended-games').textContent = `Рекомендуемые игры: ${games}`;
        
        recommendations.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
}

function generateRecommendations(profession, tiredness) {
    // Логика рекомендаций
    let time = '';
    let games = '';
    
    // Определяем рекомендуемое время
    switch(tiredness) {
        case 'low':
            time = '10-15 минут';
            break;
        case 'medium':
            time = '15-20 минут';
            break;
        case 'high':
            time = '20-25 минут';
            break;
        case 'exhausted':
            time = '25-30 минут';
            break;
    }
    
    // Определяем рекомендуемые игры
    switch(profession) {
        case 'it':
            games = tiredness === 'high' || tiredness === 'exhausted' 
                ? 'Змейка, 2048 (простые игры для расслабления)' 
                : 'Тетрис, Крестики-нолики (логические игры)';
            break;
        case 'teacher':
            games = 'Flappy Bird, Змейка (игры на реакцию)';
            break;
        case 'student':
            games = tiredness === 'high' || tiredness === 'exhausted' 
                ? '2048 (простая логическая игра)' 
                : 'Тетрис, Крестики-нолики (для развития мышления)';
            break;
        case 'manager':
            games = 'Flappy Bird (быстрая игра для снятия стресса)';
            break;
        case 'creative':
            games = 'Тетрис (развивает пространственное мышление)';
            break;
        default:
            games = 'Змейка, Тетрис (классические игры для всех)';
    }
    
    return { time, games };
}