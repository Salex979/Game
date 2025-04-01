document.addEventListener("DOMContentLoaded", () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(200, 200);
    const container = document.getElementById("character-container");
    container.appendChild(renderer.domElement);

    container.style.cursor = 'pointer';
    container.addEventListener('click', () => {
        window.location.href = 'shop/character-shop.html';
    });

    // Освещение
    const light = new THREE.DirectionalLight(0xD3D3D3, 0.85);
    light.position.set(-1, 0, 7);
    light.castShadow = true;
    scene.add(light);

    // Материалы персонажа (теперь доступны для изменения)
    const materials = {
        head: new THREE.MeshStandardMaterial({ color: 0xADFF2F }),
        body: new THREE.MeshStandardMaterial({ color: 0x00A2E8 }),
        limb: new THREE.MeshStandardMaterial({ color: 0xADFF2F }),
        eyes: new THREE.MeshStandardMaterial({ color: 0x000000 }),
        originalBody: null // Для сохранения оригинального цвета
    };

    // Создание частей тела (оригинальный персонаж без изменений)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 256, 256), materials.head);
    head.position.y = 1.6;
    scene.add(head);

    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), materials.eyes);
    leftEye.position.set(-0.15, 1.7, 0.5);
    scene.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), materials.eyes);
    rightEye.position.set(0.15, 1.7, 0.5);
    scene.add(rightEye);

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.9, 256), materials.body);
    body.position.y = 1;
    scene.add(body);

    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 64, 1, true), materials.limb);
    leftArm.position.set(-0.5, 0.97, 0);
    leftArm.rotation.z = -0.5;
    scene.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 64, 1, true), materials.limb);
    rightArm.position.set(0.5, 0.97, 0);
    rightArm.rotation.z = 0.5;
    scene.add(rightArm);

    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 64, 1, true), materials.limb);
    leftLeg.position.set(-0.2, 0.57, 0);
    scene.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 64, 1, true), materials.limb);
    rightLeg.position.set(0.2, 0.57, 0);
    scene.add(rightLeg);

    scene.scale.set(1.3, 1.3, 1.3);

    const group = new THREE.Group();
    group.add(head, body, leftArm, rightArm, leftLeg, rightLeg);
    scene.add(group);

    camera.position.set(0, 1, 3);
    camera.lookAt(0, 1, 0);

    // ===== СИСТЕМА ОДЕЖДЫ =====
    function updateBodyColor(color) {
        // Сохраняем оригинальный материал при первом изменении
        if (!materials.originalBody) {
            materials.originalBody = materials.body.clone();
        }
        
        // Применяем новый цвет
        materials.body.color.setHex(color);
        
        // Сохраняем в localStorage
        localStorage.setItem('characterClothes', JSON.stringify({
            bodyColor: color
        }));
    }

    // Загрузка сохраненной одежды
    function loadClothes() {
        const savedClothes = JSON.parse(localStorage.getItem('characterClothes')) || {};
        if (savedClothes.bodyColor) {
            updateBodyColor(savedClothes.bodyColor);
        }
    }

    // Проверка обновлений из магазина
    let lastClothingUpdate = 0;

    function checkClothingUpdates() {
        const updateTime = localStorage.getItem('clothingUpdateTime');
        if (!updateTime || updateTime <= lastClothingUpdate) return;
        
        const update = JSON.parse(localStorage.getItem('clothingUpdate'));
        if (!update) return;
        
        lastClothingUpdate = updateTime;
        
        if (update.type === 'equipClothing') {
            updateBodyColor(update.color);
        }
    }

    // Глаза следят за курсором
    document.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        leftEye.position.x = -0.15 + mouseX * 0.1;
        rightEye.position.x = 0.15 + mouseX * 0.1;
    });

    // Анимация с проверкой обновлений одежды
    function animate() {
        requestAnimationFrame(animate);
        checkClothingUpdates();
        renderer.render(scene, camera);
    }

    // Инициализация
    loadClothes();
    animate();
});

// Остальные функции (showRandomSpeechBubble и checkForNewMessage) остаются без изменений


function showRandomSpeechBubble(message) {
    const RandomSpeechBubble = document.getElementById("speech-bubble");
    if(!RandomSpeechBubble) return;
    RandomSpeechBubble.innerText = message;

    const messages = [
        "Привет, друг!",
        "Как тебе игра?",
        "Давай сыграем!",
        "Ты сможешь победить?",
        "Я слежу за тобой..."
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    RandomSpeechBubble.innerText = randomMessage;
    RandomSpeechBubble.style.opacity = "1"; // Плавное появление
    RandomSpeechBubble.style.display = "block";

    setTimeout(() => {
        RandomSpeechBubble.style.opacity = "0"; // Плавное исчезновение
        setTimeout(() => {
            RandomSpeechBubble.style.display = "none";
        }, 1000); // Подождём, пока закончится анимация
    }, 10000); // Облачко исчезает через 10 секунды
    
}

// Запускаем показ баблов каждые 30 секунд
setInterval(showRandomSpeechBubble, 30000);

// Показываем первый бабл сразу после загрузки
document.addEventListener("DOMContentLoaded", showRandomSpeechBubble);

document.addEventListener("DOMContentLoaded", function() {
    const characterContainer = document.getElementById("character-container");
    const speechBubble = document.getElementById("speech-bubble");
    let lastMessageTime = 0;

    function checkForNewMessage() {
        const newMessageTime = localStorage.getItem("newMessage");
        const message = localStorage.getItem("speechMessage");

        // Если есть новое сообщение и оно еще не показывалось
        if (newMessageTime && message && parseInt(newMessageTime) > lastMessageTime) {
            lastMessageTime = parseInt(newMessageTime);
            showSpeechBubble(message);
            
            // Удаляем сообщение через 3 секунды
            setTimeout(() => {
                speechBubble.textContent = '';
                speechBubble.style.display = 'none';
            }, 3000);
        }

        setTimeout(checkForNewMessage, 1000);
    }

    function showSpeechBubble(message) {
        speechBubble.textContent = message;
        speechBubble.style.display = 'block';
    }

    // Начинаем проверять сообщения
    checkForNewMessage();
});