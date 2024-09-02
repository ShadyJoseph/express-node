import express from 'express';
import userRoutes from './userRoutes.mjs';
import authRoutes from './authRoutes.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  const cookieOptions = { 
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
    signed: true,
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
  };
  res.cookie('API_TOKEN', 'some_dynamic_value', cookieOptions); // 'some_dynamic_value' should be replaced with a real token
  res.status(201).json({ message: 'WELCOME TO THE API' });
});

router.use('/users', userRoutes);
router.use('/auth', authRoutes); 

export default router;
