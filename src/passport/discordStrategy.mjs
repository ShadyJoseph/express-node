import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import User from '../mongoose/schemas/user.mjs';
import { APP_CONFIG } from '../config/config.mjs';
import { logError } from '../utils/logger.mjs'; // Ensure you have this utility for logging errors

passport.use(new DiscordStrategy({
    clientID: APP_CONFIG.discordClientId,
    clientSecret: APP_CONFIG.discordClientSecret,
    callbackURL: '/auth/discord/redirect',
    scope: ['identify', 'email'],
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.email || profile.emails?.[0]?.value || null;
        let user;

        try {
            user = await User.findOne({ discordId: profile.id }).exec();
        } catch (dbError) {
            logError('Error finding user by Discord ID', dbError);
            return done(dbError, false);
        }

        if (!user) {
            try {
                user = new User({
                    discordId: profile.id,
                    username: profile.username,
                    email,
                });
                await user.save();
            } catch (saveError) {
                logError('Error saving new user to the database', saveError);
                return done(saveError, false);
            }
        }

        return done(null, user);
    } catch (err) {
        logError('Error during Discord authentication', err);
        return done(err, false);
    }
}));

export default passport;
