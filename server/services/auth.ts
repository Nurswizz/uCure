import jwt from 'jsonwebtoken';
import { storage } from '../storage';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';

// Register using username (since storage.ts uses username, not email)
export async function register(username: string, password: string) {
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
        return { success: false, message: 'User already exists' };
    }
    const user = await storage.createUser({ username, password });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { user, token, message: "User created successfully", success: true };
}

// Login using username
export async function login(username: string, password: string) {
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
        return { success: false, message: 'Invalid credentials' };
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { user, token, message: "User signed in successfully", success: true };
}