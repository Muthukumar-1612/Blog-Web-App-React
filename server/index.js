import express from "express";
import cors from "cors"
import postRouter from "./routes/crud.js"

const port = 5000;

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/posts", postRouter);

app.listen(port, () => console.log(`Server running on port : ${port}`));
