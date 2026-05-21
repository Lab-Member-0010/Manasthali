import express from "express";
import { MentalCoach } from "../controller/mentalCoach.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/ask", auth, MentalCoach);

export default router;