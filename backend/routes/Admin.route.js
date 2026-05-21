import express from "express";
import { AdminLogin, AdminSignUp } from "../controller/Admin.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Admin signUp must be authenticated to prevent anyone from creating an admin account
router.post("/signUp", auth, AdminSignUp);
router.post("/login", AdminLogin);

export default router;