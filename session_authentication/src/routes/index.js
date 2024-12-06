import express from 'express';
import authRoutes from './auth.routes.js';
import { authenticateSession } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Auth routes (e.g., login and logout)
router.use('/auth', authRoutes);

// Protected route: Homepage
router.get('/home', authenticateSession, (req, res) => {
    res.json({ message: `Welcome to the homepage, ${req.user.username}!` });
});

export default router;
