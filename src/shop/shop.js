document.addEventListener("DOMContentLoaded", function() {
    // Инициализация системы монет
    if (!window.coinSystem) {
        window.coinSystem = new CoinSystem();
    }
    
    // Обновление отображения монет
    function updateCoinsDisplay() {
        const coinsDisplay = document.querySelector('.coins-display .coins-count');
        if (coinsDisplay) {
            coinsDisplay.textContent = coinSystem.coins;
        }
    }
    updateCoinsDisplay();
    
    // Загрузка купленных предметов
    const purchasedItems = JSON.parse(localStorage.getItem('purchasedItems')) || {};
    const equippedItem = localStorage.getItem('equippedItem');
    
    // Инициализация превью человечков с Three.js
    initCharacterPreviews();
    
    // Инициализация карточек товаров
    document.querySelectorAll('.item-card').forEach(card => {
        const itemId = card.dataset.itemId;
        
        // Если предмет уже куплен
        if (purchasedItems[itemId]) {
            const btn = card.querySelector('.buy-btn');
            btn.textContent = 'Надеть';
            
            // Если предмет надет
            if (equippedItem.id === itemId) {
                card.classList.add('equipped');
                btn.textContent = 'Надето';
            }
        }
    });

    // Обработка покупок
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.item-card');
            const itemId = card.dataset.itemId;
            const price = parseInt(card.dataset.price);

            // Если предмет уже куплен - просто надеваем
            if (purchasedItems[itemId]) {
                equipItem(itemId);
                return;
            }

            // Покупка нового предмета
            if (window.coinSystem.coins >= price) {
                window.coinSystem.addCoins(-price);
                
                purchasedItems[itemId] = true;
                localStorage.setItem('purchasedItems', JSON.stringify(purchasedItems));
                
                equipItem(itemId);
                
                this.textContent = 'Надето';
                card.classList.add('purchased');
                setTimeout(() => card.classList.remove('purchased'), 1000);
            } else {
                alert('Недостаточно монет!');
            }
        });
    });

    
    // Функция для обновления текста кнопки
    function updateButtonText(card, itemId) {
        const btn = card.querySelector('.buy-btn');
        if (purchasedItems[itemId]) {
            btn.textContent = itemId === equippedItem ? 'Надето' : 'Надеть';
            btn.addEventListener('click', function() {
                equipItem(itemId);
                btn.textContent = 'Надето';
            });
        }
    }
    
    // Функция надевания предмета
    function equipItem(itemId) {
        const colors = {
            'body-green': 0x74A892,
            'body-blue': 0x008585,
            'body-red': 0xC7522A,
            'body-gold': 0xE5C185
        };
        
        const equippedItem = { 
            id: itemId,
            color: colors[itemId]
        };
        localStorage.setItem('equippedItem', JSON.stringify(equippedItem));
        
        const update = {
            type: 'equipClothing',
            color: colors[itemId],
            timestamp: Date.now()
        };
        localStorage.setItem('clothingUpdate', JSON.stringify(update));
        localStorage.setItem('clothingUpdateTime', Date.now());

        // Обновляем вид в магазине
        document.querySelectorAll('.item-card').forEach(card => {
            card.classList.remove('equipped');
            const btn = card.querySelector('.buy-btn');
            if (btn) btn.textContent = 'Надеть';
            
            if (card.dataset.itemId === itemId) {
                card.classList.add('equipped');
                const btn = card.querySelector('.buy-btn');
                if (btn) btn.textContent = 'Надето';
            }
        });
    }
    
    // Инициализация превью человечков с Three.js
    function initCharacterPreviews() {
        const colors = {
            'body-green': { body: 0x74A892, head: 0xADFF2F },
            'body-blue': { body: 0x008585, head: 0xADFF2F },
            'body-red': { body: 0xC7522A, head: 0xADFF2F },
            'body-gold': { body: 0xE5C185, head: 0xADFF2F }
        };
        
        for (const [id, color] of Object.entries(colors)) {
            const preview = document.getElementById(`preview-${id.split('-')[1]}`);
            if (preview) {
                createCharacterPreview(preview, color);
            }
        }
        
        // Пометка купленных и надетых предметов
        document.querySelectorAll('.item-card').forEach(card => {
            const itemId = card.dataset.itemId;
            if (purchasedItems[itemId]) {
                const btn = card.querySelector('.buy-btn');
                btn.textContent = itemId === equippedItem ? 'Надето' : 'Надеть';
                btn.addEventListener('click', function() {
                    equipItem(itemId);
                });
                
                if (itemId === equippedItem) {
                    card.classList.add('equipped');
                }
            }
        });
    }
    
    // Создание превью персонажа с Three.js
    function createCharacterPreview(container, colors) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.set(0, 1, 3);
        
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(150, 150);
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
        
        // Освещение
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(-1, 1, 3);
        scene.add(directionalLight);
        
        // Создание персонажа
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 32),
            new THREE.MeshStandardMaterial({ color: colors.head })
        );
        head.position.y = 1.6;
        
        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 0.9, 32),
            new THREE.MeshStandardMaterial({ color: colors.body })
        );
        body.position.y = 1;
        
        const group = new THREE.Group();
        group.add(head, body);
        scene.add(group);
        
        camera.lookAt(0, 1, 0);
        
        function animate() {
            requestAnimationFrame(animate);
            group.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        
        animate();
    }
    
    // Показ сообщения в облачке
    function showSpeechBubble(message) {
        const speechBubble = document.getElementById('speech-bubble');
        if (!speechBubble) return;
        
        speechBubble.textContent = message;
        speechBubble.style.display = 'block';
        speechBubble.style.opacity = '1';
        
        setTimeout(() => {
            speechBubble.style.opacity = '0';
            setTimeout(() => speechBubble.style.display = 'none', 1000);
        }, 3000);
    }
});

// Обработчики для бургер-меню и темы
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
    
    // Применение сохраненной темы
    const savedTheme = localStorage.getItem("theme") || "light-theme";
    document.body.classList.add(savedTheme);
});