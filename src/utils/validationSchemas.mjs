import { isValidString } from '../validators/customValidators.mjs';

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
};

export const updateUserSchema = { ...createUserSchema };

export const patchUserSchema = {
  username: { ...createUserSchema.username, optional: true },
  job: { ...createUserSchema.job, optional: true },
};
