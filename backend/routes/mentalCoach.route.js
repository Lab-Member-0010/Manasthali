import { body } from "express-validator";
import express from "express";
import { MentalCoach } from "../controller/mentalCoach.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/ask", [body('question').notEmpty().withMessage('Question is required').trim().escape()], auth, MentalCoach);

export default router;