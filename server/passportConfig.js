import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import { db } from "./db.js";

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            email = email.trim().toLowerCase();
            const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
            if (result.rows.length === 0) {
                return done(null, false, { message: 'Email is not registered. Please register first.' });
            }
            const user = result.rows[0];

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);

        } catch (err) {
            return done(err);
        }
    }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value.toLowerCase();
        const name = profile.displayName;
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        let user;
        if (result.rows.length === 0) {
            const newUser = await db.query(
                `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`,
                [name, email, null]
            );
            user = newUser.rows[0];
        } else {
            user = result.rows[0];
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return done(new Error('User not found'));
        }
        const user = result.rows[0];
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;
