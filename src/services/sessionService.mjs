import session from 'express-session';
import MongoStore from 'connect-mongo';
import { APP_CONFIG } from '../config/config.mjs';

// Create session store using MongoDB
const sessionStore = MongoStore.create({
    mongoUrl: APP_CONFIG.mongoUrl,
    collectionName: 'sessions',
    ttl: APP_CONFIG.sessionMaxAge / 1000, 
    autoRemove: 'native' // Automatically remove expired sessions
});

// Session options configuration
const sessionOptions = {
    secret: APP_CONFIG.sessionSecret,
    saveUninitialized: false,
    resave: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        secure: APP_CONFIG.env === 'production', // Secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: APP_CONFIG.sessionMaxAge, // Max age in milliseconds
    }
};

// Export configured session middleware
export default session(sessionOptions);
