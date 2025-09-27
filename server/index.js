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

app.use(cors({
    origin: isProd ? [
        "https://blog-web-app-react-frontend.onrender.com",
        "https://blog-web-app-react.onrender.com"
    ] : process.env.FRONTEND_LOCAL_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie'],
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
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Add this after session middleware but before routes
app.use((req, res, next) => {
    if (isProd) {
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Origin', req.headers.origin || "https://blog-web-app-react-frontend.onrender.com");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Cookie');
    }
    next();
});
app.use((req, res, next) => {
    console.log("=== REQUEST HEADERS ===");
    console.log("Origin:", req.headers.origin);
    console.log("Host:", req.headers.host);
    console.log("Cookie Header:", req.headers.cookie);
    console.log("=====================");
    next();
});;

app.use("/api/posts", postRouter);
app.use("/api/auth", userRouter);

app.listen(port, () => console.log(`Server running on port : ${port}`));
