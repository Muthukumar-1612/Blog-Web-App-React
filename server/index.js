import express from "express";
import cors from "cors"
import postRouter from "./routes/crud.js"
import userRouter from "./routes/user.js"
import passport from "./passportConfig.js";
import session from "express-session";
import env from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { db } from "./db.js";
import pgSession from "connect-pg-simple";
import cookieParser from "cookie-parser";

const PgSession = pgSession(session);

const __dirname = dirname(fileURLToPath(import.meta.url));

env.config({ path: path.join(__dirname, ".env") });

const isProd = process.env.NODE_ENV === "production";

const FRONTEND_URL = isProd ? process.env.FRONTEND_RENDER_URL : process.env.FRONTEND_LOCAL_URL;

const port = 5000;

const app = express();

app.set("trust proxy", 1);

app.use((req, res, next) => {
    // Special handling for OAuth callback (no Origin header)
    if (req.path === '/api/auth/google/callback' && !req.headers.origin) {
        res.header('Access-Control-Allow-Origin', FRONTEND_URL);
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
});

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like OAuth callbacks from Google)
        if (!origin) {
            return callback(null, true);
        }

        const allowedOrigins = isProd ? [
            "https://blog-web-app-react-frontend.onrender.com",
            "https://blog-web-app-react.onrender.com"
        ] : [
            process.env.FRONTEND_LOCAL_URL,
            "http://localhost:5173"
        ];

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("CORS blocked origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
    store: new PgSession({
        pool: db,
        tableName: "session"
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24,
        domain: isProd ? 'blog-web-app-react.onrender.com' : undefined
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log("=== REQUEST DEBUG ===");
    console.log("Path:", req.path);
    console.log("Method:", req.method);
    console.log("Headers.cookie:", req.headers.cookie);
    console.log("Parsed cookies:", req.cookies); // This will now work with cookie-parser
    console.log("Session ID:", req.sessionID);
    console.log("Authenticated:", req.isAuthenticated());
    console.log("User:", req.user);
    console.log("=====================");
    next();
});

// Specialized OAuth debugging
app.use('/api/auth/google', (req, res, next) => {
    if (req.path === '/callback') {
        console.log("=== GOOGLE OAUTH CALLBACK DETAILS ===");
        console.log("Query params:", req.query);
        console.log("Session before auth:", req.session);
        console.log("Cookies:", req.cookies);
        console.log("=====================================");
    }
    next();
});

// Add this before your routes
app.use('/api/auth/google/callback', (req, res, next) => {
    // Set explicit headers for OAuth callback
    res.header('Access-Control-Allow-Origin', FRONTEND_URL);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    next();
});

app.use("/api/posts", postRouter);
app.use("/api/auth", userRouter);

app.listen(port, () => console.log(`Server running on port : ${port}`));
