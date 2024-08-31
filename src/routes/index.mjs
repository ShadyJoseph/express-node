// src/routes/index.mjs
import express from 'express';
import userRoutes from './userRoutes.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  const cookieOptions = { 
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
    signed: true,
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production' 
  };
  res.cookie('API_TOKEN', 'hello', cookieOptions);
  res.status(201).json({ message: 'Welcome to the API' });
});

router.use('/users', userRoutes);

export default router;