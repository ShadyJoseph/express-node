import jwt from 'jsonwebtoken';
import { handleError } from '../utils/responseHandlers.mjs';
import { isBlacklisted } from '../utils/tokenBlacklist.mjs';
import { APP_CONFIG } from '../config/config.mjs';

export const ensureAuthenticated = (req, res, next) => {
    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

    if (!token) return handleError(res, 401, 'Access denied: No token provided');

    if (isBlacklisted(token)) return handleError(res, 401, 'Access denied: Invalid token');

    // Verify JWT
    jwt.verify(token, APP_CONFIG.jwtSecret, (err, decoded) => {
        if (err) {
            return handleError(res, 401, 'Access denied: Invalid token');
        }

        // Check if user is authenticated using Passport's built-in method
        if (!req.isAuthenticated()) {
            return handleError(res, 401, 'Access denied: Invalid session');
        }

        // Attach user data from the token to req.user
        req.user = decoded;
        next();
    });
};
