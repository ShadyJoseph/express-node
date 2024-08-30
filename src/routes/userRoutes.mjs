import express from 'express';
import { checkSchema } from 'express-validator';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  patchUser,
  deleteUser
} from '../controllers/userController.mjs';
import validateRequest from '../middlewares/validateRequest.mjs';
import validateUserId from '../middlewares/validateUserId.mjs';
import {
  userFiltersSchema,
  createUserSchema,
  updateUserSchema,
  patchUserSchema
} from '../utils/validationSchemas.mjs';

const router = express.Router();

router.get('/', checkSchema(userFiltersSchema), validateRequest, getUsers);
router.post('/', checkSchema(createUserSchema), validateRequest, createUser);
router.get('/:id', validateUserId, getUserById);
router.put('/:id', validateUserId, checkSchema(updateUserSchema), validateRequest, updateUser);
router.patch('/:id', validateUserId, checkSchema(patchUserSchema), validateRequest, patchUser);
router.delete('/:id', validateUserId, deleteUser);

export default router;
