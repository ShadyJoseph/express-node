// src/routes/authRoutes.mjs
import express from 'express';
import { checkSchema } from 'express-validator';
import { authUser, authState, logoutUser } from '../controllers/authController.mjs';
import validateRequest from '../middlewares/validateRequest.mjs';
import { authSchema } from '../utils/validationSchemas.mjs';
import { authLimiter } from '../utils/rateLimiter.mjs';

const router = express.Router();

// Authentication route
router.post('/', authLimiter, checkSchema(authSchema), validateRequest, authUser);

// Protected route to check authentication status
router.get('/status', authState);

// Logout route
router.post('/logout', logoutUser);

export default router;
/*{
  "username":"test666","password":"testpass666","job":"testjob666"
}*/