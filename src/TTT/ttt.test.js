global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

const { JSDOM } = require('jsdom');

// Создаём виртуальный DOM с нужными элементами
const dom = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <body>
      <button id="restartButton">Restart</button>
      <div id="gameBoard">
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
      </div>
    </body>
  </html>
`);

global.document = dom.window.document;
global.window = dom.window;
global.cells = document.querySelectorAll('.cell');

// ✅ Проверяем, что элемент существует перед импортом `ttt.js`
console.log("📌 restartButton перед импортом ttt.js:", document.getElementById('restartButton'));

// ✅ Теперь импортируем `ttt.js` после создания DOM
const { checkWin, playerMove, computerMove, restartGame, getAIPlay } = require('./ttt');
const { toggleMenu, toggleTheme, addNote } = require('./script');

describe('Script.js Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="menu" class="menu"></div>
            <textarea id="note-input"></textarea>
            <div id="note-list"></div>
        `;
    });

    test('toggleMenu toggles menu visibility', () => {
        const menu = document.getElementById('menu');
        toggleMenu();
        expect(menu.classList.contains('show')).toBe(true);
        toggleMenu();
        expect(menu.classList.contains('show')).toBe(false);
    });

    test('toggleTheme switches theme', () => {
        document.body.className = 'light-theme';
        toggleTheme();
        expect(document.body.classList.contains('dark-theme')).toBe(true);
        toggleTheme();
        expect(document.body.classList.contains('light-theme')).toBe(true);
    });

    test('addNote adds a note', () => {
        const noteInput = document.getElementById('note-input');
        noteInput.value = 'Test Note';
        addNote();
        const noteList = document.getElementById('note-list');
        expect(noteList.children.length).toBe(1);
        expect(noteList.children[0].textContent).toBe('Test Note');
    });
});

describe('Tic-Tac-Toe Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <table id="gameBoard">
                <tr><td></td><td></td><td></td></tr>
                <tr><td></td><td></td><td></td></tr>
                <tr><td></td><td></td><td></td></tr>
            </table>
        `;
    });

    test('checkWin detects a winning condition', () => {
        document.body.innerHTML = `
            <table id="gameBoard">
                <tr><td>X</td><td>X</td><td>X</td></tr>
                <tr><td></td><td></td><td></td></tr>
                <tr><td></td><td></td><td></td></tr>
            </table>
        `;
        expect(checkWin(document.querySelectorAll('#gameBoard td'))).toBe('X');
    });

    test('getAIPlay returns a valid move', () => {
        document.body.innerHTML = `
            <table id="gameBoard">
                <tr><td>X</td><td>X</td><td></td></tr>
                <tr><td></td><td>O</td><td></td></tr>
                <tr><td></td><td></td><td></td></tr>
            </table>
        `;
        const move = getAIPlay(document.querySelectorAll('#gameBoard td'));
        expect(move).toBeGreaterThanOrEqual(0);
        expect(move).toBeLessThan(9);
    });

    test('restartGame resets the board', () => {
        document.body.innerHTML = `
            <table id="gameBoard">
                <tr><td>X</td><td>O</td><td>X</td></tr>
                <tr><td>O</td><td>X</td><td>O</td></tr>
                <tr><td>O</td><td>X</td><td>O</td></tr>
            </table>
        `;
        restartGame();
        const cells = document.querySelectorAll('#gameBoard td');
        cells.forEach(cell => expect(cell.textContent).toBe(''));
    });
});
