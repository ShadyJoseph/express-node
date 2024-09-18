import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import LocalUser from '../mongoose/schemas/localUser.mjs';
import bcrypt from 'bcrypt';

// Configure Local Strategy
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await LocalUser.findOne({ username }).exec();
        if (!user) return done(null, false, { message: 'Invalid username or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Invalid username or password' });

        return done(null, user);
    } catch (err) {
        console.error(`Error during local authentication: ${err.message}`);
        return done(err);
    }
}));

// Serialize user
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await LocalUser.findById(id).exec();
        if (!user) return done(new Error('User not found'));
        done(null, user);
    } catch (err) {
        console.error(`Error deserializing user: ${err.message}`);
        done(err);
    }
});

export default passport;
