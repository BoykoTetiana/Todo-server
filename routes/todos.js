const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/authMiddleware');

// ВСІ маршрути тепер захищені middleware
router.use(authMiddleware);

// GET — всі тудушки поточного юзера
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — додати нову тудушку для поточного юзера
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const newTodo = new Todo({ text, userId: req.user.userId });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT — оновити тудушку за id, тільки якщо вона належить користувачу
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    todo.text = req.body.text ?? todo.text;
    todo.done = req.body.done ?? todo.done;
    const updatedTodo = await todo.save();

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — видалити тудушку за id, тільки якщо вона належить користувачу
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
