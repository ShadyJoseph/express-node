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

// Discord OAuth2 routes
router.get('/discord', passport.authenticate('discord'));

// Discord OAuth2 redirect route
router.get('/discord/redirect', passport.authenticate('discord', { 
    failureRedirect: '/login',  // Redirect to login on failure
    successRedirect: '/',       // Redirect to home page on success
}));

// Logout route
router.post('/logout', logoutUser);

export default router;
