// snake.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = []; // Массив сегментов змеи
let direction = 'right'; // Направление движения
let food = { x: 0, y: 0 }; // Координаты еды

function drawSnake() {
    ctx.fillStyle = '#fff';
    for(let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * 10, snake[i].y * 10, 10, 10);
    }
}

function moveSnake() {
    // Движение змеи
}

function generateFood() {
    // Генерация новой еды
}

function checkCollision() {
    // Проверка столкновений
}

// Основной цикл игры
function gameLoop() {
    requestAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawSnake();
    generateFood();
    checkCollision();
}

window.addEventListener('load', () => {
    gameLoop();
});