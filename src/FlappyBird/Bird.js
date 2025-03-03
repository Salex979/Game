// Настройки канваса
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

// Константы игры
const GRAVITY = 0.5;
const JUMP_STRENGTH = -7;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const BIRD_SIZE = 30;
const PIPE_SPEED = 3;
const MAX_RECORDS = 5;

// Переменные игры
let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdX = 50;
let birdAlive = true;
let score = 0;
let pipes = [];
let frame = 0;
let gamePaused = false;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// Загрузка изображений
const birdUpImage = new Image();
birdUpImage.src = 'images/bird_up.png';
const birdDownImage = new Image();
birdDownImage.src = 'images/bird_down.png';
const birdMidImage = new Image();
birdMidImage.src = 'images/bird.png';
const topPipeImage = new Image();
topPipeImage.src = 'images/pipeUp.png';
const bottomPipeImage = new Image();
bottomPipeImage.src = 'images/pipeBottom.png';
const backgroundImage = new Image();
backgroundImage.src = 'images/bg.png'; // Единое изображение фона

// Класс птицы
function Bird() {
    this.x = birdX;
    this.y = birdY;
    this.width = BIRD_SIZE;
    this.height = BIRD_SIZE;

    this.draw = function() {
        if (birdVelocity < 0) {
            ctx.drawImage(birdUpImage, this.x, this.y, this.width, this.height);
        } else if (birdVelocity > 0) {
            ctx.drawImage(birdDownImage, this.x, this.y, this.width, this.height);
        } else {
            ctx.drawImage(birdMidImage, this.x, this.y, this.width, this.height);
        }
    };

    this.update = function() {
        birdVelocity += GRAVITY;
        this.y += birdVelocity;

        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            birdVelocity = 0;
        }

        if (this.y < 0) {
            this.y = 0;
            birdVelocity = 0;
        }

        this.draw();
    };

    this.jump = function() {
        birdVelocity = JUMP_STRENGTH;
    };
}

// Класс трубы
function Pipe(x) {
    this.x = x;
    this.topHeight = Math.floor(Math.random() * (canvas.height / 2));
    this.bottomHeight = canvas.height - this.topHeight - PIPE_GAP;

    this.draw = function() {
        ctx.drawImage(topPipeImage, this.x, 0, PIPE_WIDTH, this.topHeight);
        ctx.drawImage(bottomPipeImage, this.x, canvas.height - this.bottomHeight, PIPE_WIDTH, this.bottomHeight);
    };

    this.update = function() {
        this.x -= PIPE_SPEED;
        this.draw();
    };

    this.isOffScreen = function() {
        return this.x + PIPE_WIDTH < 0;
    };

    this.collidesWithBird = function(bird) {
        if (bird.x + bird.width > this.x && bird.x < this.x + PIPE_WIDTH) {
            if (bird.y < this.topHeight || bird.y + bird.height > canvas.height - this.bottomHeight) {
                return true;
            }
        }
        return false;
    };
}

// Создание птицы
const bird = new Bird();

// Обработчик нажатия клавиш
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (!birdAlive) {
            restartGame();
        } else {
            bird.jump();
        }
    }
    if (event.code === 'Escape') {
        togglePause();
    }
});

// Функция для паузы игры
function togglePause() {
    gamePaused = !gamePaused;
    if (!gamePaused) {
        gameLoop();
    }
}

// Функция перезапуска игры
function restartGame() {
    birdAlive = true;
    score = 0;
    pipes = [];
    frame = 0;
    bird.y = birdY;
    birdVelocity = 0;
    gamePaused = false;
    gameLoop();
}

// Главный игровой цикл
function gameLoop() {
    if (gamePaused) return;

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Единый фон
    
    if (!birdAlive) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Вы проиграли!', canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText('Счет: ' + score, canvas.width / 2 - 50, canvas.height / 2 + 40);
        return;
    }

    bird.update();
    if (frame % 60 === 0) {
        pipes.push(new Pipe(canvas.width));
    }
    pipes.forEach(function(pipe) {
        pipe.update();
        if (pipe.isOffScreen()) {
            pipes.shift();
            score++;
        }
        if (pipe.collidesWithBird(bird)) {
            birdAlive = false;
        }
    });

    frame++;
    requestAnimationFrame(gameLoop);
}

// Запуск игры
gameLoop();