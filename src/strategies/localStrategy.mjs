import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import mockUsers from "../data/mockUsers.mjs";

passport.use(
    new LocalStrategy((username, password, done) => {
        try {
            const user = mockUsers.find(user => user.username === username);
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            if (user.password !== password) {
                return done(null, false, { message: 'Incorrect credentials' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = mockUsers.find(user => user.id === id);
    if (user) {
        done(null, user);
    } else {
        done(new Error('User not found'));
    }
});

export default passport;
