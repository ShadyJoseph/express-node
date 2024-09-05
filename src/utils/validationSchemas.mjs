import { isValidString } from '../utils/customValidators.mjs';

// Common validation rules
const stringValidation = {
  isString: true,
  trim: true,
  isLength: {
    options: { min: 3, max: 50 },
    errorMessage: 'Must be between 3 and 50 characters',
  },
  custom: {
    options: isValidString,
    errorMessage: 'Must be a valid string without leading or trailing spaces',
  },
};

const passwordValidation = {
  isString: true,
  isLength: {
    options: { min: 8, max: 50 },
    errorMessage: 'Must be between 8 and 50 characters long',
  },
  matches: {
    options: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    errorMessage: 'Must contain at least one letter and one number',
  },
};

// Schemas
export const userIdSchema = {
  id: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Invalid user ID format',
    },
  },
};

export const userFiltersSchema = {
  filter: {
    in: ['query'],
    optional: true,
    ...stringValidation,
    notEmpty: {
      errorMessage: 'Filter must be a non-empty string',
    },
  },
  value: {
    in: ['query'],
    optional: true,
    ...stringValidation,
  },
};

export const createUserSchema = {
  username: {
    in: ['body'],
    notEmpty: true,
    ...stringValidation,
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: 'Username must be between 3 and 20 characters',
    },
  },
  job: {
    in: ['body'],
    notEmpty: true,
    ...stringValidation,
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage: 'Job must be between 3 and 50 characters',
    },
  },
  password: {
    in: ['body'],
    notEmpty: true,
    ...passwordValidation,
  },
};

export const updateUserSchema = { ...createUserSchema };

export const patchUserSchema = {
  username: {
    ...createUserSchema.username,
    optional: true,
  },
  job: {
    ...createUserSchema.job,
    optional: true,
  },
  password: {
    ...createUserSchema.password,
    optional: true,
  },
};

export const authSchema = {
  username: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    trim: true,
    errorMessage: 'Username is required',
  },
  password: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    trim: true,
    errorMessage: 'Password is required',
  },
};
