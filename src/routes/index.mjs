import express from 'express';
import userRoutes from './userRoutes.mjs';

const router = express.Router();

// Root route that sets a signed cookie
router.get('/', (req, res) => {
  const cookieOptions = { 
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
    signed: true,
    httpOnly: true, // Prevent client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === 'production' // Ensure the cookie is only sent over HTTPS
  };
  res.cookie('API_TOKEN', 'hello', cookieOptions);
  res.status(201).json({ message: 'Welcome to the API' });
});

// Mount user routes under /users
router.use('/users', userRoutes);

export default router;
