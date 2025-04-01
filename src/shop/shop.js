document.addEventListener("DOMContentLoaded", function() {
    // Инициализация системы монет
    if (!window.coinSystem) {
        window.coinSystem = new CoinSystem();
    }
    
    // Загрузка купленных предметов
    const purchasedItems = JSON.parse(localStorage.getItem('purchasedItems')) || {};
    const equippedItem = localStorage.getItem('equippedItem');
    
    // Инициализация превью человечков
    initCharacterPreviews();
    
    // Обработчики для кнопок покупки
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.item-card');
            const itemId = card.dataset.itemId;
            const price = parseInt(card.dataset.price);
            
            if (coinSystem.coins >= price) {
                // Покупка предмета
                coinSystem.addCoins(-price);
                purchasedItems[itemId] = true;
                localStorage.setItem('purchasedItems', JSON.stringify(purchasedItems));
                
                // Одеваем предмет
                equipItem(itemId);
                
                alert('Покупка успешна!');
            } else {
                alert('Недостаточно монет!');
            }
        });
    });
    
    // Функция для надевания предмета
    function equipItem(itemId) {
        localStorage.setItem('equippedItem', itemId);
        
        // Обновляем отображение на всех карточках
        document.querySelectorAll('.item-card').forEach(card => {
            card.classList.remove('equipped');
            if (card.dataset.itemId === itemId) {
                card.classList.add('equipped');
            }
        });
        
        // Здесь можно добавить код для обновления внешнего вида человечка
        updateCharacterAppearance(itemId);
    }
    
    // Функция для обновления внешнего вида человечка
    function updateCharacterAppearance(itemId) {
        // Этот код должен синхронизироваться с person.js
        // Здесь просто пример - реальная реализация зависит от вашего person.js
        console.log(`Человечек теперь носит: ${itemId}`);
    }
    
    // Инициализация превью человечков
    function initCharacterPreviews() {
        const previews = {
            'body-green': { body: '#74A892', head: '#ADFF2F' },
            'body-blue': { body: '#008585', head: '#ADFF2F' },
            'body-red': { body: '#C7522A', head: '#ADFF2F' },
            'body-gold': { body: '#E5C185', head: '#ADFF2F' }
        };
        
        for (const [id, colors] of Object.entries(previews)) {
            const preview = document.getElementById(`preview-${id.split('-')[1]}`);
            if (preview) {
                // Здесь должна быть логика отрисовки человечка с нужными цветами
                // Это упрощенный пример - в реальности нужно использовать Three.js как в person.js
                preview.style.backgroundColor = colors.body;
                preview.innerHTML = `<div style="width:40px;height:40px;border-radius:50%;background:${colors.head};margin:20px auto;"></div>`;
            }
        }
        
        // Пометка купленных и надетых предметов
        document.querySelectorAll('.item-card').forEach(card => {
            const itemId = card.dataset.itemId;
            if (purchasedItems[itemId]) {
                const btn = card.querySelector('.buy-btn');
                btn.textContent = 'Надеть';
                btn.addEventListener('click', function() {
                    equipItem(itemId);
                });
                
                if (itemId === equippedItem) {
                    card.classList.add('equipped');
                }
            }
        });
    }
});

// Обработчики для бургер-меню и темы (как в ttt.js)
document.addEventListener("DOMContentLoaded", function() {
    const burgerMenu = document.querySelector(".burger-menu");
    const menu = document.getElementById("menu");
    
    burgerMenu.addEventListener("click", function() {
        menu.classList.toggle("show");
    });
    
    const themeToggleBtn = document.getElementById("theme-toggle");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", function(event) {
            event.preventDefault();
            document.body.classList.toggle("dark-theme");
            document.body.classList.toggle("light-theme");
            const currentTheme = document.body.classList.contains("dark-theme") ? "dark-theme" : "light-theme";
            localStorage.setItem("theme", currentTheme);
        });
    }
});