class Game2048 {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        this.setupGame();
        this.setupEventListeners();
    }

    setupGame() {
        this.addNewTile();
        this.addNewTile();
        this.updateDisplay();
        this.updateScore();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.getElementById('new-game').addEventListener('click', () => this.resetGame());
    }

    resetGame() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.setupGame();
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
            
            // Remove old tile
            const oldTile = cell.querySelector('.tile');
            if (oldTile) {
                cell.removeChild(oldTile);
            }
            
            // Add new tile if value is not 0
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
                e.preventDefault();
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                e.preventDefault();
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
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
            
            if (this.isGameOver()) {
                alert('Game Over! Your score: ' + this.score);
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
        
        // Compress the grid
        this.grid = this.compressGrid(this.grid);
        
        // Merge the numbers
        let merged = this.mergeGrid(this.grid);
        
        // Compress again after merging
        this.grid = this.compressGrid(this.grid);
        
        return oldGrid !== JSON.stringify(this.grid);
    }

    moveRight() {
        let oldGrid = JSON.stringify(this.grid);
        
        // Rotate twice to reverse the grid
        this.grid = this.rotateGrid(this.rotateGrid(this.grid));
        
        // Move left
        let moved = this.moveLeft();
        
        // Rotate twice again to get back to original orientation
        this.grid = this.rotateGrid(this.rotateGrid(this.grid));
        
        return oldGrid !== JSON.stringify(this.grid);
    }

    moveUp() {
        let oldGrid = JSON.stringify(this.grid);
        
        // Rotate once counterclockwise
        this.grid = this.rotateGrid(this.rotateGrid(this.rotateGrid(this.grid)));
        
        // Move left
        let moved = this.moveLeft();
        
        // Rotate once clockwise
        this.grid = this.rotateGrid(this.grid);
        
        return oldGrid !== JSON.stringify(this.grid);
    }

    moveDown() {
        let oldGrid = JSON.stringify(this.grid);
        
        // Rotate once clockwise
        this.grid = this.rotateGrid(this.grid);
        
        // Move left
        let moved = this.moveLeft();
        
        // Rotate three times clockwise to get back
        this.grid = this.rotateGrid(this.rotateGrid(this.rotateGrid(this.grid)));
        
        return oldGrid !== JSON.stringify(this.grid);
    }

    isGameOver() {
        // Check for empty cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) return false;
            }
        }

        // Check for possible merges
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
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game2048();
});