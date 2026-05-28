import express from "express";
import mongoose from "mongoose";
import http from 'http';
import { Server } from 'socket.io';
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from "helmet";
import logger from "./middleware/logger.js";

import adminRouter from "./routes/Admin.route.js";
import badgeRouter from "./routes/badge.route.js";
import commentRouter from "./routes/comment.route.js";
import communityRouter from "./routes/community.route.js";
import groupRouter from "./routes/group.route.js";
import groupmessageRouter from "./routes/groupmessage.route.js";
import mentalCoachRouter from "./routes/mentalCoach.route.js";
import messageRouter from "./routes/message.route.js";
import notificationRouter from "./routes/notification.route.js";
import postRouter from "./routes/post.route.js";
import quizRouter from "./routes/quiz.route.js";
import storyRouter from "./routes/story.route.js";
import userRouter from "./routes/user.route.js";
import challengesRoute from "./routes/challengesFile.route.js";
import googleAuthRouter from "./routes/googleauth.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
  },
}));

app.use((req, res, next) => {
  if (req.get('X-Forwarded-Proto') === 'http' || req.get('X-Forwarded-Proto') === 'http, http') {
    return res.redirect(301, `https://${req.get('Host')}${req.url}`);
  }
  next();
});

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/users/register', authLimiter);
app.use('/users/login', authLimiter);
app.use('/users/forgot-password', authLimiter);
app.use('/users/reset-password', authLimiter);
app.use('/users/verify-otp', authLimiter);
app.use('/posts', apiLimiter);
app.use('/comments', apiLimiter);
app.use('/story', apiLimiter);
app.use('/message', apiLimiter);
app.use('/groupchat', apiLimiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/admin", adminRouter);
app.use("/comments", commentRouter);
app.use("/communities", communityRouter);
app.use("/groups", groupRouter);
app.use("/groupchat", groupmessageRouter);
app.use("/mental-coach", mentalCoachRouter);
app.use("/message", messageRouter);
app.use("/notifications", notificationRouter);
app.use("/posts", postRouter);
app.use("/quiz", quizRouter);
app.use("/story", storyRouter);
app.use("/badges", badgeRouter);
app.use("/users", userRouter);
app.use("/challenge", challengesRoute);
app.use("/auth", googleAuthRouter);

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error("Unhandled error:", { message: err.message, stack: err.stack });
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ─── Socket.IO ───────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  logger.info('A user connected:', socket.id);

  // ── DM chat: user joins a private room keyed by their own userId ──────────
  // Frontend: socket.emit('join', userId)
  socket.on('join', (userId) => {
    if (!userId) return;
    socket.join(userId.toString());
    logger.info(`User ${userId} joined their private room`);
  });

  // ── Group chat: join a group room ─────────────────────────────────────────
  // Frontend: socket.emit('join_group', groupId)
  socket.on('join_group', (groupId) => {
    if (!groupId) return;
    socket.join(groupId.toString());
    logger.info(`Socket ${socket.id} joined group room: ${groupId}`);
  });

  // ── Group chat: leave a group room ────────────────────────────────────────
  // Frontend: socket.emit('leave_group', groupId)
  socket.on('leave_group', (groupId) => {
    if (!groupId) return;
    socket.leave(groupId.toString());
    logger.info(`Socket ${socket.id} left group room: ${groupId}`);
  });

  // ── DM: relay saved message to receiver's private room ───────────────────
  // Frontend: socket.emit('send_message', savedMessageObject)
  // The saved message has { sender, receiver, message, _id, createdAt, read }
  socket.on('send_message', (messageData) => {
    try {
      if (!messageData) throw new Error('No message data provided');
      const receiverId = messageData.receiver?.toString() || messageData.receiverId?.toString();
      if (!receiverId) throw new Error('receiver field missing');
      // Emit only to the receiver's room (excludes the sender's socket)
      socket.to(receiverId).emit('new_message', messageData);
    } catch (err) {
      logger.error('Error relaying DM:', err.message);
    }
  });

  // ── Group chat: broadcast saved message to group room ────────────────────
  // Frontend: socket.emit('send_group_message', savedMessageObject)
  // The saved message has { sender, group, message, _id, createdAt }
  socket.on('send_group_message', (messageData) => {
    try {
      if (!messageData) throw new Error('No message data provided');
      const groupId = (messageData.group || messageData.groupId)?.toString();
      if (!groupId) throw new Error('group/groupId field missing');
      // Broadcast to all other members of the group room (excludes sender)
      socket.to(groupId).emit('new_group_message', messageData);
    } catch (err) {
      logger.error('Error relaying group message:', err.message);
    }
  });

  socket.on('disconnect', () => {
    logger.info('A user disconnected:', socket.id);
  });
});

// ─── Start server after DB connects ──────────────────────────────────────────
mongoose.connect(process.env.DB_URI)
  .then(() => {
    logger.info("Database connected...");
    const port = process.env.PORT || 3001;
    server.listen(port, () => {
      logger.info(`Server started on port ${port}...`);
    });
  })
  .catch(err => {
    logger.error("Database connection error:", err);
    process.exit(1);
  });
