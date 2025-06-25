import express from 'express';
import Todo from '../models/Todo.js';
import User from '../models/User.js';

const router = express.Router();

//GET /api/todos?email=xx@xx.com
router.get('/', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'User noe found' });

    const todos = await Todo.find({ user: user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error('Get Todos Error', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

//POST /api/todos
router.post('/', async (req, res) => {
  const { title, email } = req.body;
  if (!title || !email) return res.status(400).json({ error: 'Title and email is required.' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'User not found' });

    const newTodo = new Todo({ title, user: user._id });
    const saved = await newTodo.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create Todo Error', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

//DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found.' });
    }
    res.json({ message: 'Todo deleted.' });
  } catch (err) {
    console.error('Delete Todo Error', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PATCH /api/todos/:id - 切换任务完成状态
router.patch('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found.' });

    todo.done = !todo.done;
    const updated = await todo.save();
    res.json(updated);
  } catch (err) {
    console.error('Toggle Todo Error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
