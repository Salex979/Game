const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-piece-canvas');
const nextCtx = nextCanvas.getContext('2d');
const scoreDisplay = document.createElement('div');
scoreDisplay.style.color = 'white';
scoreDisplay.style.fontSize = '20px';
document.body.insertBefore(scoreDisplay, document.getElementById('game-container'));

const rows = 20;
const cols = 10;
const cellSize = 20;
let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let interval = null;
let gameOver = false;

const colors = ['cyan', 'yellow', 'purple', 'red', 'green', 'blue', 'orange'];

const shapes = [
    [[1, 1, 1, 1]],       // I
    [[1, 1], [1, 1]],     // O
    [[1, 1, 1], [0, 1, 0]],   // T
    [[1, 1, 0], [0, 1, 1]],   // Z
    [[0, 1, 1], [1, 1, 0]],   // S
    [[1, 1, 1], [0, 0, 1]],   // J
    [[1, 1, 1], [1, 0, 0]]    // L
];

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

function getRandomPiece() {
    const index = Math.floor(Math.random() * shapes.length);
    return { shape: shapes[index], color: colors[index], x: Math.floor(cols / 2 - 1), y: 0 };
}

function rotate(piece) {
    return piece[0].map((_, i) => piece.map(row => row[i])).reverse();
}

function checkCollision(piece, offsetX, offsetY) {
    return piece.shape.some((row, y) => row.some((cell, x) => {
        if (!cell) return false;
        let newX = piece.x + offsetX + x;
        let newY = piece.y + offsetY + y;
        return newX < 0 || newX >= cols || newY >= rows || (newY >= 0 && board[newY][newX]);
    }));
}

function moveDown() {
    if (checkCollision(currentPiece, 0, 1)) {
        lockPiece();
        clearLines();
        currentPiece = nextPiece;
        nextPiece = getRandomPiece();
        drawNextPiece();
        if (checkCollision(currentPiece, 0, 0)) {
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

function initGame() {
    createBoard();
    currentPiece = getRandomPiece();
    nextPiece = getRandomPiece();
    interval = setInterval(moveDown, 500);
    document.addEventListener('keydown', handleKeyPress);
    updateScore();
    draw();
    drawNextPiece();
}

function handleKeyPress(event) {
    switch (event.keyCode) {
        case 37:
            if (!checkCollision(currentPiece, -1, 0)) currentPiece.x--;
            break;
        case 39:
            if (!checkCollision(currentPiece, 1, 0)) currentPiece.x++;
            break;
        case 40:
            moveDown();
            break;
        case 38:
            const rotated = { ...currentPiece, shape: rotate(currentPiece.shape) };
            if (!checkCollision(rotated, 0, 0)) currentPiece.shape = rotated.shape;
            break;
    }
    draw();
}

initGame();
