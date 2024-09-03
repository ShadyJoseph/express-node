import session from 'express-session';
import { APP_CONFIG } from '../config/config.mjs';

// Configure session options based on environment and configuration
const sessionOptions = {
  secret: APP_CONFIG.sessionSecret || process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    httpOnly: true,
    secure: APP_CONFIG.env === 'production', // Ensures cookies are secure in production
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 1000 * 60 * 60 * 2, // Session expiry set to 2 hours
  },
};

// Export the session middleware
const sessionService = session(sessionOptions);

export default sessionService;
