const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGEXP для перевірки пароля
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

// ✅ РЕЄСТРАЦІЯ
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, birthDate, username, email, password } = req.body;

    if (!firstName || !lastName || !birthDate || !username || !email || !password) {
      return res.status(400).json({ message: 'Будь ласка, заповніть всі поля' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Пароль має містити хоча б 6 символів, одну Велику літеру, одну цифру та один спецсимвол',
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: 'Користувач з таким логіном вже існує' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: 'Користувач з таким email вже існує' });
    }

    const newUser = new User({
      firstName,
      lastName,
      birthDate,
      username,
      email,
      password, // хешується в pre-save
    });

    await newUser.save();

    res.status(201).json({ message: 'Реєстрація успішна' });
  } catch (error) {
    console.error('Помилка при реєстрації:', error.message);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
});


// ✅ ЛОГІН
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Користувача не знайдено' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Невірний пароль' });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
      message: 'Успішний вхід'
    });
  } catch (error) {
    console.error('Помилка при логіні:', error.message);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
});

module.exports = router;






