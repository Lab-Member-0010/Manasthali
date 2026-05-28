import GroupMessage ,{Group} from '../model/group.model.js';
import asyncHandler from "../middleware/asyncHandler.js";
import logger from "../middleware/logger.js";

export const sendGroupMessage = asyncHandler(async (req, res) => {
  const { groupId, message } = req.body;

  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  if (!group.members.some(id => id.toString() === req.user._id.toString())) {
    return res.status(403).json({ message: "You are not a member of this group" });
  }

  const newMessage = await GroupMessage.create({
    sender: req.user._id,
    group: groupId,
    message,
  });
  res.status(201).json({ message: 'Message sent', data: newMessage });
});

export const getGroupMessages = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  if (!group.members.some(id => id.toString() === req.user._id.toString())) {
    return res.status(403).json({ message: "You are not a member of this group" });
  }

  const messages = await GroupMessage.find({ group: groupId })
    .populate('sender', 'username profile_picture')
    .sort({ createdAt: 1 });

  res.status(200).json({ data: messages });
});

export const markGroupMessageAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.body;

  const message = await GroupMessage.findById(messageId);
  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }

  if (message.readBy.some(id => id.toString() === req.user._id.toString())) {
    return res.status(400).json({ message: "You have already marked this message as read." });
  }

  message.readBy.push(req.user._id);
  await message.save();
  res.status(200).json({ message: 'Message marked as read' });
});
