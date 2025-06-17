const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// REGEXP для перевірки пароля
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, birthDate, email, password } = req.body;

    // Перевірка чи всі поля передані
    if (!firstName || !lastName || !birthDate || !email || !password) {
      return res.status(400).json({ message: 'Будь ласка, заповніть всі поля' });
    }

    // Перевірка пароля через RegExp
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Пароль має містити хоча б 6 символів, одну Велику літеру, одну цифру та один спецсимвол',
      });
    }

    // Перевірка, чи email вже використовується
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Користувач з таким email вже існує' });
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення нового юзера
    const newUser = new User({
      firstName,
      lastName,
      birthDate,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'Реєстрація успішна' });
  } catch (error) {
    console.error('Помилка при реєстрації:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
});

module.exports = router;
