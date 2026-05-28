import Comment from "../model/comment.model.js";
import Post from "../model/post.model.js";
import { User } from "../model/user.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import logger from "../middleware/logger.js";

export const addComment = asyncHandler(async (request, response, next) => {
  const { comment, parent_comment_id } = request.body;
  const post_id = request.params.postId;
  const userId = request.user._id;
  const newComment = new Comment({
    post_id,
    userId,
    comment,
    parent_comment_id: parent_comment_id || null,
  });
  await newComment.save();

  const post = await Post.findById(post_id);
  if (post) {
    post.comments.push(newComment._id);
    await post.save();
  }

  const populated = await Comment.findById(newComment._id).populate('userId', 'username profile_picture');

  response.status(201).json({ message: "Comment added successfully", comment: populated });
});

export const getCommentDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findOne({ _id: id }).populate("userId");

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  res.status(200).json({ message: "comment fetch successfully", comment });
});

export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updateData = req.body;

  const commentById = await Comment.findOne({ _id: id });
  if (!commentById) {
    return res.status(404).json({ error: "comment not found" });
  }

  const result = await Comment.updateOne({ _id: id }, { $set: updateData });
  return res
    .status(200)
    .json({ message: "comment updated successfully", result });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const post = await Post.findById(comment.post_id);
  if (post) {
    post.comments = post.comments.filter(cId => cId.toString() !== id);
    await post.save();
  }

  await Comment.deleteOne({ _id: id });

  res.status(200).json({ message: "Comment deleted successfully" });
});

export const likeComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user_id = req.user._id;

  const comment = await Comment.findOne({ _id: id });
  const user = await User.findOne({ _id: user_id });

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!comment.comment_likes.some(l => l.toString() === user_id.toString())) {
    comment.comment_likes.push(user_id);
    await comment.save();
  } else {
    return res
      .status(400)
      .json({ message: "User already liked this comment" });
  }

  res.status(200).json({ message: "Comment liked successfully", comment });
});
