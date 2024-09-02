import express from 'express';
import { checkSchema } from 'express-validator';
import { authUser, authState } from '../controllers/authController.mjs';
import validateRequest from '../middlewares/validateRequest.mjs';
import { authSchema } from '../utils/validationSchemas.mjs';
import { authLimiter } from '../utils/rateLimiter.mjs';

const router = express.Router();

// Authentication route
router.post('/', authLimiter, checkSchema(authSchema), validateRequest, authUser);

// Protected route to check authentication status
router.get('/status', authState);

export default router;
