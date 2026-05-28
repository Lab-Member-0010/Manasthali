import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
    },
    contact: {
      type: String,
      required:false,
    },
    dob: {
      type: Date,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    profile_picture: {
      type: String,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    gender: {
      type: String,
      required: false,
    },
    country: {
      type: String,
    },
    age: {
      type: Number,
    },
    personality_type: {
      type: String
    },
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge",
      },
    ],
   
    isActive: {
      type: Boolean,
      default: true,
    },
    verified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date }
  },
  {
    timestamps: true,
  }
);

userSchema.index({ personality_type: 1 });

export const User = mongoose.model("User", userSchema);