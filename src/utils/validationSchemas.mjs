import { isValidString } from '../utils/customValidators.mjs';
import rateLimit from 'express-rate-limit';


export const userIdSchema = {
  id: {
    in: ['params'],
    isInt: {
      options: { gt: 0 },
      errorMessage: 'ID must be a positive integer',
    },
    toInt: true,
  },
};

export const userFiltersSchema = {
  filter: {
    in: ['query'],
    optional: true,
    isString: true,
    notEmpty: true,
    errorMessage: 'Filter must be a non-empty string',
  },
  value: {
    in: ['query'],
    optional: true,
    isString: true,
    errorMessage: 'Value must be a string',
  },
};

export const createUserSchema = {
  username: {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: 'Username is required and must be between 3 and 20 characters',
    },
    custom: {
      options: isValidString,
      errorMessage: 'Username must be a valid string',
    },
  },
  job: {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage: 'Job is required and must be between 3 and 50 characters',
    },
    custom: {
      options: isValidString,
      errorMessage: 'Job must be a valid string',
    },
  },
  password: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password is required and must be at least 6 characters long',
    },
  },
};


export const updateUserSchema = { ...createUserSchema };

export const patchUserSchema = {
  username: { ...createUserSchema.username, optional: true },
  job: { ...createUserSchema.job, optional: true },
};


// Validation schema for auth
export const authSchema = {
  username: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    errorMessage: 'Username is required',
  },
  password: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    errorMessage: 'Password is required',
  },
};

// Rate limiting for the auth route
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many login attempts, please try again later',
});
