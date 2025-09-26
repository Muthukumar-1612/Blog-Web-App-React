import express from "express";
import { db } from "../db.js";
import bcrypt from "bcrypt";
import passport from "passport";
import env from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

env.config({ path: path.join(__dirname, "../.env") });

const isProd = process.env.NODE_ENV === "production";
const FRONTEND_URL = isProd ? process.env.FRONTEND_RENDER_URL : process.env.FRONTEND_LOCAL_URL

const saltRounds = 10;

const router = express.Router();

router.get("/user", (req, res) => {
    res.set("Cache-Control", "no-store");
    if (req.isAuthenticated()) {
        const { id, name, email } = req.user;
        return res.status(200).json({ user: { id, name, email } });
    }
    return res.status(401).json({ message: "You are unauthorized. Please try logging in" });
});

router.get("/google", (req, res, next) => {
    const redirectTo = req.query.redirectTo || "/";
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: redirectTo,
    })(req, res, next);
});

router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: FRONTEND_URL + "/login",
        session: true
    }),
    (req, res) => {
        const redirectTo = req.query.state || "/";
        // console.log("OAuth successful, redirecting to:", redirectTo);
        // Ensure session is persisted before redirect
        req.session.save(() => {
            res.redirect(`${FRONTEND_URL}/oauth-success?redirectTo=${redirectTo}`);
        });
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
        return res.status(201).json({
            message: "User registered successfully",
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error("Registration error:", error.stack);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: "Something went wrong. Please try again later." });
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        // Debug cookie
  res.cookie("debug", "testcookie", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });

  console.log("Session after login:", req.session);

        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: "Login failed. Please try again." });
            }
            return res.status(200).json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
        });
    })(req, res, next);
});

router.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed. Please try again." });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Could not destroy session. Please try again." });
            }
            res.clearCookie("connect.sid");
            return res.status(200).json({ message: "Logout successful" });
        });
    });
});

export default router;
