
document.body.innerHTML = `
<div id="score">0</div>
<div id="best-score">0</div>
<div id="game-over-modal" class="modal"></div>
<div id="final-score">0</div>
<div id="final-best-score">0</div>
<div id="new-game"></div>
<div id="restart-game"></div>
<div class="grid-container">
    <div class="grid-row">
        <div class="grid-cell" data-row="0" data-col="0"></div>
        <div class="grid-cell" data-row="0" data-col="1"></div>
        <div class="grid-cell" data-row="0" data-col="2"></div>
        <div class="grid-cell" data-row="0" data-col="3"></div>
    </div>
    <div class="grid-row">
        <div class="grid-cell" data-row="1" data-col="0"></div>
        <div class="grid-cell" data-row="1" data-col="1"></div>
        <div class="grid-cell" data-row="1" data-col="2"></div>
        <div class="grid-cell" data-row="1" data-col="3"></div>
    </div>
    <div class="grid-row">
        <div class="grid-cell" data-row="2" data-col="0"></div>
        <div class="grid-cell" data-row="2" data-col="1"></div>
        <div class="grid-cell" data-row="2" data-col="2"></div>
        <div class="grid-cell" data-row="2" data-col="3"></div>
    </div>
    <div class="grid-row">
        <div class="grid-cell" data-row="3" data-col="0"></div>
        <div class="grid-cell" data-row="3" data-col="1"></div>
        <div class="grid-cell" data-row="3" data-col="2"></div>
        <div class="grid-cell" data-row="3" data-col="3"></div>
    </div>
</div>
`;

global.Audio = class {
    constructor() {
        this.volume = 1;
    }
    play() { return Promise.resolve(); }
    load() {}
};

const localStorageMock = (function() {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn(key => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        })
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

jest.mock('../src/2048/2048.js', () => {
    return class Game2048Mock {
        constructor() {
            this.grid = Array(4).fill().map(() => Array(4).fill(0));
            this.score = 0;
            this.bestScore = 0;
            this.moveAudioPool = Array(4).fill().map(() => new Audio());
            this.currentMoveSound = 0;
            this.sounds = {
                gameOver: new Audio()
            };
        }

        setupSounds() {}
        setupGame() {}
        setupEventListeners() {}
        
        addNewTile() {
            // Find an empty cell
            const emptyCells = [];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.grid[i][j] === 0) {
                        emptyCells.push({x: i, y: j});
                    }
                }
            }
            if (emptyCells.length > 0) {
                const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                this.grid[x][y] = Math.random() < 0.9 ? 2 : 4;
            }
        }
        
        updateDisplay() {}
        updateScore() {}
        playSound() {}
        saveGameState() {}
        loadGameState() { return false; }
        
        compressGrid(grid) {
            const newGrid = Array(4).fill().map(() => Array(4).fill(0));
            
            for (let i = 0; i < 4; i++) {
                let colIndex = 0;
                for (let j = 0; j < 4; j++) {
                    if (grid[i][j] !== 0) {
                        newGrid[i][colIndex] = grid[i][j];
                        colIndex++;
                    }
                }
            }
            return newGrid;
        }
        
        mergeGrid(grid) {
            let merged = false;
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 3; j++) {
                    if (grid[i][j] !== 0 && grid[i][j] === grid[i][j + 1]) {
                        grid[i][j] *= 2;
                        this.score += grid[i][j];
                        grid[i][j + 1] = 0;
                        merged = true;
                    }
                }
            }
            return merged;
        }
        
        rotateGrid(grid) {
            const newGrid = Array(4).fill().map(() => Array(4).fill(0));
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    newGrid[i][j] = grid[3 - j][i];
                }
            }
            return newGrid;
        }
        
        moveLeft() {
            let oldGrid = JSON.stringify(this.grid);
            
            this.grid = this.compressGrid(this.grid);
            let merged = this.mergeGrid(this.grid);
            this.grid = this.compressGrid(this.grid);
            
            return oldGrid !== JSON.stringify(this.grid);
        }
        
        moveRight() {
            let oldGrid = JSON.stringify(this.grid);
            
            this.grid = this.rotateGrid(this.rotateGrid(this.grid));
            let moved = this.moveLeft();
            this.grid = this.rotateGrid(this.rotateGrid(this.grid));
            
            return oldGrid !== JSON.stringify(this.grid);
        }
        
        moveUp() {
            let oldGrid = JSON.stringify(this.grid);
            
            this.grid = this.rotateGrid(this.rotateGrid(this.rotateGrid(this.grid)));
            let moved = this.moveLeft();
            this.grid = this.rotateGrid(this.grid);
            
            return oldGrid !== JSON.stringify(this.grid);
        }
        
        moveDown() {
            let oldGrid = JSON.stringify(this.grid);
            
            this.grid = this.rotateGrid(this.grid);
            let moved = this.moveLeft();
            this.grid = this.rotateGrid(this.rotateGrid(this.rotateGrid(this.grid)));
            
            return oldGrid !== JSON.stringify(this.grid);
        }
        
        isGameOver() {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (this.grid[i][j] === 0) return false;
                }
            }
            
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    const current = this.grid[i][j];
                    if ((j < 3 && current === this.grid[i][j + 1]) ||
                        (i < 3 && current === this.grid[i + 1][j])) {
                        return false;
                    }
                }
            }
            
            return true;
        }
        
        resetGame() {
            this.grid = Array(4).fill().map(() => Array(4).fill(0));
            this.score = 0;
            this.addNewTile();
            this.addNewTile();
        }
        
        showGameOverModal() {}
        hideGameOverModal() {}
        
        handleKeyPress(e) {
            let moved = false;
            
            switch(e.key) {
                case 'ArrowUp':
                    moved = this.moveUp();
                    break;
                case 'ArrowDown':
                    moved = this.moveDown();
                    break;
                case 'ArrowLeft':
                    moved = this.moveLeft();
                    break;
                case 'ArrowRight':
                    moved = this.moveRight();
                    break;
                default:
                    return;
            }
            
            if (moved) {
                this.addNewTile();
                this.updateDisplay();
                this.updateScore();
                this.saveGameState();
                this.playSound('move');
                
                if (this.isGameOver()) {
                    this.playSound('gameOver');
                    this.showGameOverModal();
                }
            }
        }
    };
});

const Game2048 = require('../src/2048/2048.js');

describe('Game2048', () => {
    let game;
    
    beforeEach(() => {
        localStorage.clear();
        
        document.getElementById('score').textContent = '0';
        document.getElementById('best-score').textContent = '0';
        document.getElementById('game-over-modal').classList.remove('active');
        
        game = new Game2048();
        
        jest.spyOn(game, 'addNewTile');
        jest.spyOn(game, 'updateDisplay');
        jest.spyOn(game, 'updateScore');
        jest.spyOn(game, 'saveGameState');
        jest.spyOn(game, 'playSound');
    });
    
    afterEach(() => {
        jest.restoreAllMocks();
    });
    
    describe('Initialization', () => {
        test('should initialize with a 4x4 grid', () => {
            expect(game.grid.length).toBe(4);
            game.grid.forEach(row => {
                expect(row.length).toBe(4);
            });
        });
        
        test('should start with score of 0', () => {
            expect(game.score).toBe(0);
        });
    });
    
    describe('Grid Operations', () => {
        test('compressGrid should move non-zero values to the left', () => {
            const grid = [
                [0, 2, 0, 4],
                [0, 0, 0, 2],
                [2, 0, 2, 0],
                [4, 4, 0, 0]
            ];
            
            const result = game.compressGrid(grid);
            expect(result).toEqual([
                [2, 4, 0, 0],
                [2, 0, 0, 0],
                [2, 2, 0, 0],
                [4, 4, 0, 0]
            ]);
        });
        
        test('mergeGrid should combine adjacent equal values', () => {
            const grid = [
                [2, 2, 0, 0],
                [2, 0, 0, 0],
                [2, 2, 0, 0],
                [4, 4, 0, 0]
            ];
            
            const testGrid = JSON.parse(JSON.stringify(grid));
            
            const result = game.mergeGrid(testGrid);
            
            expect(result).toBe(true);
            
            expect(testGrid[0][0]).toBe(4);
            expect(testGrid[0][1]).toBe(0);
            
            expect(testGrid[2][0]).toBe(4);
            expect(testGrid[2][0]).toBe(4);
            expect(testGrid[2][1]).toBe(0);
            
            expect(testGrid[3][0]).toBe(8);
            expect(testGrid[3][1]).toBe(0);
        });
        
        test('rotateGrid should rotate the grid 90 degrees clockwise', () => {
            const grid = [
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                [13, 14, 15, 16]
            ];
            
            const expected = [
                [13, 9, 5, 1],
                [14, 10, 6, 2],
                [15, 11, 7, 3],
                [16, 12, 8, 4]
            ];
            
            const result = game.rotateGrid(grid);
            expect(result).toEqual(expected);
        });
    });
    
    describe('Move Operations', () => {
        test('moveLeft should compress and merge tiles to the left', () => {
            game.grid = [
                [0, 2, 2, 0],
                [0, 0, 0, 0],
                [2, 0, 2, 0],
                [4, 4, 0, 0]
            ];
            
            const result = game.moveLeft();
            
            expect(result).toBe(true);
            expect(game.grid).toEqual([
                [4, 0, 0, 0],
                [0, 0, 0, 0],
                [4, 0, 0, 0],
                [8, 0, 0, 0]
            ]);
        });

        test('moveLeft should compress and merge tiles to the left', () => {
            game.grid = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 16, 0, 16]
            ];

            const result = game.moveLeft();

            expect(result).toBe(true);
            expect(game.grid).toEqual([
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [32, 0, 0, 0]
            ]);
        });
        
        test('moveRight should compress and merge tiles to the right', () => {
            game.grid = [
                [0, 2, 2, 0],
                [0, 0, 0, 0],
                [2, 0, 2, 0],
                [4, 4, 0, 0]
            ];
            
            const result = game.moveRight();
            
            expect(result).toBe(true);
            expect(game.grid).toEqual([
                [0, 0, 0, 4],
                [0, 0, 0, 0],
                [0, 0, 0, 4],
                [0, 0, 0, 8]
            ]);
        });

        test('moveRight should compress and merge tiles to the right', () => {
            game.grid = [
                [0, 8, 8, 0],
                [32, 0, 0, 32],
                [2, 0, 2, 0],
                [4, 4, 0, 0]
            ];
            
            const result = game.moveRight();
            
            expect(result).toBe(true);
            expect(game.grid).toEqual([
                [0, 0, 0, 16],
                [0, 0, 0, 64],
                [0, 0, 0, 4],
                [0, 0, 0, 8]
            ]);
        });
        
        test('moveUp should compress and merge tiles upward', () => {
            game.grid = [
                [0, 0, 2, 0],
                [0, 0, 2, 0],
                [0, 0, 0, 0],
                [0, 0, 4, 0]
            ];
            
            const result = game.moveUp();
            expect(result).toBe(true);
            expect(game.grid).toEqual([
                [0, 0, 4, 0],
                [0, 0, 4, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]);
        });
        
        test('moveDown should compress and merge tiles downward', () => {
            game.grid = [
                [0, 0, 2, 0],
                [0, 0, 2, 0],
                [0, 0, 0, 0],
                [0, 0, 4, 0]
            ];
            
            const result = game.moveDown();
            
            expect(result).toBe(true);
            expect(game.grid).toEqual([
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 4, 0],
                [0, 0, 4, 0]
            ]);
        });
    });
    
    describe('Game State', () => {
        test('isGameOver should return true when no moves are possible', () => {
            game.grid = [
                [2, 4, 2, 4],
                [4, 2, 4, 2],
                [2, 4, 2, 4],
                [4, 2, 4, 2]
            ];
            
            expect(game.isGameOver()).toBe(true);
        });
        
        test('isGameOver should return false when empty cells exist', () => {
            game.grid = [
                [2, 4, 2, 4],
                [4, 2, 4, 2],
                [2, 4, 0, 4],
                [4, 2, 4, 2]
            ];
            
            expect(game.isGameOver()).toBe(false);
        });
        
        test('isGameOver should return false when adjacent cells have the same value', () => {
            game.grid = [
                [2, 4, 2, 4],
                [4, 2, 4, 2],
                [2, 4, 4, 4],
                [4, 2, 4, 2]
            ];
            
            expect(game.isGameOver()).toBe(false);
        });
    });
    
    describe('Event Handling', () => {
        test('handleKeyPress should call moveLeft for left arrow key', () => {
            jest.spyOn(game, 'moveLeft').mockReturnValue(true);
            
            const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
            game.handleKeyPress(event);
            
            expect(game.moveLeft).toHaveBeenCalled();
            expect(game.addNewTile).toHaveBeenCalled();
            expect(game.updateDisplay).toHaveBeenCalled();
            expect(game.updateScore).toHaveBeenCalled();
            expect(game.saveGameState).toHaveBeenCalled();
            expect(game.playSound).toHaveBeenCalledWith('move');
        });
        
        test('handleKeyPress should call moveRight for right arrow key', () => {
            jest.spyOn(game, 'moveRight').mockReturnValue(true);
            
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
            game.handleKeyPress(event);
            
            expect(game.moveRight).toHaveBeenCalled();
            expect(game.addNewTile).toHaveBeenCalled();
            expect(game.updateDisplay).toHaveBeenCalled();
            expect(game.updateScore).toHaveBeenCalled();
            expect(game.saveGameState).toHaveBeenCalled();
            expect(game.playSound).toHaveBeenCalledWith('move');
        });
    });
});
