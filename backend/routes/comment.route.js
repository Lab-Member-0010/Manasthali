import { body } from "express-validator";
import express from 'express';
import  {auth} from "../middleware/auth.js"
import { addComment, getCommentDetails, updateComment, deleteComment, likeComment } from '../controller/comment.controller.js';
const router = express.Router();

router.post('/addComment/:postId', [body('comment').notEmpty().withMessage('Comment is required').trim().escape()], auth, addComment);
router.get('/:id', auth, getCommentDetails);
router.put('/:id', auth, updateComment);
router.delete('/:id', auth, deleteComment);
router.post('/:id/like', auth, likeComment);

export default router;