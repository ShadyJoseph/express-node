import dotenv from 'dotenv';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { handleError } from '../utils/responseHandlers.mjs';
import { addToBlacklist } from '../utils/tokenBlacklist.mjs';
import { APP_CONFIG, MESSAGES, STATUS_CODES } from '../config/config.mjs';
import { logger } from '../utils/logger.mjs'; // Assuming logger utility is in place

dotenv.config();

// Helper to validate environment variables
const validateEnvVariables = () => {
    const requiredEnv = ['SESSION_SECRET', 'COOKIE_SECRET', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'MONGO_URL'];

    requiredEnv.forEach((envVar) => {
        if (!process.env[envVar]) {
            logger.error(`Missing required environment variable: ${envVar}`);
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    });
};

validateEnvVariables();

// Helper to create cookie options
const getCookieOptions = (maxAge = 3600000) => ({
    httpOnly: true,
    secure: APP_CONFIG.isProduction, // Only secure in production
    sameSite: 'strict',
    maxAge,
});

// Helper to create JWT token
const createJwtToken = (user, secret = APP_CONFIG.jwtSecret, expiresIn = '1h') => {
    return jwt.sign(
        { id: user.id, username: user.username },
        secret,
        { expiresIn }
    );
};

// Helper for error handling
const handleAuthError = (res, message, statusCode = STATUS_CODES.unauthorized) => {
    logger.warn(message);
    return handleError(res, statusCode, message);
};

// Authentication middleware using Passport
export const authUser = (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            logger.error('Error during authentication', err);
            return next(err);
        }

        if (!user) return handleAuthError(res, MESSAGES.invalidCredentials);

        req.logIn(user, (err) => {
            if (err) {
                logger.error('Error during login', err);
                return next(err);
            }

            const token = createJwtToken(user, APP_CONFIG.jwtSecret, APP_CONFIG.jwtExpiry);

            res.cookie('authToken', token, getCookieOptions(APP_CONFIG.jwtMaxAge));

            logger.info(`User ${user.username} authenticated successfully`);

            res.status(STATUS_CODES.success).json({
                message: MESSAGES.authSuccess,
                user: { id: user.id, username: user.username, job: user.job },
                token,
            });
        });
    })(req, res, next);
};

// Refresh JWT Token
export const refreshToken = (req, res) => {
    const oldToken = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

    if (!oldToken) {
        return handleAuthError(res, MESSAGES.noTokensProvided);
    }

    jwt.verify(oldToken, APP_CONFIG.jwtSecret, { ignoreExpiration: true }, (err, decoded) => {
        if (err && err.name !== 'TokenExpiredError') {
            logger.warn('Invalid token during refresh');
            return handleAuthError(res, MESSAGES.invalidToken);
        }

        const newToken = createJwtToken(decoded, APP_CONFIG.jwtSecret, APP_CONFIG.jwtExpiry);

        res.cookie('authToken', newToken, getCookieOptions(APP_CONFIG.jwtMaxAge));

        logger.info(`Token refreshed for user: ${decoded.username}`);

        res.status(STATUS_CODES.success).json({ token: newToken });
    });
};

// Logout User and Blacklist Token
export const logoutUser = (req, res, next) => {
    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

    req.logout((err) => {
        if (err) {
            logger.error('Error during logout', err);
            return next(err);
        }

        req.session.destroy((err) => {
            if (err) {
                logger.error('Error during session destruction', err);
                return next(err);
            }

            res.clearCookie('connect.sid');
            res.clearCookie('authToken');

            if (token) {
                addToBlacklist(token);
                logger.info(`Token blacklisted for token: ${token}`);
            }

            logger.info('User logged out and session destroyed');
            res.status(STATUS_CODES.success).json({ message: MESSAGES.logoutSuccess });
        });
    });
};
