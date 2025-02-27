const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-piece-canvas');
const nextCtx = nextCanvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const pauseButton = document.getElementById('pause-button');

let isPaused = false;
let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let interval = null;
let gameOver = false;

const rows = 20;
const cols = 10;
const cellSize = 20;
const shapes = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 1], [0, 0, 1]], // J
    [[1, 1, 1], [1, 0, 0]] // L
];
const colors = ['cyan', 'yellow', 'purple', 'red', 'green', 'blue', 'orange'];

function createBoard() {
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
}

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, r) => row.forEach((cell, c) => {
        if (cell) drawCell(ctx, c, r, cell);
    }));
}

function getRandomShape() {
    const index = Math.floor(Math.random() * shapes.length);
    return { shape: shapes[index], color: colors[index] };
}

function rotate(piece) {
    return piece[0].map((_, i) => piece.map(row => row[i])).reverse();
}

function checkCollision(piece, offsetX, offsetY) {
    return piece.some((row, y) => row.some((cell, x) => {
        if (!cell) return false;
        let newX = currentPiece.x + offsetX + x;
        let newY = currentPiece.y + offsetY + y;
        return newX < 0 || newX >= cols || newY >= rows || (newY >= 0 && board[newY][newX]);
    }));
}

function moveDown() {
    if (isPaused) return;
    if (checkCollision(currentPiece.shape, 0, 1)) {
        lockPiece();
        clearLines();
        currentPiece = nextPiece;
        nextPiece = getRandomShape();
        nextPiece.x = Math.floor(cols / 2 - 1);
        nextPiece.y = 0;
        drawNextPiece();
        if (checkCollision(currentPiece.shape, 0, 0)) {
            gameOver = true;
            clearInterval(interval);
            document.querySelector('.game-over').style.display = 'block';
        }
    } else {
        currentPiece.y++;
    }
    draw();
}

function lockPiece() {
    currentPiece.shape.forEach((row, y) => row.forEach((cell, x) => {
        if (cell) board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
    }));
}

function clearLines() {
    let linesCleared = 0;
    board = board.filter(row => row.some(cell => !cell));
    while (board.length < rows) {
        board.unshift(Array(cols).fill(0));
        linesCleared++;
    }
    score += linesCleared * 10;
    updateScore();
}

function updateScore() {
    scoreDisplay.textContent = `Счет: ${score}`;
}

function draw() {
    drawBoard();
    currentPiece.shape.forEach((row, y) => row.forEach((cell, x) => {
        if (cell) drawCell(ctx, currentPiece.x + x, currentPiece.y + y, currentPiece.color);
    }));
}

function drawNextPiece() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    nextPiece.shape.forEach((row, y) => row.forEach((cell, x) => {
        if (cell) drawCell(nextCtx, x, y, nextPiece.color);
    }));
}

function togglePause() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Продолжить' : 'Пауза';
}

pauseButton.addEventListener('click', togglePause);

function initGame() {
    createBoard();
    currentPiece = getRandomShape();
    currentPiece.x = Math.floor(cols / 2 - 1);
    currentPiece.y = 0;
    nextPiece = getRandomShape();
    nextPiece.x = 0;
    nextPiece.y = 0;
    interval = setInterval(moveDown, 500);
    document.addEventListener('keydown', handleKeyPress);
    updateScore();
    draw();
    drawNextPiece();
}

function handleKeyPress(event) {
    if (isPaused) return;
    switch (event.keyCode) {
        case 37: // Left arrow
            if (!checkCollision(currentPiece.shape, -1, 0)) currentPiece.x--;
            break;
        case 39: // Right arrow
            if (!checkCollision(currentPiece.shape, 1, 0)) currentPiece.x++;
            break;
        case 40: // Down arrow
            moveDown();
            break;
        case 38: // Up arrow (rotate)
            let rotated = rotate(currentPiece.shape);
            if (!checkCollision(rotated, 0, 0)) currentPiece.shape = rotated;
            break;
    }
    draw();
}

initGame();
