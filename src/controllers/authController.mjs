import passport from 'passport';
import jwt from 'jsonwebtoken';
import { handleError } from '../utils/responseHandlers.mjs';
import { addToBlacklist } from '../utils/tokenBlacklist.mjs';
import { APP_CONFIG } from '../config/config.mjs';

export const authUser = (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) return next(err);
        if (!user) return handleError(res, 401, 'Invalid credentials');

        req.logIn(user, (err) => {
            if (err) return next(err);

            const token = jwt.sign(
                { id: user.id, username: user.username },
                APP_CONFIG.jwtSecret,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: 'Authenticated successfully',
                token,
                user: { id: user.id, username: user.username, job: user.job },
            });
        });
    })(req, res, next);
};

export const refreshToken = (req, res) => {
    const oldToken = req.headers.authorization?.split(' ')[1];
    if (!oldToken) return handleError(res, 401, 'No token provided');

    jwt.verify(oldToken, APP_CONFIG.jwtSecret, { ignoreExpiration: true }, (err, decoded) => {
        if (err) return handleError(res, 401, 'Invalid token');

        const newToken = jwt.sign(
            { id: decoded.id, username: decoded.username },
            APP_CONFIG.jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token: newToken });
    });
};

export const logoutUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    req.logout((err) => {
        if (err) return next(err);

        req.session.destroy((err) => {
            if (err) return next(err);

            res.clearCookie('connect.sid');

            if (token) addToBlacklist(token);

            res.status(200).json({ message: 'Logged out successfully' });
        });
    });
};
