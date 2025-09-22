import { Pool } from "pg";
import env from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

env.config({ path: path.join(__dirname, ".env") });

const isProd = process.env.NODE_ENV === "production";
// console.log("DB URL used:", isProd ? process.env.NEON_DB_URL : process.env.LOCAL_DB_URL);
export const db = new Pool({
    connectionString: isProd ? process.env.NEON_DB_URL : process.env.LOCAL_DB_URL,
    ssl: isProd ? {
        rejectUnauthorized: false,
        sslmode: 'require'
    } : false
});