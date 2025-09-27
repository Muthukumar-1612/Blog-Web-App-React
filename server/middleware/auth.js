import { verifyToken } from "../utils/jwt.js";

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        req.user = verifyToken(token); // attach user to request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
