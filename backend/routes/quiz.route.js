import { body } from "express-validator";
import express from 'express';
import { submitQuiz} from '../controller/quiz.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// submit quiz result
router.post('/submit', [body('answers').isArray({ min: 32, max: 32 }).withMessage('Exactly 32 answers required')], auth, submitQuiz);

export default router;