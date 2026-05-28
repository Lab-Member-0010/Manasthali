import Post from '../model/post.model.js';
import Community from '../model/community.model.js'
import { User } from "../model/user.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import logger from "../middleware/logger.js";

//Create a new post
export const createPost = asyncHandler(async (request, response, next) => {
  try {
    let { description } = request.body;
    const userId = request.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    const community = await Community.findOne({ personality_type: user.personality_type });
    if (!community) {
      return response.status(400).json({ error: "Take the personality quiz first" });
    }
    const communityId = community._id;
    const media = request.files ? request.files.map((file) => file.location || file.path) : [];
    let newpost = new Post({ userId, description, media, communityId });
    let savepost = await newpost.save();

    // Return populated post so frontend can display it immediately
    const populatedPost = await Post.findById(savepost._id)
      .populate('userId', 'username profile_picture')
      .populate('likes', 'username profile_picture')
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: 'username profile_picture' }
      });

    return response.status(201).json({ message: "post created successfully", post: populatedPost });
  } catch (error) {
    logger.error(error);
    return response.status(500).json({ error: "Internal server error" });
  }
})

// Get post details
export const getPostDetails = asyncHandler(async (request, response, next) => {
  try {
    let { id } = request.params;
    let post = await Post.findById(id)
      .populate('userId', 'username profile_picture')
      .populate('likes', 'username profile_picture')
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: 'username profile_picture' }
      });

    if (!post) {
      return response.status(404).json({ error: "post not found" });
    }

    return response.status(200).json({ message: "post detail successfully fetched", post });
  }
  catch (error) {
    return response.status(500).json({ error: "internal server error" });
  }
})


// Update a post
export const updatePost = asyncHandler(async (request, response, next) => {
  // Logic to update a post
  try {
    const { id } = request.params;
    let updateData = request.body
    const PostById = await Post.findOne({ _id: id });
    if (!PostById) {
      return response.status(404).json({ error: "Post not found" });
    }

    const result = await Post.updateOne({ _id: id }, { $set: updateData });
    return response.status(200).json({ message: "Post updated successfully", result });
  } catch (error) {
    logger.error("Error updating post:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
});

// Delete a post
export const deletePost = asyncHandler(async (request, response, next) => {
  // Logic to delete a post
  try {
    const { id } = request.params;
    let postbyId = await Post.findOne({ _id: id });
    if (!postbyId) {
      return response.status(404).json({ error: "Post not found for delete" })
    }
    await Post.deleteOne({ _id: id });
    return response.status(200).json({ message: "Post deleted successfully" });

  }
  catch (error) {
    logger.error(error);
    return response.status(500).json({ error: "Intenal server error" })
  }
});

// Like Post 
export const likePost = asyncHandler(async (request, response) => {
  try {
    const { id } = request.params;
    const userId = request.user._id;
    const post = await Post.findById(id);

    if (!post) {
      return response.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    if (post.likes.some(likeId => likeId.toString() === userId.toString())) {
      return response.status(400).json({ message: "Already liked" });
    }

    post.likes.push(userId);
    await post.save();
    return response.status(200).json({ message: "Post liked", likes: post.likes, likeCount: post.likes.length });
  } catch (error) {
    logger.error(error);
    return response.status(500).json({ error: "Internal server error" });
  }
});

// Unlike post
export const unlikePost = asyncHandler(async (request, response) => {
  try {
    const { id } = request.params;
    const userId = request.user._id;
    const post = await Post.findById(id);

    if (!post) {
      return response.status(404).json({ error: "Post not found" });
    }

    if (!post.likes.some(likeId => likeId.toString() === userId.toString())) {
      return response.status(400).json({ message: "You haven't liked this post" });
    }
    post.likes = post.likes.filter(likeId => likeId.toString() !== userId.toString());
    await post.save();

    return response.status(200).json({ message: "Post unliked", likes: post.likes, likeCount: post.likes.length });
  } catch (error) {
    logger.error(error);
    return response.status(500).json({ error: "Internal server error" });
  }
});

//unlike post
export const getPostComments = asyncHandler(async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate('comments'); // Ensure the comments are populated

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ post });
  } catch (error) {
    logger.error("Error fetching post with comments:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Share a post
export const sharePost = asyncHandler(async (req, res) => {
  // Logic to share a post

  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const sharedPost = new Post({
      userId,
      media: post.media,
      description: post.description,
      tags: post.tags,
      communityId: post.communityId,
      location: post.location,
      shared_post_id: postId,
      likes: [],
    });

    await sharedPost.save();

    post.shares += 1;
    await post.save();

    res.status(201).json({ message: 'Post shared successfully', sharedPost });
  } catch (error) {
    res.status(500).json({ message: ' internal Server error' });
  }
});

// get all post excluding current user
export const getAllPosts = asyncHandler(async (req, res) => {
  try {
    const excludedId = req.params.id;
    const posts = await Post.find({ userId: { $ne: excludedId } })
      .populate('userId', 'username profile_picture')
      .populate('likes', 'username profile_picture')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'username profile_picture',
        }
      })
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(200).json({
        posts: [],
      });
    }

    return res.status(200).json({
      posts,
    });

  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Server error, could not retrieve posts",
    });
  }
});

// get post of all the community members with pagination
export const getCommunityPosts = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({ posts: [], hasMore: false });
    }
    const community = await Community.findOne({ personality_type: user.personality_type });
    if (!community) {
      return res.status(200).json({ posts: [], hasMore: false });
    }

    const totalPosts = await Post.countDocuments({ communityId: community._id });
    const hasMore = skip + limit < totalPosts;

    const posts = await Post.find({ communityId: community._id })
      .populate('userId', 'username profile_picture')
      .populate('likes', 'username profile_picture')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'username profile_picture',
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ posts, hasMore });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get user posts
export const getUserPosts = asyncHandler(async (req, res, next) => {
  try{
    const userId = req.params.id;
    const posts = await Post.find({ userId: userId })
      .populate('userId', 'username profile_picture')
      .populate('likes', 'username profile_picture')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'username profile_picture',
        }
      });
    res.status(200).json({posts});
  }catch(err){
    res.status(500).json({err});
  }
});
