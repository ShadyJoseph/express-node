import express from 'express';
import userRoutes from './userRoutes.mjs';
import authRoutes from './authRoutes.mjs';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'WELCOME TO THE API' });
});

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router;
