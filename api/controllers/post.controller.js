import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js"

export const create = async (req, res, next) => {
    // console.log(req.user);

    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to create a post"));
    }

    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, "All fields are required"));
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase();


    const newPost = new Post({
        ...req.body, slug, userId: req.user.id,
    });

    try {

        const savedPost = await newPost.save();
        return res.status(201).json(savedPost);

    } catch (error) {
        next(errorHandler(500, "Error creating post"));
    }

}

export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex || 0);
        const limit = parseInt(req.query.limit || 9);
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;


        // Create a query object first
        let query = {};

        // Add conditions to the query object
        if (req.query.userId) query.userId = req.query.userId;
        if (req.query.category) query.category = req.query.category;
        if (req.query.slug) query.slug = req.query.slug;
        if (req.query.postId) query._id = req.query.postId;
        if (req.query.searchTerm) {
            query.$or = [
                { title: { $regex: req.query.searchTerm, $options: "i" } },
                { content: { $regex: req.query.searchTerm, $options: "i" } },
            ];
        }

        // Execute the query with the properly formed query object

        const posts = await Post.find(query)
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts
        });
    } catch (error) {
        console.log(error);
        next(errorHandler(500, "Error getting posts"));
    }
}

export const deletepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id != req.params.userId) {
        return next(errorHandler(403, "You are not allowed to delete this post"));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId)
        res.status(200).json("The Post Deleted successfully");
    } catch (error) {
        next(errorHandler(500, "Error deleting post"));

    }
}

export const updatepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        next(errorHandler(403, 'You are not allowed to update this post'));
    }
    // console.log(req.params.postId);
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image,
                }
            }, { new: true });
        res.status(200).json(updatedPost);
    }
    catch (error) {
        // console.log(error);
        next(errorHandler(500, "Error while updating post"));
    }
}