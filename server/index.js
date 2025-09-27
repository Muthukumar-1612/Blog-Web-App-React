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

const PgSession = pgSession(session);

const __dirname = dirname(fileURLToPath(import.meta.url));

env.config({ path: path.join(__dirname, ".env") });

const isProd = process.env.NODE_ENV === "production";

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
        // Allow requests with no origin (like mobile apps or OAuth callbacks)
        if (!origin && isProd) return callback(null, true);
        
        const allowedOrigins = isProd ? [
            "https://blog-web-app-react-frontend.onrender.com",
            "https://blog-web-app-react.onrender.com"
        ] : [process.env.FRONTEND_LOCAL_URL];
        
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());

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
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log("=== REQUEST HEADERS ===");
    console.log("Origin:", req.headers.origin);
    console.log("Host:", req.headers.host);
    console.log("Cookie Header:", req.headers.cookie);
    console.log("Session:", req.session);
    console.log("=====================");
    next();
});;

app.use("/api/posts", postRouter);
app.use("/api/auth", userRouter);

app.listen(port, () => console.log(`Server running on port : ${port}`));
