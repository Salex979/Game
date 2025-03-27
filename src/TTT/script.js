document.addEventListener("DOMContentLoaded", () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(200, 200); // Размер холста
    document.getElementById("character-container").appendChild(renderer.domElement);

    // Свет
    const light = new THREE.DirectionalLight(0xD3D3D3, 0.85);
    light.position.set(-1, 0, 7);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.radius = 4;
    scene.add(light);

    // Материалы
    const materialHead = new THREE.MeshStandardMaterial({ color: 0xADFF2F });
    const materialBody = new THREE.MeshStandardMaterial({ color: 0x00A2E8 });
    const materialLimb = new THREE.MeshStandardMaterial({ color: 0xADFF2F });
    const materialEyes = new THREE.MeshStandardMaterial({ color: 0x000000 });

    // Голова
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 256, 256), materialHead);
    head.position.y = 1.6;
    head.castShadow = true; // Голова отбрасывает тень
    head.receiveShadow = true; // Голова принимает тень от других объектов
    scene.add(head);

    // Глаза
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), materialEyes);
    leftEye.position.set(-0.15, 1.7, 0.5);
    scene.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), materialEyes);
    rightEye.position.set(0.15, 1.7, 0.5);
    scene.add(rightEye);

    // Короткое цилиндрическое тело
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.9, 256), materialBody);
    body.position.y = 1;
    body.castShadow = true; // Тело отбрасывает тень
    body.receiveShadow = true; // Тело принимает тень
    scene.add(body);

    // Руки с наклоном и закруглёнными концами
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 64, 1, true), materialLimb);
    leftArm.position.set(-0.5, 0.97, 0);
    leftArm.rotation.z = -0.5;
    leftArm.castShadow = true; // Рука отбрасывает тень
    leftArm.receiveShadow = true; // Рука принимает тень
    scene.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 64, 1, true), materialLimb);
    rightArm.position.set(0.5, 0.97, 0);
    rightArm.rotation.z = 0.5;
    rightArm.castShadow = true; // Рука отбрасывает тень
    rightArm.receiveShadow = true; // Рука принимает тень
    scene.add(rightArm);

    // Короткие ноги, ближе к телу
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 64, 1, true), materialLimb);
    leftLeg.position.set(-0.2, 0.57, 0);
    leftLeg.castShadow = true; // Нога отбрасывает тень
    leftLeg.receiveShadow = true; // Нога принимает тень
    scene.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 64, 1, true), materialLimb);
    rightLeg.position.set(0.2, 0.57, 0);
    rightLeg.castShadow = true; // Нога отбрасывает тень
    rightLeg.receiveShadow = true; // Нога принимает тень
    scene.add(rightLeg);

    scene.scale.set(1.3, 1.3, 1.3); // Увеличиваем размер в 1.5 раза

    const group = new THREE.Group(); // Группа для центрирования
    group.add(head, body, leftArm, rightArm, leftLeg, rightLeg);
    scene.add(group);

    group.position.set(0, 0, 0);

    camera.position.set(0, 1, 3); // Камера смотрит прямо на центр человечка
    camera.lookAt(0, 1, 0);

    // Глаза следят за курсором
    document.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        leftEye.position.x = -0.15 + mouseX * 0.1;
        rightEye.position.x = 0.15 + mouseX * 0.1;
    });

    // Анимация
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
});

function showSpeechBubble(message) {
    const speechBubble = document.getElementById("speech-bubble");
    if(!speechBubble) return;
    speechBubble.innerText = message;

    const messages = [
        "Привет, друг!",
        "Как тебе игра?",
        "Давай сыграем!",
        "Ты сможешь победить?",
        "Я слежу за тобой..."
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    speechBubble.innerText = randomMessage;
    speechBubble.style.opacity = "1"; // Плавное появление
    speechBubble.style.display = "block";

    setTimeout(() => {
        speechBubble.style.opacity = "0"; // Плавное исчезновение
        setTimeout(() => {
            speechBubble.style.display = "none";
        }, 1000); // Подождём, пока закончится анимация
    }, 10000); // Облачко исчезает через 10 секунды
    
}

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

