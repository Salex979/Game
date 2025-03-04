const { checkWin, playerMove, computerMove, restartGame } = require('./ttt');

describe('Tic-Tac-Toe Unit Tests', () => {
    let mockCells;

    beforeEach(() => {
        // Создаём фейковые ячейки (DOM-имитация)
        mockCells = Array.from({ length: 9 }, () => ({ textContent: '', classList: { add: jest.fn(), remove: jest.fn() } }));
        global.cells = mockCells;
        global.currentPlayer = 'X';
        global.gameOver = false;
    });

    test('checkWin() — Победа X', () => {
        mockCells[0].textContent = 'X';
        mockCells[1].textContent = 'X';
        mockCells[2].textContent = 'X';
        
        expect(checkWin()).toBe('X');
    });

    test('checkWin() — Ничья', () => {
        ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'].forEach((val, i) => {
            mockCells[i].textContent = val;
        });
        
        expect(checkWin()).toBe(null);
    });

    test('playerMove() — Игрок X делает ход', () => {
        const event = { target: mockCells[0] };
        playerMove(event);
        
        expect(mockCells[0].textContent).toBe('X');
        expect(currentPlayer).toBe('O');
    });

    test('computerMove() — Компьютер делает ход', () => {
        computerMove();
        const occupiedCells = mockCells.filter(cell => cell.textContent === 'O');
        
        expect(occupiedCells.length).toBe(1);
    });

    test('restartGame() — Перезапуск игры', () => {
        restartGame();
        
        expect(mockCells.every(cell => cell.textContent === '')).toBe(true);
        expect(currentPlayer).toBe('X');
        expect(gameOver).toBe(false);
    });
});
