const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/coinCounter', { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    coins: { type: Number, default: 0 }
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());

app.post('/api/coins', async (req, res) => {
    const { username, coins } = req.body;

    try {
        // Найти пользователя в базе данных
        let user = await User.findOne({ username });

        if (!user) {
            // Если пользователя нет, создать новую запись
            user = new User({ username, coins: coins || 0 });
        } else if (coins !== undefined) {
            // Если пользователь найден, обновить количество монет
            user.coins = coins;
        }

        // Сохранить данные в базе
        await user.save();

        // Вернуть актуальные данные клиенту
        res.json({ username: user.username, coins: user.coins });
    } catch (err) {
        console.error('Error processing /api/coins:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
