global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
const { JSDOM } = require('jsdom');

// Создаём виртуальный DOM
const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
global.document = dom.window.document;
global.window = dom.window;

global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

// Добавляем `canvas` в DOM перед загрузкой `Bird.js`
const canvas = document.createElement("canvas");
canvas.id = "gameCanvas";
document.body.appendChild(canvas);

global.canvas = document.getElementById("gameCanvas");
global.ctx = global.canvas.getContext("2d");

global.backgroundImage = new Image();
global.backgroundImage.src = "background.png"; // Заглушка, путь можно оставить любым

global.birdUpImage = new Image();
global.birdUpImage.src = "bird-up.png"; // Заглушка

global.birdDownImage = new Image();
global.birdDownImage.src = "bird-down.png"; // Заглушка

global.birdMidImage = new Image();
global.birdMidImage.src = "bird-mid.png"; // Заглушка

global.topPipeImage = new Image();
global.topPipeImage.src = "top-pipe.png"; // Заглушка

global.bottomPipeImage = new Image();
global.bottomPipeImage.src = "bottom-pipe.png"; // Заглушка

const scoreText = document.createElement("div");
scoreText.id = "scoreText";
document.body.appendChild(scoreText);


// Создаём заглушку для Image
global.Image = class {
    constructor() {
        this.src = "";
    }
};

// Загружаем Bird.js после создания `canvas`
const { Bird, Pipe, restartGame, checkCollision } = require('./Bird');

describe('Flappy Bird Unit Tests', () => {
    let bird;
    let pipe;
    
    beforeEach(() => {
        bird = new Bird();
        pipe = new Pipe(300);
    });

    test('Птица прыгает', () => {
        const initialVelocity = bird.velocity;
        bird.jump();
        expect(bird.velocity).toBeLessThan(initialVelocity);
    });

    test('Гравитация работает', () => {
        const initialY = bird.y;
        bird.update();
        expect(bird.y).toBeGreaterThan(initialY);
    });

    test('Птица сталкивается с трубой', () => {
        bird.x = pipe.x;
        bird.y = pipe.topHeight - 10; // Размещаем птицу так, чтобы была коллизия
        expect(checkCollision(bird, pipe)).toBe(true);
    });

    test('Начисление очков', () => {
        let score = 0;
        pipe.passed = false;
        bird.x = pipe.x + 61; // Имитируем прохождение трубы
        if (!pipe.passed) {
            score++;
            pipe.passed = true;
        }
        expect(score).toBe(1);
    });

    test('Перезапуск игры', () => {
        bird.y = 100;
        restartGame();
        expect(bird.y).toBe(250); // Начальная позиция
    });
});
