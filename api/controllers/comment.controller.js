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

export const getPostComments = async (req, res, next) => {

    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({
            createdAt: -1,
        });

        res.status(200).json(comments);
    }
    catch (error) {
        next(error);
    }

}

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, "Comment not found"));
        }

        const userIndex = comment.likes.indexOf(req.user.id);
        if (userIndex === -1) {
            comment.numberOfLikes++;
            comment.likes.push(req.user.id);
        }
        else {
            comment.numberOfLikes--;
            comment.likes.splice(userIndex, 1);
        }
        await comment.save();
        return res.status(200).json(comment);

    }
    catch (error) {
        next(errorHandler(500, "Error while liking the comment"));
    }
}

export const editComment = async (req, res, next) => {
    // console.log(req.params.commentId);
    try {
        const comment = await Comment.findById(req.params.commentId);
        // console.log(comment);

        if (!comment) {
            return next(errorHandler(404, "Comment not found"));
        }

        if (comment.userId !== req.user && !req.user.isAdmin) {
            return next(errorHandler(403, "You are not allowed to edit this comment"));
        }

        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId,
            {
                content: req.body.content,
            }, { new: true }
        )

        res.status(200).json(editedComment);

    } catch (error) {
        next(errorHandler(500, "Error while editing the comment"));
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }

        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to delete this comment'));
        }

        await Comment.findByIdAndDelete(req.params.commentId);

        res.status(200).json({ message: "Comment deleted successfully" });

    } catch (error) {
        next(errorHandler(500, "Error while deleting the comment"));
    }
}

export const getComments = async (req, res, next) => {

    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to get all the comments"));
    }
    // console.log(req.user);
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;
        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);
        // console.log(comments);

        const totalComments = await Comment.countDocuments();
        // console.log(totalComments);
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthComments = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } });
        res.status(200).json({
            comments,
            totalComments,
            lastMonthComments
        });

    } catch (error) {
        console.log(error);
        next(errorHandler(500, "Error while getting the comments"));
    }
}