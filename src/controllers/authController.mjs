import passport from 'passport';
import jwt from 'jsonwebtoken';
import { handleError } from '../utils/responseHandlers.mjs';
import { addToBlacklist } from '../utils/tokenBlacklist.mjs';
import { APP_CONFIG, MESSAGES, STATUS_CODES } from '../config/config.mjs';

// Helper to create cookie options
const getCookieOptions = () => ({
    httpOnly: true,
    secure: APP_CONFIG.env === 'production',
    sameSite: 'strict',
    maxAge: APP_CONFIG.jwtMaxAge || 3600000, // 1 hour or from config
});

export const authUser = (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) return next(err);
        if (!user) return handleError(res, STATUS_CODES.unauthorized, MESSAGES.invalidCredentials);

        req.logIn(user, (err) => {
            if (err) return next(err);

            const token = jwt.sign(
                { id: user.id, username: user.username },
                APP_CONFIG.jwtSecret,
                { expiresIn: APP_CONFIG.jwtExpiry || '1h' }
            );

            res.cookie('authToken', token, getCookieOptions());

            res.status(STATUS_CODES.success).json({
                message: MESSAGES.authSuccess,
                user: { id: user.id, username: user.username, job: user.job },
                token,
            });
        });
    })(req, res, next);
};

export const refreshToken = (req, res) => {
    const oldToken = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
    if (!oldToken) return handleError(res, STATUS_CODES.unauthorized, MESSAGES.noTokensProvided);

    jwt.verify(oldToken, APP_CONFIG.jwtSecret, { ignoreExpiration: true }, (err, decoded) => {
        if (err) return handleError(res, STATUS_CODES.unauthorized, MESSAGES.invalidToken);

        const newToken = jwt.sign(
            { id: decoded.id, username: decoded.username },
            APP_CONFIG.jwtSecret,
            { expiresIn: APP_CONFIG.jwtExpiry || '1h' }
        );

        res.cookie('authToken', newToken, getCookieOptions());
        res.status(STATUS_CODES.success).json({ token: newToken });
    });
};

export const logoutUser = (req, res, next) => {
    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

    req.logout((err) => {
        if (err) return next(err);

        req.session.destroy((err) => {
            if (err) return next(err);

            res.clearCookie('connect.sid');
            res.clearCookie('authToken');

            if (token) addToBlacklist(token);

            res.status(STATUS_CODES.success).json({ message: MESSAGES.logoutSuccess });
        });
    });
};
