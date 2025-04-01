const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const USERS = {}; // Хранилище пользователей (ключ: логин, значение: пароль)

// Регистрация
app.post("/api/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Введите логин и пароль" });
    }

    if (USERS[username]) {
        return res.status(409).json({ message: "Пользователь уже существует" });
    }

    USERS[username] = password;
    res.json({ message: "Регистрация успешна!" });
});

// Логин
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (USERS[username] && USERS[username] === password) {
        res.json({ token: "fake-jwt-token" });
    } else {
        res.status(401).json({ message: "Неверные данные" });
    }
});

app.listen(3000, () => console.log("Сервер запущен на http://localhost:3000"));
