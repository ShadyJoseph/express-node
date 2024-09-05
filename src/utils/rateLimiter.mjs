import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts, please try again later',
});

// Rate limiting for user creation to prevent abuse
export const createUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 user creation requests per windowMs
  message: 'Too many account creation attempts, please try again later',
});
