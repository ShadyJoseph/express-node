import express from 'express';
import userRoutes from './userRoutes.mjs';

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Welcome to the API' }));
router.use('/users', userRoutes);

export default router;
