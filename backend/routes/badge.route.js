import express from 'express';
import { getUserBadges, getTodayBadge } from '../controller/badge.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/badges-all/:userId', auth, getUserBadges);
router.get('/badge-today/:userId', auth, getTodayBadge);

export default router;