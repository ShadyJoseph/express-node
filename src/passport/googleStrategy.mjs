// src/passport/googleStrategy.mjs
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../mongoose/schemas/user.mjs';
import { APP_CONFIG } from '../config/config.mjs';

passport.use(new GoogleStrategy({
    clientID: APP_CONFIG.googleClientId,
    clientSecret: APP_CONFIG.googleClientSecret,
    callbackURL: '/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = new User({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
            });
            await user.save();
        }

        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
}));

export default passport;
