import express from "express";
import { db } from "../db.js";
import bcrypt from "bcrypt";
import passport from "passport";
import env from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { generateToken } from "../utils/jwt.js";
import { authenticateJWT } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
env.config({ path: path.join(__dirname, "../.env") });

const isProd = process.env.NODE_ENV === "production";
const FRONTEND_URL = isProd ? process.env.FRONTEND_RENDER_URL : process.env.FRONTEND_LOCAL_URL
const saltRounds = 10;

const router = express.Router();

router.get("/user", authenticateJWT, (req, res) => {
    const { id, name, email } = req.user;
    res.status(200).json({ user: { id, name, email } });
});


router.get("/google", (req, res, next) => {
    const redirectTo = req.query.redirectTo || "/";
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: redirectTo,
        session: false
    })(req, res, next);
});

router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: FRONTEND_URL + "/login",
        session: false
    }),
    (req, res) => {
        const redirectTo = req.query.state || "/";
        const token = generateToken(req.user);
        res.redirect(`${FRONTEND_URL}/oauth-success?token=${token}&redirectTo=${redirectTo}`);
    }
);

router.post("/register", async (req, res) => {
    let { name, email, password } = req.body;
    try {
        email = email.trim().toLowerCase();
        const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: "This email is already registered. Please try logging in." });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await db.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`,
            [name, email, hashedPassword]
        );

        const token = generateToken(newUser.rows[0]);
        return res.status(201).json({
            message: "User registered successfully",
            user: newUser.rows[0],
            token
        });

    } catch (error) {
        console.error("Registration error:", error.stack);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Email not registered" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = generateToken(user);
        return res.status(200).json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email }, token });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
});

router.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logout successful" });
});

export default router;
