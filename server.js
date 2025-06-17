require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Підключаємо всі маршрути до запуску сервера!
const todoRoutes = require('./routes/todos');
const authRoutes = require('./routes/auth');
app.use('/api/todos', todoRoutes);
app.use('/api', authRoutes);

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('❌ Mongo error:', err));
