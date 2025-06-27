import express from 'express';
import User from '../models/User.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const newUser = new User({ username, email, password }); //修正了双重hash值加密
    await newUser.save();

    res.status(201).json({ username: newUser.username, email: newUser.email });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(200).json({
      username: user.username,
      token
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
