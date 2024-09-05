import { isValidString } from '../utils/customValidators.mjs';
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
      errorMessage: 'Username must be a valid string without leading or trailing spaces',
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
      errorMessage: 'Job must be a valid string without leading or trailing spaces',
    },
  },
  password: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    isLength: {
      options: { min: 8, max: 50 },
      errorMessage: 'Password is required and must be between 8 and 50 characters long',
    },
    matches: {
      options: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      errorMessage: 'Password must contain at least one letter and one number',
    },
  },
};

export const updateUserSchema = { ...createUserSchema };

export const patchUserSchema = {
  username: { ...createUserSchema.username, optional: true },
  job: { ...createUserSchema.job, optional: true },
  password: { ...createUserSchema.password, optional: true },
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
