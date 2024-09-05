// src/middlewares/ensureAuthenticated.mjs
import jwt from 'jsonwebtoken';
import { handleError } from '../utils/responseHandlers.mjs';
import { isBlacklisted } from '../utils/tokenBlacklist.mjs';
import { APP_CONFIG } from '../config/config.mjs'; 

export const ensureAuthenticated = (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    console.log('Received token:', token); // Debug log

    if (!token) {
        return handleError(res, 401, 'Access denied: No token provided');
    }

    // Check if the token is blacklisted
    if (isBlacklisted(token)) {
        console.log('Token is blacklisted'); // Debug log
        return handleError(res, 401, 'Access denied: Invalid token');
    }

    jwt.verify(token, APP_CONFIG.jwtSecret, (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err); // Debug log
            return handleError(res, 401, 'Access denied: Invalid token');
        }

        req.user = decoded;
        console.log('Decoded user:', req.user); // Debug log

        next();
    });
};
