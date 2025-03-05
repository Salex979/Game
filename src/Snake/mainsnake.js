

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreBoard = document.getElementById("scoreBoard");
const applesCounter = document.getElementById("applesCounter");
const scoreList = document.getElementById("scoreList");
const pauseIcon = document.getElementById("pauseIcon"); // Иконка паузы

const gridSize = 20;
const canvasSize = 400;

let snake = [{ x: 10, y: 10 }]; // Начальная позиция головы змейки
let food = generateFood(); // Первая еда
let dx = 0, dy = 0; // Начальное направление вправо
let nextDirection = { dx: 0, dy: 0 }; // Следующее направление (по умолчанию вправо)
let gameRunning = true; // Игра запущена
let applesEaten = 0; // Количество съеденных яблок
let score = 0; // Текущий счёт (яблоки * 10)
let isPaused = false; // Флаг для паузы

// Функция для отрисовки игры
function draw() {
    // Определяем размеры клетки
    const gridSize = 20; // Например, каждая клетка имеет ширину и высоту 20 пикселей

    // Проходимся по каждой строке и столбцу на холсте
    for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
            // Чередование цветов
            let color = ((x / gridSize) % 2 === 0 ^ (y / gridSize) % 2 === 0)
                ? "#fbf2c4" // Цвет первой клетки
                : "#e5c185"; // Цвет второй клетки

            // Заполняем прямоугольник цветом
            ctx.fillStyle = color;
            ctx.fillRect(x, y, gridSize, gridSize);
        }
    }

    // Рисуем еду
    ctx.fillStyle = "#c7522a";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Рисуем змейку
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#008585" : "#74a892"; // Голова жёлтая, тело зелёное
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);

        // Глазки змейки
        if (i === 0) {
            ctx.fillStyle = "black";
            ctx.fillRect(snake[i].x * gridSize + 5, snake[i].y * gridSize + 5, 4, 4);
            ctx.fillRect(snake[i].x * gridSize + 11, snake[i].y * gridSize + 5, 4, 4);
        }
    }
}

// Функция для переключения паузы
function togglePause() {
      if (isPaused) {
          resumeGame();
      } else {
          pauseGame();
      }
  }
  
  // Функция для приостановки игры
  function pauseGame() {
      isPaused = true;
      clearInterval(gameInterval); // Останавливаем игру
      pauseIcon.style.display = "block"; // Показываем иконку паузы
  }
  
  // Функция для возобновления игры
  function resumeGame() {
      isPaused = false;
      pauseIcon.style.display = "none"; // Скрываем иконку паузы
      gameInterval = setInterval(updateGame, 100); // Возобновляем игру (повторный запуск интервала)
  }

// Функция обновления игры
function update() {
    if (!gameRunning || isPaused) return; // Если игра остановлена или на паузе, ничего не делаем

    dx = nextDirection.dx; // Устанавливаем текущее направление
    dy = nextDirection.dy;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy }; // Новая голова змейки

    // Проверяем столкновение со стенами
    if (head.x < 0 || head.x >= canvasSize / gridSize ||
        head.y < 0 || head.y >= canvasSize / gridSize) {
        endGame(); // Конец игры при столкновении со стеной
        return;
    }

    // Проверяем столкновение с собственным телом
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame(); // Конец игры при столкновении с собой
            return;
        }
    }

    snake.unshift(head); // Добавляем новую голову

    // Проверяем, съела ли змейка яблоко
    if (head.x === food.x && head.y === food.y) {
        applesEaten++; // Увеличиваем количество съеденных яблок
        updateCounters(); // Обновляем счётчики
        food = generateFood(); // Генерируем новое яблоко
    } else {
        snake.pop(); // Удаляем хвостик, если яблоко не съедено
    }
}

// Функция генерации еды вне тела змейки
function generateFood() {
    let newFood;
    let collision;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvasSize / gridSize)), // Случайная координата X
            y: Math.floor(Math.random() * (canvasSize / gridSize))  // Случайная координата Y
        };
        collision = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y); // Проверка столкновения с телом змейки
    } while (collision); // Повтор до тех пор, пока еда не окажется вне змейки
    return newFood;
}

// Обновление счётчиков
function updateCounters() {
      applesCounter.innerText = "Apples: " + applesEaten; // Обновляем количество яблок
      score = applesEaten * 10; // Счёт равен количеству яблок умноженному на 10
      scoreBoard.innerText = "Score: " + score; // Обновляем рейтинг
  
      // Проверяем, установлен ли новый рекорд
      if (score > highScore) {
          highScore = score; // Обновляем лучший результат
          localStorage.setItem("highScore", highScore); // Сохраняем новый рекорд в localStorage
          recordMessage.textContent = "NEW RECORD! <3"; // Показываем сообщение о новом рекорде
          recordMessage.style.display = "block"; // Отображаем сообщение
      } else {
          recordMessage.style.display = "none"; // Скрываем сообщение, если рекорд не побит
      }
  }

// Завершение игры и добавление результата в рейтинг
function endGame() {
    gameRunning = false; // Ставим игру на стоп
    alert(`Игра окончена! Ваш итоговый рейтинг: ${score}`); // Сообщение о конце игры
    addScoreToLeaderboard(score); // Добавляем результат в рейтинг
    saveLeaderboard(); // Сохраняем рейтинг в localStorage
    location.reload(); // Перезагружаем страницу для нового раунда
}

// Добавление счёта в рейтинг
function addScoreToLeaderboard(score) {
    const listItem = document.createElement("li"); // Создаём новый элемент списка
    listItem.textContent = `Player: ${score} points`; // Выводим строку с результатом
    scoreList.appendChild(listItem); // Добавляем результат в список лидеров
}

// Сохранение рейтинга в localStorage
function saveLeaderboard() {
    const leaderboard = []; // Создаем массив для хранения результатов
    const items = scoreList.getElementsByTagName("li"); // Получаем все элементы списка
    for (let item of items) {
        leaderboard.push(item.textContent); // Заполняем массив результатами
    }
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard)); // Сохраняем рейтинг в localStorage
}

// Загрузка рейтинга из localStorage
function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")); // Получаем данные из localStorage
    if (leaderboard) { // Если есть сохранённые результаты
        leaderboard.forEach(score => {
            const listItem = document.createElement("li"); // Создаём новый элемент списка
            listItem.textContent = score; // Вставляем результат
            scoreList.appendChild(listItem); // Добавляем в список лидеров
        });
    }
}

// Главный игровой цикл
function gameLoop() {
    if (gameRunning && !isPaused) { // Если игра запущена и не на паузе
        update(); // Обновляем состояние игры
        draw(); // Рисуем всё на экране
        setTimeout(gameLoop, 100); // Задержка перед следующим кадром
    }
}
// Функция для удаления всего рейтинга
function clearLeaderboard() {
      // Очищаем список лидеров
      const scoreList = document.getElementById("scoreList");
      scoreList.innerHTML = "";
  
      // Очищаем localStorage
      localStorage.removeItem("leaderboard");
  
      // Перезагружаем страницу для обновления интерфейса
      location.reload();
  }

  // Обрабатываем событие клика по кнопке
  document.getElementById("clearButton").addEventListener("click", clearLeaderboard);

// Управление змейкой
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
        case "w":   
        case "W":
        case "ц":
        case "Ц":
            if (dy === 0) { nextDirection = { dx: 0, dy: -1 }; }
            break;
        case "ArrowDown":
        case "s":   
        case "S":
        case "ы":
        case "Ы":   
            if (dy === 0) { nextDirection = { dx: 0, dy: 1 }; }
            break;
        case "ArrowLeft":
        case "a":   
        case "A":
        case "ф":
        case "Ф":   
            if (dx === 0) { nextDirection = { dx: -1, dy: 0 }; }
            break;
        case "ArrowRight":
        case "d":   
        case "D":
        case "в":
        case "В": 
            if (dx === 0) { nextDirection = { dx: 1, dy: 0 }; }
            break;
        case "Escape":
            if (isPaused) {
                resumeGame();
            } else {
                pauseGame();
            }
            break;
    }
});

// Загрузка рейтинга при старте
window.onload = loadLeaderboard;
highScore = localStorage.getItem("highScore") || 0; // Загружаем предыдущий рекорд

// Запуск главного игрового цикла
gameLoop();
module.exports = { generateFood, update, endGame };