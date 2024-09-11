import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import User from '../mongoose/schemas/user.mjs';
import { APP_CONFIG } from '../config/config.mjs';

passport.use(new DiscordStrategy({
    clientID: APP_CONFIG.discordClientId,
    clientSecret: APP_CONFIG.discordClientSecret,
    callbackURL: '/auth/discord/redirect',
    scope: ['identify', 'email'],
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ discordId: profile.id });

        if (!user) {
            user = new User({
                discordId: profile.id,
                username: profile.username,
                email: profile.email,
            });
            await user.save();
        }

        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
}));

export default passport;
