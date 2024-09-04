import express from 'express';
import userRoutes from './userRoutes.mjs';
import authRoutes from './authRoutes.mjs';

const router = express.Router();

router.get('/', (req, res) => {
    const cookieOptions = {
        maxAge: APP_CONFIG.sessionMaxAge, 
        signed: true,
        httpOnly: true,
        secure: APP_CONFIG.env === 'production', // Only secure cookies in production
    };
    res.cookie('API_TOKEN', 'hello', cookieOptions);
    res.status(200).json({ message: 'WELCOME TO THE API' });
});

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router;
