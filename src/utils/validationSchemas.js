

// Custom validation functions
const isValidString = (value) => typeof value === 'string' && value.trim().length > 0;

// User ID validation schema
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

// User filters validation schema
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

// Create user validation schema
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
            errorMessage: 'Username is required and must be a valid string',
        },
    },
    job: {
        in: ['body'],
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: { min: 3, max: 25 },
            errorMessage: 'Job is required and must be between 3 and 25 characters',
        },
        custom: {
            options: isValidString,
            errorMessage: 'Job is required and must be a valid string',
        },
    },
};

// Update user validation schema
export const updateUserSchema = {
    username: {
        in: ['body'],
        optional: true,
        isString: true,
        trim: true,
        isLength: {
            options: { min: 3, max: 20 },
            errorMessage: 'Username must be between 3 and 20 characters',
        },
        custom: {
            options: isValidString,
            errorMessage: 'Username must be a valid string',
        },
    },
    job: {
        in: ['body'],
        optional: true,
        isString: true,
        trim: true,
        isLength: {
            options: { min: 3, max: 25 },
            errorMessage: 'Job must be between 3 and 25 characters',
        },
        custom: {
            options: isValidString,
            errorMessage: 'Job must be a valid string',
        },
    },
};

// Patch user validation schema
export const patchUserSchema = {
    username: {
        in: ['body'],
        optional: true,
        isString: true,
        trim: true,
        isLength: {
            options: { min: 3, max: 20 },
            errorMessage: 'Username must be between 3 and 20 characters',
        },
        custom: {
            options: isValidString,
            errorMessage: 'Username must be a valid string',
        },
    },
    job: {
        in: ['body'],
        optional: true,
        isString: true,
        trim: true,
        isLength: {
            options: { min: 3, max: 25 },
            errorMessage: 'Job must be between 3 and 25 characters',
        },
        custom: {
            options: isValidString,
            errorMessage: 'Job must be a valid string',
        },
    },
};
