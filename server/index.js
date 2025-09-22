import express from "express";
import cors from "cors"
import postRouter from "./routes/crud.js"
import userRouter from "./routes/user.js"
import passport from "./passportConfig.js";
import session from "express-session";
import env from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

env.config({ path: path.join(__dirname, ".env") });

const isProd = process.env.NODE_ENV === "production";

const port = 5000;

const app = express();

app.use(cors({
    origin: isProd ? process.env.FRONTEND_RENDER_URL : process.env.FRONTEND_LOCAL_URL,
    credentials: true,
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProd ? true : false,
        sameSite: isProd ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/posts", postRouter);
app.use("/api/auth", userRouter);

app.listen(port, () => console.log(`Server running on port : ${port}`));
