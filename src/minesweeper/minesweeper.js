// Game configuration
const gameConfig = {
    easy: { rows: 9, columns: 9, mines: 10 },
    medium: { rows: 16, columns: 16, mines: 40 },
    hard: { rows: 16, columns: 30, mines: 99 }
};

// Game state
let board = [];
let gameStarted = false;
let gameOver = false;
let minesCount;
let revealedCount = 0;
let timerInterval;
let seconds = 0;
let firstClick = true;

// DOM elements
const gameBoard = document.getElementById('game-board');
const difficultySelect = document.getElementById('difficulty');
const newGameBtn = document.getElementById('new-game-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const minesCountDisplay = document.getElementById('mines-count');
const timerDisplay = document.getElementById('timer');
const gameMessage = document.getElementById('game-message');
const messageContent = document.getElementById('message-content');

// Event listeners
difficultySelect.addEventListener('change', () => {
    resetGame();
    initializeGame();
});

newGameBtn.addEventListener('click', () => {
    resetGame();
    initializeGame();
});

playAgainBtn.addEventListener('click', () => {
    gameMessage.classList.add('hidden');
    resetGame();
    initializeGame();
});

// Initialize the game
function initializeGame() {
    const difficulty = difficultySelect.value;
    const config = gameConfig[difficulty];
    
    minesCount = config.mines;
    minesCountDisplay.textContent = `Mines: ${minesCount}`;
    
    // Set CSS variables for responsive grid
    gameBoard.style.setProperty('--rows', config.rows);
    gameBoard.style.setProperty('--columns', config.columns);
    
    // Create empty board
    board = Array(config.rows).fill().map(() => 
        Array(config.columns).fill().map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            isQuestion: false,
            adjacentMines: 0
        }))
    );
    
    // Render the board
    renderBoard();
    
    gameStarted = true;
    gameOver = false;
    firstClick = true;
    revealedCount = 0;
}

// Reset the game
function resetGame() {
    stopTimer();
    seconds = 0;
    timerDisplay.textContent = `Time: ${seconds}`;
    gameBoard.innerHTML = '';
    gameStarted = false;
    gameOver = false;
    firstClick = true;
    revealedCount = 0;
}

// Start the timer
function startTimer() {
    stopTimer();
    seconds = 0;
    timerDisplay.textContent = `Time: ${seconds}`;
    timerInterval = setInterval(() => {
        seconds++;
        timerDisplay.textContent = `Time: ${seconds}`;
    }, 1000);
}

// Stop the timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Place mines randomly (avoiding the first clicked cell)
function placeMines(firstRow, firstCol) {
    const difficulty = difficultySelect.value;
    const config = gameConfig[difficulty];
    let minesPlaced = 0;
    
    while (minesPlaced < config.mines) {
        const row = Math.floor(Math.random() * config.rows);
        const col = Math.floor(Math.random() * config.columns);
        
        // Avoid placing a mine on the first clicked cell or where a mine already exists
        if ((row !== firstRow || col !== firstCol) && !board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }
    
    // Calculate adjacent mines for each cell
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.columns; col++) {
            if (!board[row][col].isMine) {
                board[row][col].adjacentMines = countAdjacentMines(row, col);
            }
        }
    }
}

// Count adjacent mines for a cell
function countAdjacentMines(row, col) {
    let count = 0;
    const difficulty = difficultySelect.value;
    const config = gameConfig[difficulty];
    
    for (let r = Math.max(0, row - 1); r <= Math.min(config.rows - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(config.columns - 1, col + 1); c++) {
            if (r !== row || c !== col) {
                if (board[r][c].isMine) {
                    count++;
                }
            }
        }
    }
    
    return count;
}

// Render the game board
function renderBoard() {
    gameBoard.innerHTML = '';
    const difficulty = difficultySelect.value;
    const config = gameConfig[difficulty];
    
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.columns; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Add event listeners
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleRightClick);
            
            // Update cell appearance based on state
            updateCellAppearance(cell, board[row][col]);
            
            gameBoard.appendChild(cell);
        }
    }
}

// Update cell appearance based on its state
function updateCellAppearance(cellElement, cellData) {
    cellElement.className = 'cell';
    
    if (cellData.isRevealed) {
        cellElement.classList.add('revealed');
        
        if (cellData.isMine) {
            cellElement.classList.add('mine');
            cellElement.textContent = '💣';
        } else if (cellData.adjacentMines > 0) {
            cellElement.textContent = cellData.adjacentMines;
            cellElement.dataset.value = cellData.adjacentMines;
        }
    } else if (cellData.isFlagged) {
        cellElement.classList.add('flagged');
    } else if (cellData.isQuestion) {
        cellElement.classList.add('question');
    }
}

// Handle left click on a cell
function handleCellClick(event) {
    if (gameOver) return;
    
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    
    // Ignore click if cell is flagged or already revealed
    if (board[row][col].isFlagged || board[row][col].isRevealed) return;
    
    // First click should never be a mine
    if (firstClick) {
        firstClick = false;
        placeMines(row, col);
        startTimer();
    }
    
    // Reveal the cell
    revealCell(row, col);
    
    // Update the board
    renderBoard();
    
    // Check win condition
    checkWinCondition();
}

// Handle right click on a cell (flag/unflag)
function handleRightClick(event) {
    event.preventDefault();
    
    if (gameOver) return;
    
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    
    // Ignore if cell is already revealed
    if (board[row][col].isRevealed) return;
    
    if (!board[row][col].isFlagged && !board[row][col].isQuestion) {
        // Place flag
        board[row][col].isFlagged = true;
        minesCount--;
    } else if (board[row][col].isFlagged) {
        // Change flag to question mark
        board[row][col].isFlagged = false;
        board[row][col].isQuestion = true;
        minesCount++;
    } else {
        // Remove question mark
        board[row][col].isQuestion = false;
    }
    
    // Update mines count display
    minesCountDisplay.textContent = `Mines: ${minesCount}`;
    
    // Update the board
    renderBoard();
}

// Reveal a cell and its adjacent cells if it has no adjacent mines
function revealCell(row, col) {
    const cell = board[row][col];
    
    // Ignore if cell is already revealed or flagged
    if (cell.isRevealed || cell.isFlagged) return;
    
    // Reveal the cell
    cell.isRevealed = true;
    revealedCount++;
    
    // If it's a mine, game over
    if (cell.isMine) {
        gameOver = true;
        revealAllMines();
        stopTimer();
        showMessage('Game Over!', 'lose');
        return;
    }
    
    // If cell has no adjacent mines, reveal adjacent cells
    if (cell.adjacentMines === 0) {
        const difficulty = difficultySelect.value;
        const config = gameConfig[difficulty];
        
        for (let r = Math.max(0, row - 1); r <= Math.min(config.rows - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(config.columns - 1, col + 1); c++) {
                if (r !== row || c !== col) {
                    revealCell(r, c);
                }
            }
        }
    }
}

// Reveal all mines when game is over
function revealAllMines() {
    const difficulty = difficultySelect.value;
    const config = gameConfig[difficulty];
    
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.columns; col++) {
            if (board[row][col].isMine) {
                board[row][col].isRevealed = true;
            }
        }
    }
    
    renderBoard();
}

// Check if the player has won
function checkWinCondition() {
    const difficulty = difficultySelect.value;
    const config = gameConfig[difficulty];
    const totalCells = config.rows * config.columns;
    
    if (revealedCount === totalCells - config.mines && !gameOver) {
        gameOver = true;
        stopTimer();
        showMessage('You Win!', 'win');
        
        // Flag all remaining mines
        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.columns; col++) {
                if (board[row][col].isMine && !board[row][col].isFlagged) {
                    board[row][col].isFlagged = true;
                }
            }
        }
        
        minesCount = 0;
        minesCountDisplay.textContent = `Mines: ${minesCount}`;
        renderBoard();
    }
}

// Show game over or win message
function showMessage(msg, type) {
    messageContent.textContent = msg;
    messageContent.className = type;
    gameMessage.classList.remove('hidden');
}

// Initialize the game when the page loads
window.addEventListener('load', initializeGame);
