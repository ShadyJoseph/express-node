import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import DiscordUser from '../mongoose/schemas/discordUser.mjs';
import { APP_CONFIG } from '../config/config.mjs';
import { logger } from '../utils/logger.mjs';

// Configure Discord Strategy
passport.use(new DiscordStrategy({
    clientID: APP_CONFIG.discordClientId,
    clientSecret: APP_CONFIG.discordClientSecret,
    callbackURL: 'http://localhost:3000/api/auth/discord/redirect',
    scope: ['identify', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.email || profile.emails?.[0]?.value || null;
        let user = await DiscordUser.findOne({ discordId: profile.id });

        if (!user) {
            logger.info(`Creating new user in database with DiscordId: ${profile.id} and username: ${profile.username}`);
            user = new DiscordUser({
                discordId: profile.id,
                username: profile.username,
                email,
            });
            await user.save();
            logger.info(`User saved successfully with UserId: ${user.id}`);
        } else {
            logger.info(`User already exists in database with UserId: ${user.id}`);
        }

        return done(null, user);
    } catch (err) {
        logger.error('Error during Discord authentication', err);
        return done(err, false);
    }
}));

// Serialize user
passport.serializeUser((user, done) => {
    logger.info(`Serializing user with UserId: ${user.id}`);
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    logger.info(`Deserializing user with Id: ${id}`);
    try {
        const user = await DiscordUser.findById(id);
        if (!user) {
            logger.warn(`User not found during deserialization for Id: ${id}`);
            return done(new Error('User not found'));
        }
        logger.info(`User found during deserialization with UserId: ${user.id}`);
        done(null, user);
    } catch (err) {
        logger.error('Error deserializing user', err);
        done(err);
    }
});

export default passport;
