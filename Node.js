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

// Маршрут для получения/сохранения монет
app.post('/api/coins', async (req, res) => {
    const { username, coins } = req.body;

    try {
        let user = await User.findOne({ username });

        if (!user) {
            // Если пользователь не найден, создать новую запись
            user = new User({ username, coins: coins || 0 });
        } else if (coins !== undefined) {
            // Если пользователь найден, обновить количество монет
            user.coins = coins;
        }

        await user.save();
        res.json({ username: user.username, coins: user.coins });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
