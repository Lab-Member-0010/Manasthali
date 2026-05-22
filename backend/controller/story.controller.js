import Story from '../model/story.model.js';

export const uploadStory = async (req, res) => {
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
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().populate("userId", "username profile_picture").exec();  
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 
export const getStoryByID = async (req, res) => {
  // Logic to fetch story details by ID
  try {
    const storyId = req.params.id;
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.status(200).json(story);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server " });
  }
};

// Get all stories posted by a user
export const getUserStories = async (req, res) => {
  try {
    const { userId } = req.params;
    const stories = await Story.find({ userId })
      .populate('userId', 'username profile_picture')
      .sort({ createdAt: -1 });
    return res.status(200).json(stories);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a story
export const deleteStory = async (req, res) => {
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
};


export const StoryLike = async (req, res, next) => {
  try {
    const StoryId = req.params.id;
    const userId = req.user._id;
    console.log("StoryId: ", StoryId);  
    const story = await Story.findById(StoryId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    console.log("Story: ", story);   
    if (!story.likes.some(l => l.toString() === userId.toString())) {
      story.likes.push(userId);
      await story.save();
      return res.status(200).json({ message: "Story liked successfully", story });
    } else {
      return res.status(400).json({ message: "You already liked this story" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const CommentStory = async (req, res, next) => {
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
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const viewStory = async (req, res, next) => {
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
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
