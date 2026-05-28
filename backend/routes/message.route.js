import { body } from "express-validator";
import express from 'express';
import {
  sendMessage,
  getMessages,
  markAsRead,
} from '../controller/message.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Send message
router.post('/send', [body('message').notEmpty().withMessage('Message is required').trim().escape(), body('receiverId').notEmpty()], auth, sendMessage);

// Get messages between two users
router.get('/:receiverId', auth, getMessages);

// Mark message as read
router.post('/read', auth, markAsRead);

export default router;