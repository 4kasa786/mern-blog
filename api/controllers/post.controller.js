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