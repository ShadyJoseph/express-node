import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../mongoose/schemas/user.mjs';
import bcrypt from 'bcrypt';

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username }).exec();
            if (!user) return done(null, false, { message: 'Invalid username or password' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: 'Invalid username or password' });

            return done(null, user);
        } catch (err) {
            console.error(`Error during local authentication: ${err.message}`);
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).exec();
        if (!user) return done(new Error('User not found'));
        done(null, user);
    } catch (err) {
        console.error(`Error deserializing user: ${err.message}`);
        done(err);
    }
});

export default passport;
