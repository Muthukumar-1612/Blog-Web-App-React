import express from "express";
import { db } from "../db.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
// Generate date string
const date = new Date();
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = String(date.getDate()).padStart(2, "0");
const formatted = `${months[date.getMonth()]}-${day}-${date.getFullYear()}`;

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "blog_v2",
        allowed_formats: ["jpg", "jpeg", "png"],
        public_id: `blog_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
        resource_type: "image"
    }),
    transformation: [
        { width: 800, height: 600, crop: "fill", gravity: "auto" }
    ]
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        const ext = file.originalname.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png'].includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPG, JPEG, and PNG are allowed!'));
        }
    }
});

// Middleware to handle file size and type errors
function handleUpload(req, res, next) {
    upload.single("image")(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).send('File size should be less than or equal to 10 MB.');
            }
            return res.status(400).send(err.message);
        }
        next();
    });
}

// Home page
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM blogs_v2 ORDER BY id`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database query failed" });
    }
});

// Create post
router.post('/submit', handleUpload, async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).send("Title and description are required.");
        }

        const imagePath = req.file ? req.file.path : "https://via.placeholder.com/400";
        const result = await db.query(`
            INSERT INTO blogs_v2 (title, description, mondate, image)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [title, description, formatted, imagePath]);

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Update post
router.patch("/update/:id", handleUpload, async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description } = req.body;
        const imagePath = req.file ? req.file.path : null;

        const result = await db.query(`
            UPDATE blogs_v2 
            SET title = $1, description = $2, mondate = $3, image = COALESCE($4, image)
            WHERE id = $5
            RETURNING *
        `, [title, description, `Edited ${formatted}`, imagePath, id]);

        res.json(result.rows[0]);
    } catch (err) {
        console.error("❌ Update Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Delete post
router.delete("/delete/:id", async (req, res) => {
    try {
        await db.query(`
            DELETE FROM blogs_v2 
            WHERE id = $1 
            RETURNING *;
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
    } catch (err) {
        console.error("❌ Delete Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;