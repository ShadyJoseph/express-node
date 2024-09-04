import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../mongoose/schemas/user.mjs";
import bcrypt from "bcrypt";

// Configure the local strategy for use by Passport
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            // Find the user by username in the database
            const user = await User.findOne({ username }).exec();
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }

            // Compare the provided password with the stored hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid credentials' });
            }

            // If the user is found and the password matches, return the user object
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

// Serialize the user for the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize the user from the session
passport.deserializeUser(async (id, done) => {
    try {
        // Find the user by ID in the database
        const user = await User.findById(id).exec();
        if (user) {
            done(null, user);
        } else {
            done(new Error('User not found'));
        }
    } catch (err) {
        done(err);
    }
});

export default passport;
