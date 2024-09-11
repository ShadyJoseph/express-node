import { checkSchema } from 'express-validator';
import { userIdSchema } from '../utils/validationSchemas.mjs';
import validateRequest from './validateRequest.mjs';
import LocalUser from '../mongoose/schemas/localuser.mjs';

const validateUserId = [
  checkSchema(userIdSchema),
  validateRequest,
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await LocalUser.findById(userId);
      if (!user) {
        return res.status(404).json({ error: `User with ID ${userId} not found` });
      }
      req.user = user; 
      next();
    } catch (err) {
      console.error('Error validating user ID:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
];

export default validateUserId;
