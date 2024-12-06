import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import db from '../models/index.js';
import { validateUser } from '../validators/user.validator.js';

const { User, Session } = db;

// Register a new user
export const register = async (req, res) => {
    try {
        // Validate input using Zod
        const validatedData = validateUser(req.body);

        // Hash the password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Create user
        const user = await User.create({
            username: validatedData.username,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        if (error.message.startsWith('[')) {
            // If validation error
            return res.status(400).json({ error: 'Validation failed', details: JSON.parse(error.message) });
        }
        res.status(500).json({ error: 'Error registering user', details: error.message });
    }
};

// Login a user
export const login = async (req, res) => {
    try {
        // Validate input using Zod
        const validatedData = validateUser(req.body);

        // Find user
        const user = await User.findOne({ where: { username: validatedData.username } });
        if (!user || !(await bcrypt.compare(validatedData.password, user.password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Create session
        const sessionId = uuid();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry
        await Session.create({ id: sessionId, userId: user.id, expiresAt });

        // Set session cookie
        res.set('Set-Cookie', `session=${sessionId}; HttpOnly; Path=/`);
        res.json({ message: 'Login successful' });
    } catch (error) {
        if (error.message.startsWith('[')) {
            // If validation error
            return res.status(400).json({ error: 'Validation failed', details: JSON.parse(error.message) });
        }
        res.status(500).json({ error: 'Error during login', details: error.message });
    }
};

// Logout a user
export const logout = async (req, res) => {
    try {
        res.set(
            'Set-Cookie',
            'session=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
        );
        res.json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: 'Error during logout', details: error.message });
    }
};
