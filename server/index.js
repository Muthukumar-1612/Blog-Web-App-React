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

console.log( "URL", isProd ? process.env.FRONTEND_RENDER_URL : process.env.FRONTEND_LOCAL_URL);

const port = 5000;

const app = express();

app.set("trust proxy", 1);

app.use(cors({
    origin: "https://blog-web-app-react-frontend.onrender.com",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
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

app.use((req, res, next) => {
  console.log("Request:", req.method, req.url);
  console.log("Cookies received:", req.headers.cookie);
  next();
});

app.use("/api/posts", postRouter);
app.use("/api/auth", userRouter);

app.listen(port, () => console.log(`Server running on port : ${port}`));
