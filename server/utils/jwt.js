import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = "1d"; // token expiration

export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
