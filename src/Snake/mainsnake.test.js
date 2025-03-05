/**
 * @jest-environment jsdom
 */

// Импортируем библиотеку canvas для поддержки 2D API
const { createCanvas } = require('canvas');

// Создаём DOM-структуру перед импортом mainsnake.js
document.body.innerHTML = `
    <canvas id="gameCanvas"></canvas>
    <div id="scoreBoard"></div>
    <div id="applesCounter"></div>
    <ul id="scoreList"></ul>
    <div id="pauseIcon" style="display:none"></div>
    <button id="clearButton"></button>
`;

// Мокаем canvas.getContext
HTMLCanvasElement.prototype.getContext = function () {
    return createCanvas(400, 400).getContext("2d");
};

// Теперь можно импортировать mainsnake.js
const { generateFood, endGame } = require('./mainsnake');

test('generateFood создает еду в пределах поля', () => {
    const food = generateFood();
    expect(food.x).toBeGreaterThanOrEqual(0);
    expect(food.x).toBeLessThanOrEqual(19);
    expect(food.y).toBeGreaterThanOrEqual(0);
    expect(food.y).toBeLessThanOrEqual(19);
});

test('endGame вызывает alert', () => {
    global.alert = jest.fn();
    endGame();
    expect(global.alert).toHaveBeenCalled();
});
