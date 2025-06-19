import express from 'express';
const router = express.Router();

router.post('/register', (req, res) => {
  res.send('User register route');
});

router.post('/login', (req, res) => {
  res.send('User login route');
});

export default router;
