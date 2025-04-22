import express from 'express';
import { createComment, getPostComments } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { likeComment } from '../controllers/comment.controller.js';
import { editComment } from '../controllers/comment.controller.js';
const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get('/getPostComments/:postId', getPostComments);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/editComment/:commentId', verifyToken, editComment);

export default router;