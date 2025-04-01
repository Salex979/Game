document.addEventListener("DOMContentLoaded", function() {
    // Инициализация системы монет
    class CoinSystem {
        constructor() {
            this.coins = this.loadCoins();
            this.initDisplay();
        }

        loadCoins() {
            return parseInt(localStorage.getItem('gameCoins')) || 0;
        }

        saveCoins() {
            localStorage.setItem('gameCoins', this.coins);
        }

        addCoins(amount) {
            this.coins += amount;
            this.saveCoins();
            this.updateDisplay();
            this.animateCoins();
            return this.coins;
        }

        initDisplay() {
            if (!document.getElementById('coins-display')) {
                const coinsDisplay = document.createElement('div');
                coinsDisplay.id = 'coins-display';
                coinsDisplay.className = 'coins-display';
                document.body.prepend(coinsDisplay);
            }
            this.updateDisplay();
        }

        updateDisplay() {
            const display = document.getElementById('coins-display');
            if (display) {
                display.innerHTML = `🪙 <span class="coins-count">${this.coins}</span>`;
            }
        }

        animateCoins() {
            const display = document.getElementById('coins-display');
            if (display) {
                display.classList.add('coin-animation');
                setTimeout(() => {
                    display.classList.remove('coin-animation');
                }, 800);
            }
        }
    }

    // Инициализируем систему монет
    const coinSystem = new CoinSystem();

    // Элементы игры
    const cells = document.querySelectorAll('#gameBoard td');
    let currentPlayer = 'X'; // Начинает игрок X
    let gameOver = false;

    // Функции проверки наличия двух символов в строке
    function hasTwoInRow(player, row) {
        return row.filter(cell => cell === player).length === 2 &&
            row.includes('');
    }

    // Стратегия ИИ
    function getAIPlay() {
        const boardState = Array.from(cells).map(cell => cell.textContent);

        // Возможные выигрышные строки
        const winningLines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Горизонтали
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Вертикали
            [0, 4, 8], [2, 4, 6]              // Диагонали
        ];

        // Блокировка угроз соперника
        for (const line of winningLines) {
            if (hasTwoInRow('X', line.map(i => boardState[i]))) {
                const emptyCell = line.find(i => boardState[i] === '');
                if (emptyCell !== undefined) {
                    return emptyCell;
                }
            }
        }

        // Создание своей выигрышной комбинации
        for (const line of winningLines) {
            if (hasTwoInRow('O', line.map(i => boardState[i]))) {
                const emptyCell = line.find(i => boardState[i] === '');
                if (emptyCell !== undefined) {
                    return emptyCell;
                }
            }
        }

        // Случайный выбор свободной клетки
        const availableMoves = [];
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === '') {
                availableMoves.push(i);
            }
        }
        return availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : -1;
    }

    // Ход ИИ
    function computerMove() {
        const move = getAIPlay();
        if (move !== -1) {
            cells[move].textContent = 'O';
            cells[move].classList.add('player-o');
            currentPlayer = 'X';
        }
    }

    // Проверка на победу
    function checkWin() {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
                return cells[a].textContent;
            }
        }
        return null;
    }

    function endGame(winner) {
        gameOver = true;
        
        if (winner === 'X') {
            // Игрок победил - добавляем монеты
            coinSystem.addCoins(5);
            alert(`Вы победили! +5 монет. Всего монет: ${coinSystem.coins}`);
        } else if (winner === 'O') {
            alert("Компьютер победил!");
        } else {
            alert("Ничья!");
        }
    }

    // Ход игрока
    function playerMove(event) {
        if (currentPlayer === 'X') {
            event.target.style.color = '#C7522A'; // Цвет для крестика
        }
        if (!event.target.textContent && !gameOver) {
            event.target.textContent = currentPlayer;
            event.target.classList.add(`player-${currentPlayer}`);

            const winner = checkWin();
            if (winner) {
                endGame(winner);
            } else if (Array.from(cells).every(cell => cell.textContent)) {
                endGame(null); // Ничья
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                if (currentPlayer === 'O') {
                    setTimeout(computerMove, 500); // Задержка для визуального эффекта
                }
            }
        }
    }

    // Перезапуск игры
    function restartGame() {
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('player-x', 'player-o');
        });
        currentPlayer = 'X';
        gameOver = false;
    }

    // Добавление обработчиков событий
    cells.forEach(cell => cell.addEventListener('click', playerMove));
    document.getElementById('restartButton').addEventListener('click', restartGame);
});