// src/routes/authRoutes.mjs
import express from 'express';
import { checkSchema } from 'express-validator';
import { authUser, logoutUser } from '../controllers/authController.mjs';
import validateRequest from '../middlewares/validateRequest.mjs';
import { authSchema } from '../utils/validationSchemas.mjs';
import { authLimiter } from '../utils/rateLimiter.mjs';

const router = express.Router();

// Authentication route
router.post('/', authLimiter, checkSchema(authSchema), validateRequest, authUser);

// Logout route
router.post('/logout', logoutUser);

export default router;
