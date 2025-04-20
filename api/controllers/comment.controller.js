import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;
        // console.log(content, postId, userId);
        if (userId !== req.user.id) {
            return next(errorHandler(403, "You are not allowed to create the comment"));
        }

        const newComment = new Comment({
            content, postId, userId
        })

        await newComment.save();
        res.status(200).json(newComment);
    }
    catch (error) {
        console.log(error.message);
        next(error);
    }
}