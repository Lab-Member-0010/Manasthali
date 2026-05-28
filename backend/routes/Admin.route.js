import { body } from "express-validator";
import express from "express";
import { AdminLogin, AdminSignUp } from "../controller/Admin.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Admin signUp must be authenticated to prevent anyone from creating an admin account
router.post("/signUp", [body('username').notEmpty().trim().escape(), body('token').notEmpty()], auth, AdminSignUp);
router.post("/login", [body('username').notEmpty().trim().escape(), body('token').notEmpty()], AdminLogin);

export default router;