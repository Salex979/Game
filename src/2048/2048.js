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
            const audio = new Audio('../../assets/sounds/moving.mp3');
            audio.volume = 0.3;
            audio.load();
            return audio;
        });
        
        this.currentMoveSound = 0;
        
        this.sounds = {
            gameOver: new Audio('../../assets/sounds/game_over.mp3'),
            merge: new Audio('../../assets/sounds/moving.mp3')
        };
        
        this.sounds.gameOver.volume = 0.3;
        this.sounds.gameOver.load();
        this.sounds.merge.volume = 0.4;
        this.sounds.merge.load();
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
        
        // Add pixel effect to the modal
        modal.style.animation = 'pixelFadeIn 0.5s';
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
                tile.className = 'tile new';
                tile.textContent = value;
                tile.dataset.value = value;
                
                // Add pixel art effect
                this.addPixelEffect(tile, value);
                
                cell.appendChild(tile);
                
                // Remove the 'new' class after animation completes
                setTimeout(() => {
                    tile.classList.remove('new');
                }, 200);
            }
        });
    }
    
    addPixelEffect(tile, value) {
        // Add pixel border effect based on value
        const borderColors = {
            2: '#d6c0b4',
            4: '#d8c0a8',
            8: '#d88a54',
            16: '#d87c3c',
            32: '#d85a37',
            64: '#d83c14',
            128: '#d8c34b',
            256: '#d8c13c',
            512: '#d8be28',
            1024: '#d8bb14',
            2048: '#d8b800'
        };
        
        const borderColor = borderColors[value] || '#d8b800';
        tile.style.borderColor = borderColor;
        
        // Add pixel shadow
        if (value >= 8) {
            tile.style.boxShadow = `0 0 0 2px ${borderColor}`;
        }
    }

    updateScore() {
        const scoreElement = document.getElementById('score');
        const oldScore = parseInt(scoreElement.textContent);
        const newScore = this.score;
        
        // Animate score change with a pixel effect
        if (newScore > oldScore) {
            scoreElement.classList.add('score-change');
            setTimeout(() => {
                scoreElement.classList.remove('score-change');
            }, 300);
        }
        
        scoreElement.textContent = newScore;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
            document.getElementById('best-score').textContent = this.bestScore;
        }
    }

    handleKeyPress(e) {
        const modal = document.getElementById('game-over-modal');
        const isGameOver = modal.classList.contains('active');

        // Handle Enter key
        if (e.key === 'Enter' && isGameOver) {
            this.hideGameOverModal();
            this.resetGame();
            return;
        }

        // Don't handle movement keys if game is over
        if (isGameOver) return;

        let moved = false;
        
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
            case 'Ц':
            case 'ц':
                e.preventDefault();
                moved = this.moveUp();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
            case 'Ы':
            case 'ы':
                e.preventDefault();
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
            case 'ф':
            case 'Ф':
                e.preventDefault();
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
            case 'в':
            case 'В':
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

    moveLeft() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            const row = this.grid[i].filter(val => val !== 0);
            const newRow = [];
            for (let j = 0; j < row.length; j++) {
                if (j + 1 < row.length && row[j] === row[j + 1]) {
                    newRow.push(row[j] * 2);
                    this.score += row[j] * 2;
                    j++;
                    moved = true;
                    this.playSound('merge');
                } else {
                    newRow.push(row[j]);
                }
            }
            while (newRow.length < 4) {
                newRow.push(0);
            }
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            this.grid[i] = newRow;
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            const row = this.grid[i].filter(val => val !== 0);
            const newRow = Array(4).fill(0);
            let idx = 3;
            for (let j = row.length - 1; j >= 0; j--) {
                if (j - 1 >= 0 && row[j] === row[j - 1]) {
                    newRow[idx] = row[j] * 2;
                    this.score += row[j] * 2;
                    j--;
                    moved = true;
                    this.playSound('merge');
                } else {
                    newRow[idx] = row[j];
                }
                idx--;
            }
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            this.grid[i] = newRow;
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            const col = [];
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== 0) {
                    col.push(this.grid[i][j]);
                }
            }
            const newCol = [];
            for (let i = 0; i < col.length; i++) {
                if (i + 1 < col.length && col[i] === col[i + 1]) {
                    newCol.push(col[i] * 2);
                    this.score += col[i] * 2;
                    i++;
                    moved = true;
                    this.playSound('merge');
                } else {
                    newCol.push(col[i]);
                }
            }
            while (newCol.length < 4) {
                newCol.push(0);
            }
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== newCol[i]) {
                    moved = true;
                }
                this.grid[i][j] = newCol[i];
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            const col = [];
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== 0) {
                    col.push(this.grid[i][j]);
                }
            }
            const newCol = Array(4).fill(0);
            let idx = 3;
            for (let i = col.length - 1; i >= 0; i--) {
                if (i - 1 >= 0 && col[i] === col[i - 1]) {
                    newCol[idx] = col[i] * 2;
                    this.score += col[i] * 2;
                    i--;
                    moved = true;
                    this.playSound('merge');
                } else {
                    newCol[idx] = col[i];
                }
                idx--;
            }
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== newCol[i]) {
                    moved = true;
                }
                this.grid[i][j] = newCol[i];
            }
        }
        return moved;
    }

    isGameOver() {
        // Check if there are any empty cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    return false;
                }
            }
        }
        
        // Check if there are any adjacent equal values
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const val = this.grid[i][j];
                // Check right
                if (j < 3 && this.grid[i][j + 1] === val) {
                    return false;
                }
                // Check down
                if (i < 3 && this.grid[i + 1][j] === val) {
                    return false;
                }
            }
        }
        
        return true;
    }

    saveGameState() {
        const gameState = {
            grid: this.grid,
            score: this.score
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }

    loadGameState() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            this.grid = gameState.grid;
            this.score = gameState.score;
            return true;
        }
        return false;
    }
}

window.addEventListener('load', () => {
    new Game2048();
    
    // Add pixel art background effect
    document.querySelectorAll('.grid-cell').forEach(cell => {
        // Add random pixel noise to each cell
        const noise = document.createElement('div');
        noise.className = 'pixel-noise';
        cell.appendChild(noise);
    });
});