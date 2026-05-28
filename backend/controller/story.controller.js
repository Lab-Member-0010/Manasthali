import Story from '../model/story.model.js';
import asyncHandler from "../middleware/asyncHandler.js";
import logger from "../middleware/logger.js";

export const uploadStory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { caption } = req.body;

  const media = req.file ? (req.file.location || req.file.path) : null;

  if (!media) {
    return res.status(400).json({ error: "Media file is required" });
  }

  const story = new Story({ userId, media, caption });
  const newStory = await story.save();

  const populatedStory = await Story.findById(newStory._id)
    .populate('userId', 'username profile_picture');

  res.status(200).json(populatedStory);
});
export const getAllStories = asyncHandler(async (req, res) => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const stories = await Story.find({ createdAt: { $gte: cutoff } })
    .populate("userId", "username profile_picture")
    .sort({ createdAt: -1 })
    .exec();
  res.status(200).json(stories);
});

 
export const getStoryByID = asyncHandler(async (req, res) => {
  const storyId = req.params.id;
  const story = await Story.findById(storyId);
  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }
  res.status(200).json(story);
});

// Get all stories posted by a user
export const getUserStories = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const stories = await Story.find({ userId, createdAt: { $gte: cutoff } })
    .populate('userId', 'username profile_picture')
    .sort({ createdAt: -1 });
  return res.status(200).json(stories);
});

// Delete a story
export const deleteStory = asyncHandler(async (req, res) => {
  const deletedStory = await Story.findByIdAndDelete(req.params.id);

  if (!deletedStory) {
    return res.status(404).json({ message: "Story not found" });
  }

  res.status(200).json({ message: "Story deleted successfully" });
});


export const StoryLike = asyncHandler(async (req, res, next) => {
  const StoryId = req.params.id;
  const userId = req.user._id;
  const story = await Story.findById(StoryId);
  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }
  if (!story.likes.some(l => l.toString() === userId.toString())) {
    story.likes.push(userId);
    await story.save();
    return res.status(200).json({ message: "Story liked successfully", story });
  } else {
    return res.status(400).json({ message: "You already liked this story" });
  }
});

export const CommentStory = asyncHandler(async (req, res, next) => {
  const StoryId = req.params.id;
  const { text } = req.body;
  const userId = req.user._id;
  const story = await Story.findById(StoryId);
  if (!story) {
    return res.status(404).json({ message: "story not found" });
  }
  story.comments.push({ userId, text });
  await story.save();
  res.status(200).json({ message: "comment add succesfuly" });
});


export const viewStory = asyncHandler(async (req, res, next) => {
  const StoryId = req.params.id;
  const userId = req.user?._id || req.body.userId;
  const story = await Story.findById(StoryId);

  if (!story) {
    return res.status(404).json({ message: "story not found" });
  }
  if (userId && !story.views.includes(userId)) {
    story.views.push(userId);
    await story.save();
  }
  res.status(200).json({
    message: "View recorded successfully",
    totalViews: story.views.length,
    viewers: story.views
  });
});
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
