import passport from 'passport';
import jwt from 'jsonwebtoken';
import { handleError } from '../utils/responseHandlers.mjs';
import { addToBlacklist } from '../utils/tokenBlacklist.mjs';
import { APP_CONFIG, MESSAGES } from '../config/config.mjs';

export const authUser = (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) return next(err);
        if (!user) return handleError(res, 401, MESSAGES.invalidCredentials);

        req.logIn(user, (err) => {
            if (err) return next(err);

            // Create JWT token
            const token = jwt.sign(
                { id: user.id, username: user.username },
                APP_CONFIG.jwtSecret,
                { expiresIn: '1h' }
            );

            // Store token in an HTTP-only cookie (optional for extra security)
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: APP_CONFIG.env === 'production',
                sameSite: 'strict',
                maxAge: 3600000 // 1 hour
            });

            res.status(200).json({
                message: MESSAGES.authSuccess,
                user: { id: user.id, username: user.username, job: user.job },
                token, // optional if cookies are used
            });
        });
    })(req, res, next);
};

export const refreshToken = (req, res) => {
    const oldToken = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
    if (!oldToken) return handleError(res, 401, 'No token provided');

    jwt.verify(oldToken, APP_CONFIG.jwtSecret, { ignoreExpiration: true }, (err, decoded) => {
        if (err) return handleError(res, 401, 'Invalid token');

        const newToken = jwt.sign(
            { id: decoded.id, username: decoded.username },
            APP_CONFIG.jwtSecret,
            { expiresIn: '1h' }
        );

        // Send new token
        res.cookie('authToken', newToken, {
            httpOnly: true,
            secure: APP_CONFIG.env === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        res.status(200).json({ token: newToken });
    });
};

export const logoutUser = (req, res, next) => {
    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

    req.logout((err) => {
        if (err) return next(err);

        req.session.destroy((err) => {  // Destroy the session
            if (err) return next(err);

            res.clearCookie('connect.sid');
            res.clearCookie('authToken');

            if (token) addToBlacklist(token);

            res.status(200).json({ message: MESSAGES.logoutSuccess });
        });
    });
};
