import express from 'express';
import { checkSchema } from 'express-validator';
import { authUser } from '../controllers/authController.mjs';
import validateRequest from '../middlewares/validateRequest.mjs';
import { authSchema } from '../utils/validationSchemas.mjs';
import { authLimiter } from '../utils/rateLimiter.mjs';

const router = express.Router();

router.post('/auth', authLimiter, checkSchema(authSchema), validateRequest, authUser);

export default router;
