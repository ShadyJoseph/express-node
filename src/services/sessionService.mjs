import session from 'express-session';
import { APP_CONFIG } from '../config/config.mjs';

// Configure session options based on environment and configuration
const sessionOptions = {
  secret: APP_CONFIG.sessionSecret,
  saveUninitialized: false,
  resave: false,
  cookie: {
    httpOnly: true,
    secure: APP_CONFIG.env === 'production', 
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: APP_CONFIG.sessionMaxAge, 
  },
};

// Export the session middleware
const sessionService = session(sessionOptions);

export default sessionService;
