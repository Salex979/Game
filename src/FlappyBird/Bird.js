// Настройки канваса
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 500;

// Константы игры
const GRAVITY = 0.5;
const JUMP_STRENGTH = -7;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const BIRD_SIZE = 30;
const PIPE_SPEED = 2;
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
let coins = parseInt(localStorage.getItem('gameCoins')) || 0;
let lastCoinScore = 0; // Для отслеживания, когда давать монеты

// Система монет
function updateCoins(amount) {
    coins += amount;
    localStorage.setItem('gameCoins', coins);
    updateCoinDisplay();
    animateCoins();
}

function updateCoinDisplay() {
    const display = document.getElementById('coins-display');
    if (display) {
        display.innerHTML = `🪙 <span class="coins-count">${coins}</span>`;
    }
}

function animateCoins() {
    const display = document.getElementById('coins-display');
    if (display) {
        display.classList.add('coin-animation');
        setTimeout(() => {
            display.classList.remove('coin-animation');
        }, 800);
    }
}

// Инициализация отображения монет
function initCoinDisplay() {
    if (!document.getElementById('coins-display')) {
        const coinsDisplay = document.createElement('div');
        coinsDisplay.id = 'coins-display';
        coinsDisplay.className = 'coins-display';
        document.body.prepend(coinsDisplay);
    }
    updateCoinDisplay();
}

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
backgroundImage.src = 'images/bg.png';

// Класс птицы
function Bird() {
    this.x = birdX;
    this.y = birdY;
    this.width = BIRD_SIZE;
    this.height = BIRD_SIZE;

    this.draw = function() {
        if (birdVelocity < 0) {
            if (ctx && birdUpImage.complete) {
                ctx.drawImage(birdUpImage, this.x, this.y, this.width, this.height);
            }
        } else if (birdVelocity > 0) {
            if (ctx && birdDownImage.complete) {
                ctx.drawImage(birdDownImage, this.x, this.y, this.width, this.height);
            }            
        } else {
            if (ctx && birdMidImage.complete) {
                ctx.drawImage(birdMidImage, this.x, this.y, this.width, this.height);
            }
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
    this.passed = false;

    this.draw = function() {
        if (ctx && topPipeImage.complete) {
            ctx.drawImage(topPipeImage, this.x, 0, PIPE_WIDTH, this.topHeight);
        }
        
        if (ctx && bottomPipeImage.complete) {
            ctx.drawImage(bottomPipeImage, this.x, canvas.height - this.bottomHeight, PIPE_WIDTH, this.bottomHeight);
        }
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
    lastCoinScore = 0;
    pipes = [];
    frame = 0;
    bird.y = birdY;
    birdVelocity = 0;
    gamePaused = false;
    document.getElementById("scoreText").innerText = 'Счет: ' + score;
    gameLoop();
}

// Проверка и начисление монет за каждые 10 очков
function checkCoinReward() {
    if (score >= lastCoinScore + 10) {
        const coinsToAdd = Math.floor((score - lastCoinScore) / 10) * 5;
        updateCoins(coinsToAdd);
        lastCoinScore = score - (score % 10);
        
        // Показываем сообщение о получении монет
        const message = document.createElement('div');
        message.className = 'coin-message';
        message.textContent = `+${coinsToAdd} монет!`;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
            setTimeout(() => {
                message.classList.remove('show');
                setTimeout(() => message.remove(), 500);
            }, 1500);
        }, 100);
    }
}

// Обновление таблицы рекордов
function updateHighScores() {
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, MAX_RECORDS);
    localStorage.setItem("highScores", JSON.stringify(highScores));

    let recordText = highScores.map((record, index) => `${index + 1}. ${record}`).join('\n');
    document.getElementById("recordText").innerText = recordText;
}

// Главный игровой цикл
function gameLoop() {
    if (gamePaused) return;

    if (ctx && backgroundImage && backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    if (!birdAlive) {
        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.fillText('GAME OVER', canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText('Score: ' + score, canvas.width / 2 - 50, canvas.height / 2 + 40);
        updateHighScores();
        return;
    }

    bird.update();
    if (frame % 90 === 0) {
        pipes.push(new Pipe(canvas.width));
    }
    
    pipes.forEach(function(pipe) {
        pipe.update();
        if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
            score++;
            document.getElementById("scoreText").innerText = 'Score: ' + score;
            checkCoinReward(); // Проверяем, нужно ли дать монеты
            pipe.passed = true;
        }
        if (pipe.isOffScreen()) {
            pipes.shift();
        }
        if (pipe.collidesWithBird(bird)) {
            birdAlive = false;
        }
    });
    
    frame++;
    requestAnimationFrame(gameLoop);
}

// Инициализация игры
initCoinDisplay();
gameLoop();

// Проверка столкновений
function checkCollision(bird, pipe) {
    return (
        bird.x < pipe.x + PIPE_WIDTH &&
        bird.x + bird.width > pipe.x &&
        (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight)
    );
}

// Cообщений о монетах
const coinMessageStyle = document.createElement('style');
document.head.appendChild(coinMessageStyle);

module.exports = { Bird, Pipe, restartGame, checkCollision };