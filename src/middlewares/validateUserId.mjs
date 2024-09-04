import { checkSchema } from 'express-validator';
import { userIdSchema } from '../utils/validationSchemas.mjs';
import validateRequest from './validateRequest.mjs';
import User from '../mongoose/schemas/user.mjs';

const validateUserId = [
  checkSchema(userIdSchema),
  validateRequest,
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: `User with ID ${userId} not found` });
      }
      req.user = user; // Pass the user data to the next middleware or controller
      next();
    } catch (err) {
      console.error('Error validating user ID:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
];

export default validateUserId;
