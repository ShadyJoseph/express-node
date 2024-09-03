import passport from 'passport';
import { handleError } from '../utils/responseHandlers.mjs';

export const authUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return handleError(res, 401, "Invalid credentials");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.session.user = { id: user.id, username: user.username, job: user.job };
            req.session.visited = true;

            return res.status(200).json({ message: 'Authenticated successfully', user: req.session.user });
        });
    })(req, res, next);
};

export const authState = (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json(req.session.user);
    }
    return handleError(res, 401, 'Not authenticated');
};
