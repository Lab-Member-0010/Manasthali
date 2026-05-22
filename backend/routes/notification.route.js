import express from 'express';
import {
  sendNotification,
  getUserNotifications,
  markNotificationAsRead,
} from '../controller/notification.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Route to send a notification
router.post('/', auth, sendNotification);

// Route to fetch all notifications for a specific user
router.get('/:userId', auth, getUserNotifications);

// Route to mark a specific notification as read
router.patch('/:id/read', auth, markNotificationAsRead);

export default router;
