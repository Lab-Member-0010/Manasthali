import Story from '../model/story.model.js';
import asyncHandler from "../middleware/asyncHandler.js";
import logger from "../middleware/logger.js";

export const uploadStory = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { caption } = req.body;

    // Check if a file was uploaded
    // multer-s3 stores the public S3 URL in req.file.location;
    // multer-cloudinary stores it in req.file.path
    const media = req.file ? (req.file.location || req.file.path) : null;

    if (!media) {
      return res.status(400).json({ error: "Media file is required" });
    }

    // Create and save the story
    const story = new Story({ userId, media, caption });
    const newStory = await story.save();

    // Return populated story
    const populatedStory = await Story.findById(newStory._id)
      .populate('userId', 'username profile_picture');

    res.status(200).json(populatedStory);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
export const getAllStories = asyncHandler(async (req, res) => {
  try {
    // Only return stories created within the last 24 hours
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const stories = await Story.find({ createdAt: { $gte: cutoff } })
      .populate("userId", "username profile_picture")
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

 
export const getStoryByID = asyncHandler(async (req, res) => {
  // Logic to fetch story details by ID
  try {
    const storyId = req.params.id;
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.status(200).json(story);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "internal server " });
  }
});

// Get all stories posted by a user
export const getUserStories = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    // Only return stories from the last 24 hours
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const stories = await Story.find({ userId, createdAt: { $gte: cutoff } })
      .populate('userId', 'username profile_picture')
      .sort({ createdAt: -1 });
    return res.status(200).json(stories);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a story
export const deleteStory = asyncHandler(async (req, res) => {
  // Logic to delete a story
  try {
    const deletedStory = await Story.findByIdAndDelete(req.params.id);

    if (!deletedStory) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export const StoryLike = asyncHandler(async (req, res, next) => {
  try {
    const StoryId = req.params.id;
    const userId = req.user._id;
    logger.info("StoryId: ", StoryId);  
    const story = await Story.findById(StoryId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    logger.info("Story: ", story);   
    if (!story.likes.some(l => l.toString() === userId.toString())) {
      story.likes.push(userId);
      await story.save();
      return res.status(200).json({ message: "Story liked successfully", story });
    } else {
      return res.status(400).json({ message: "You already liked this story" });
    }

  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const CommentStory = asyncHandler(async (req, res, next) => {
  try {
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
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export const viewStory = asyncHandler(async (req, res, next) => {
  try {
    const StoryId = req.params.id;
    // userId should come from the authenticated user, not the URL param
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
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
