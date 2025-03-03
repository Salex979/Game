const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Размеры экрана
const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 440;

// Настройки игры
const TILE_SIZE = 20;
const MAP_WIDTH = 40;
const MAP_HEIGHT = 40;

// Лабиринт Pac-Man
const map = [
    "wwwwwwwwwwwwwwwwwwwwwwwww",
    "w...........w...........w",
    "w.www.wwwww.w.wwwww.www.w",
    "w.www.wwwww.w.wwwww.www.w",
    "w.......................w",
    "w.www.w.wwwwwwwww.w.www.w",
    "w.....w.....w.....w.....w",
    "wwwww.wwwww.w.wwwww.wwwww",
    "    w.w...........w.w    ",
    "wwwww.w.wwww wwww.w.wwwww",
    "........w       w........",
    "wwwww.w.wwwwwwwww.w.wwwww",
    "    w.w...........w.w    ",
    "wwwww.w.wwwwwwwww.w.wwwww",
    "w...........w...........w",
    "w.www.wwwww.w.wwwww.www.w",
    "w...w...............w...w",
    "www.w.w.wwwwwwwww.w.w.www",
    "w.....w.....w.....w.....w",
    "w.wwwwwwwww.w.wwwwwwwww.w",
    "w.......................w",
    "wwwwwwwwwwwwwwwwwwwwwwwww"
];

// Направления движения
const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

// Текущее направление Пакмана
let direction = DIRECTIONS.RIGHT;

// Позиция Пакмана
let pacmanX = 13;
let pacmanY = 23;

// Приведение
let ghostX = 14;
let ghostY = 15;

// Функция для рисования карты
function drawMap() {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            switch (map[y][x]) {
                case 'w':
                    ctx.fillStyle = "blue";
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    break;
                case '.':
                    ctx.fillStyle = "white";
                    ctx.fillRect(x * TILE_SIZE + 6, y * TILE_SIZE + 6, 4, 4);
                    break;
                case ' ':
                    ctx.fillStyle = "black";
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    break;
            }
        }
    }
}

// Функция для рисования Пакмана
function drawPacman() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(pacmanX * TILE_SIZE + TILE_SIZE / 2, pacmanY * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 2, Math.PI * 0.25, Math.PI * 1.75);
    ctx.fill();
}

// Функция для рисования привидений
function drawGhost() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ghostX * TILE_SIZE + TILE_SIZE / 2, ghostY * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Обновление состояния игры
function updateGameState() {
    // Движение Пакмана
    pacmanX += direction.x;
    pacmanY += direction.y;

    // Проверяем границы карты
    if (pacmanX < 0 || pacmanX >= MAP_WIDTH || pacmanY < 0 || pacmanY >= MAP_HEIGHT) {
        console.log("Выход за пределы карты!");
    }

    // Логика столкновения с едой
    if (map[pacmanY][pacmanX] === '.') {
        map[pacmanY][pacmanX] = ' ';
        console.log("Пакман съел точку!");
    }

    // Логика столкновения с привидениями
    if (pacmanX === ghostX && pacmanY === ghostY) {
        console.log("Пакман столкнулся с привидением!");
    }
}

// Основная функция для обновления и рендеринга игры
function gameLoop() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    drawMap();
    drawPacman();
    drawGhost();
    updateGameState();
    requestAnimationFrame(gameLoop);
}

// Установка размеров канвы
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

// Начало игры
gameLoop();

// Управление клавишами
document.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
        case 37: // Left arrow key
            direction = DIRECTIONS.LEFT;
            break;
        case 38: // Up arrow key
            direction = DIRECTIONS.UP;
            break;
        case 39: // Right arrow key
            direction = DIRECTIONS.RIGHT;
            break;
        case 40: // Down arrow key
            direction = DIRECTIONS.DOWN;
            break;
    }
});