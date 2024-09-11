import passport from 'passport';
import './localStrategy.mjs';
import './discordStrategy.mjs';
import User from '../mongoose/schemas/user.mjs';

// Serialize user to store in session
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize user to retrieve from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).exec();
        if (!user) return done(new Error('User not found'));
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;
