import express from "express";
import cors from "cors"
import postRouter from "./routes/crud.js"
import userRouter from "./routes/user.js"
import passport from "./passportConfig.js";
import env from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { db } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

env.config({ path: path.join(__dirname, ".env") });

const isProd = process.env.NODE_ENV === "production";

const port = 5000;

const app = express();

app.set("trust proxy", 1);

app.use(cors({
    origin: isProd ? process.env.FRONTEND_RENDER_URL : process.env.FRONTEND_LOCAL_URL,
    credentials: true,
}));

app.use(express.json());

app.use(passport.initialize());

app.use("/api/posts", postRouter);
app.use("/api/auth", userRouter);

app.listen(port, () => console.log(`Server running on port : ${port}`));