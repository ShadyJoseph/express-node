import express from 'express';
import { checkSchema } from 'express-validator';
import { authUser, logoutUser } from '../controllers/authController.mjs';
import validateRequest from '../middlewares/validateRequest.mjs';
import { authSchema } from '../utils/validationSchemas.mjs';
import { authLimiter } from '../utils/rateLimiter.mjs';
import passport from 'passport';
import { REDIRECT_URLS } from '../config/config.mjs';

const router = express.Router();

router.post('/', authLimiter, checkSchema(authSchema), validateRequest, authUser);
router.get('/discord', passport.authenticate('discord'));
router.get('/discord/redirect', passport.authenticate('discord', {
    failureRedirect: REDIRECT_URLS.failureRedirect,
    successRedirect: REDIRECT_URLS.successRedirect,
}));
router.post('/logout', logoutUser);

export default router;
