import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

//获取所有待办
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error('Get Todos Error', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

//创建待办
router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required.' });

  try {
    const newTodo = new Todo({ title });
    const saved = await newTodo.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create Todo Error', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
