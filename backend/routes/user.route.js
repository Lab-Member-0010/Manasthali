import express from "express";
import {
  SignUp,
  SignIn,
  getUserById,
  updateUserById,
  contactUpdateById,
  DobUpdateById,
  genderUpdate,
  bioUpdateById,
  deleteUserById,
  getUserFollowers,
  getUserFollowing,
  followUser,
  unfollowUser,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getAllUsersExceptOne,
  getDMList,
  getCommunityUsers
} from "../controller/user.controller.js";
import { body } from "express-validator";
import { auth } from "../middleware/auth.js";
import upload from '../middleware/uploadsdb.js';

const router = express.Router();

// ── Auth (no token required) ─────────────────────────────────────────────────

router.post(
  "/register",
  body("username", "Username is required").notEmpty(),
  body("email", "Invalid email ID").isEmail(),
  body("email", "Email ID is required").notEmpty(),
  body("password", "Password is required").notEmpty(),
  SignUp
);

router.post(
  "/verify-otp",
  body("email", "Invalid email ID").isEmail(),
  body("otp", "OTP is required").notEmpty(),
  verifyOtp
);

router.post("/login", SignIn);

router.post(
  "/forgot-password",
  body("email", "Invalid email ID").isEmail(),
  forgotPassword
);

router.post(
  "/reset-password",
  body("token", "Token is required").notEmpty(),
  body("newPassword", "New password is required").notEmpty(),
  resetPassword
);

// ── Specific named GET routes BEFORE the wildcard /:id ───────────────────────
// IMPORTANT: Express matches routes top-to-bottom.
// All specific paths must be declared before the /:id wildcard.

router.get("/get-community-users/:id", auth, getCommunityUsers);
router.get("/get-all-users-except/:id", auth, getAllUsersExceptOne);
router.get("/dmlist/:id", auth, getDMList);

// ── Specific named POST routes ────────────────────────────────────────────────

router.post("/follow", auth, followUser);
router.post("/unfollow", auth, unfollowUser);

// ── Wildcard /:id routes (MUST come after all specific named routes) ──────────

router.get("/:id", auth, getUserById);
router.get("/:id/followers", auth, getUserFollowers);
router.get("/:id/following", auth, getUserFollowing);

router.put("/:id", auth, upload.single("profile_picture"), updateUserById);
router.put("/:id/contact", auth, contactUpdateById);
router.put("/:id/dob", auth, DobUpdateById);
router.put("/:id/gender", auth, genderUpdate);
router.put("/:id/bio", auth, bioUpdateById);
router.put("/:id/updateProfilePicture", auth, upload.single("profile_picture"), updateUserById);

router.delete("/:id/delete", auth, deleteUserById);

export default router;
