class Game2048 {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        document.getElementById('best-score').textContent = this.bestScore;
        this.setupSounds();
        this.loadGameState();
        this.setupGame();
        this.setupEventListeners();
    }

    setupGame() {
        if (!this.loadGameState()) {
            this.addNewTile();
            this.addNewTile();
        }
        this.updateDisplay();
        this.updateScore();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.getElementById('new-game').addEventListener('click', () => this.resetGame());
        document.getElementById('restart-game').addEventListener('click', () => {
            this.hideGameOverModal();
            this.resetGame();
        });
    }

    setupSounds() {
        // Create a pool of move sounds for overlapping plays
        this.moveAudioPool = Array(4).fill().map(() => {
            const audio = new Audio('moving.mp3');
            audio.volume = 0.3;
            audio.load();
            return audio;
        });
        
        this.currentMoveSound = 0;
        
        this.sounds = {
            gameOver: new Audio('game_over.mp3')
        };
        
        this.sounds.gameOver.volume = 0.3;
        this.sounds.gameOver.load();
    }

    playSound(soundName) {
        if (soundName === 'move') {
            // Use the next sound in the pool for move sounds
            const audio = this.moveAudioPool[this.currentMoveSound];
            audio.currentTime = 0;
            audio.play().catch(() => {});
            
            // Cycle through the pool
            this.currentMoveSound = (this.currentMoveSound + 1) % this.moveAudioPool.length;
        } else if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(() => {});
        }
    }

    resetGame() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        localStorage.removeItem('gameState');
        this.setupGame();
    }

    showGameOverModal() {
        const modal = document.getElementById('game-over-modal');
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-best-score').textContent = this.bestScore;
        modal.classList.add('active');
    }

    hideGameOverModal() {
        const modal = document.getElementById('game-over-modal');
        modal.classList.remove('active');
    }

    addNewTile() {
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

    updateDisplay() {
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const value = this.grid[row][col];
            
            const oldTile = cell.querySelector('.tile');
            if (oldTile) {
                cell.removeChild(oldTile);
            }
            
            if (value !== 0) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.textContent = value;
                tile.dataset.value = value;
                cell.appendChild(tile);
            }
        });
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
            document.getElementById('best-score').textContent = this.bestScore;
        }
    }

    handleKeyPress(e) {
        let moved = false;
        
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                e.preventDefault();
                moved = this.moveUp();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                e.preventDefault();
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
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

    saveGameState() {
        const gameState = {
            grid: this.grid,
            score: this.score,
            bestScore: this.bestScore
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }

    loadGameState() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.grid = state.grid;
            this.score = state.score;
            this.bestScore = state.bestScore;
            return true;
        }
        return false;
    }
}

window.addEventListener('load', () => {
    new Game2048();
});