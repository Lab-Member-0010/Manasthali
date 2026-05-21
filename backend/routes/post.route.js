import express from 'express';
import upload from '../middleware/uploadsdb.js';
import { auth } from '../middleware/auth.js';

import { createPost, getPostDetails, updatePost, deletePost, likePost, unlikePost, getPostComments, sharePost, getAllPosts, getCommunityPosts, getUserPosts } from '../controller/post.controller.js';

const router = express.Router();

router.post('/', auth, upload.array('media', 5), createPost);
router.get('/all-posts/:id', auth, getAllPosts);
router.get('/getCommunityPosts/:id', auth, getCommunityPosts);
router.get('/getUserPosts/:id', auth, getUserPosts);
router.get('/:id', auth, getPostDetails);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, likePost);
router.post('/:id/unlike', auth, unlikePost);
router.get('/:id/comments', auth, getPostComments);
router.post('/:id/share', auth, sharePost);

export default router;