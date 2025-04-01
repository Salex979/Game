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
    }

    initDisplay() {
        // Создаем элемент если его нет
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

// Создаем глобальный экземпляр
window.coinSystem = new CoinSystem();