import express from 'express';
import { checkSchema } from 'express-validator';
import { authUser, logoutUser } from '../controllers/authController.mjs';
import validateRequest from '../middlewares/validateRequest.mjs';
import { authSchema } from '../utils/validationSchemas.mjs';
import { authLimiter } from '../utils/rateLimiter.mjs';
import passport from 'passport';

const router = express.Router();

// Local Authentication route
router.post('/', authLimiter, checkSchema(authSchema), validateRequest, authUser);

// Google OAuth2 routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { 
    failureRedirect: '/login',
    successRedirect: '/',
}));

// Logout route
router.post('/logout', logoutUser);

export default router;
