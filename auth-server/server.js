const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Хранилище пользователей (ключ: username#tag, значение: пароль)
const USERS = {};

// Функция генерации свободного тега
function generateTag(username) {
    const existingTags = Object.keys(USERS)
        .filter(key => key.startsWith(username + "#"))
        .map(key => parseInt(key.split("#")[1]));

    for (let i = 1; i <= 9999; i++) {
        const tag = i.toString().padStart(4, '0');
        if (!existingTags.includes(i)) {
            return tag;
        }
    }

    return null; // если все заняты (что маловероятно)
}

// Регистрация
app.post("/api/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Введите логин и пароль" });
    }

    const tag = generateTag(username);
    if (!tag) {
        return res.status(500).json({ message: "Не удалось сгенерировать уникальный тег" });
    }

    const fullUsername = `${username}#${tag}`;

    USERS[fullUsername] = password;
    res.json({ message: "Регистрация успешна!", user: fullUsername });
});

// Логин (по username без тега)
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    const userKey = Object.keys(USERS).find(key =>
        key.startsWith(username + "#") && USERS[key] === password
    );

    if (userKey) {
        res.json({ token: "fake-jwt-token", user: userKey });
    } else {
        res.status(401).json({ message: "Неверные данные" });
    }
});

app.listen(3000, () => console.log("Сервер запущен на http://localhost:3000"));
