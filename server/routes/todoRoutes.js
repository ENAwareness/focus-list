import express from 'express';
import Todo from '../models/Todo.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

//GET /api/todos - 获取当前用户待办事项
router.get('/', async (req, res) => {
  try {
    //req.user 由protect 中间件设置
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error('Get Todos Error', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

//POST /api/todos
router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required.' });

  try {
    const newTodo = new Todo({ title, user: req.user._id });
    const saved = await newTodo.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create Todo Error', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

//DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found.' });
    }

    //确保待办事项属于当前认证用户
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized to delete this todo.' });
    }

    await todo.deleteOne();
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

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized to update this todo.' });
    }

    todo.done = !todo.done;
    const updated = await todo.save();
    res.json(updated);
  } catch (err) {
    console.error('Toggle Todo Error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
