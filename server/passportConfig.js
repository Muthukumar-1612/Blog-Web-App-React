import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "./db.js";

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

export default passport;
