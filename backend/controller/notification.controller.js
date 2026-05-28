import Notification from '../model/notification.model.js';
import asyncHandler from "../middleware/asyncHandler.js";
import logger from "../middleware/logger.js";

export const sendNotification = asyncHandler(async (req, res, next) => {
  const { receiver_id, notification_type, sender_id } = req.body;
  const notification = new Notification({
    receiver_id, notification_type, sender_id,
  });
  await notification.save();
  res.status(201).json(notification);
})

export const getUserNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  const notifications = await Notification.find({ receiver_id: userId })
    .populate('sender_id', 'username profile_picture')
    .sort({ createdAt: -1 });
  res.status(200).json(notifications);
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findById(id);
  if (!notification) {
    return res.status(400).json({ message: "notification not found" });
  }
  notification.read_status = true;
  await notification.save();
  res.status(200).json({ message: 'Notification marked as read', notification });
});
