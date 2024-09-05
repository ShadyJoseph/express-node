import jwt from 'jsonwebtoken';
import { handleError } from '../utils/responseHandlers.mjs';
import { isBlacklisted } from '../utils/tokenBlacklist.mjs';
import { APP_CONFIG } from '../config/config.mjs';

export const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return handleError(res, 401, 'Access denied: No token provided');

    if (isBlacklisted(token)) return handleError(res, 401, 'Access denied: Invalid token');

    jwt.verify(token, APP_CONFIG.jwtSecret, (err, decoded) => {
        if (err) return handleError(res, 401, 'Access denied: Invalid token');

        req.user = decoded;
        next();
    });
};
