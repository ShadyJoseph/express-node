import { checkSchema } from 'express-validator';
import mockUsers from '../data/mockUsers.mjs';
import { userIdSchema } from '../utils/validationSchemas.mjs';
import validateRequest from './validateRequest.mjs';

const validateUserId = [
  checkSchema(userIdSchema),
  validateRequest,
  (req, res, next) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: `User with ID ${userId} not found` });
    }
    req.userIndex = userIndex;
    next();
  }
];

export default validateUserId;
