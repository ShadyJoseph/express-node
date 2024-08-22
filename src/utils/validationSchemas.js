// utils/validationSchemas.js
import { body, param, query, checkSchema } from 'express-validator';

// Custom validation functions
const isValidString = (value) => typeof value === 'string' && value.trim().length > 0;

// User ID validation
export const userIdValidation = [
    param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer')
];

// User filters validation
export const userFiltersValidation = [
    query('filter').optional().isString().notEmpty().withMessage('Filter must be a non-empty string'),
    query('value').optional().isString().withMessage('Value must be a string')
];

// Create user validation
export const createUserValidation = [
    body('username').custom(isValidString).isLength({ min: 3, max: 20 })
        .withMessage('Username is required and must be between 3 and 20 characters'),
    body('job').custom(isValidString).isLength({ min: 3, max: 25 })
        .withMessage('Job is required and must be between 3 and 25 characters')
];

// Update user validation
export const updateUserValidation = [
    body('username').optional().custom(isValidString).isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters'),
    body('job').optional().custom(isValidString).isLength({ min: 3, max: 25 })
        .withMessage('Job must be between 3 and 25 characters')
];

// Patch user validation
export const patchUserValidation = [
    body('username').optional().custom(isValidString).isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters'),
    body('job').optional().custom(isValidString).isLength({ min: 3, max: 25 })
        .withMessage('Job must be between 3 and 25 characters')
];
