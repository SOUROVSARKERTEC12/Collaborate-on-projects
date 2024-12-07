import express from 'express';

import { authenticateSession } from '../middlewares/auth.middleware.js';
import {authRoute} from "./auth.routes.js";

const router = express.Router();

// Auth routes (e.g., login and logout)
router.use('/auth', authRoute);

router.use(authenticateSession)

// Protected route: Homepage
router.get('/home', (req, res) => {
    res.json({ message: `Welcome to the homepage, ${req.user.username}!` });
});

export default router;
