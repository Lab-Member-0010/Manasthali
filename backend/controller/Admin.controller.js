import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../model/Admin.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import logger from "../middleware/logger.js";

export const AdminSignUp = asyncHandler(async (request, response, next) => {
  const { username, token } = request.body;
  const saltKey = bcrypt.genSaltSync(10);
  const hashedToken = bcrypt.hashSync(token, saltKey);
  const admin = new Admin({ username, token: hashedToken });
  await admin.save();
  return response.status(201).json({ message: "Admin created successfully." });
});

export const AdminLogin = asyncHandler(async (request, response, next) => {
  const { username, token } = request.body;
  const admin = await Admin.findOne({ username });
  if (!admin) {
    return response.status(404).json({ error: "Admin not found" });
  }
  const valid = bcrypt.compareSync(token, admin.token);
  if (valid) {
    const jwtToken = jwt.sign({ payload: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return response.status(200).json({ message: "Admin Login success.", token: jwtToken });
  } else {
    return response.status(401).json({ error: "Token Invalid" });
  }
});
