import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const test = (req, res) => {
    res.json({ message: "This is from the test route" })
}

export const updateUser = async (req, res, next) => {
    // console.log(req.user);
    // console.log(req.body);
    // console.log(req.params.username);
    if (req.user.id != req.params.userId) {
        return next(errorHandler(403, "You are not allowed to update this user"));
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, "Password must be at least 6 characters long"));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {

        if (req.body.username.length < 3 || req.body.username.length > 20) {
            return next(errorHandler(400, "Username must be at least 3 characters long and at most 20 characters long"));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase'));
        }
        if (req.body.username.includes(" ")) {
            return next(errorHandler(400, "Username cannot contain spaces"));
        }

        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, "Username can only contain letter and numbers"));
        }

    }
    try {

        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
            },
        }, { new: true });
        const { password, ...rest } = updatedUser._doc;
        // return res.send("User updated successfully");
        return res.status(200).json(rest);
    }
    catch (error) {
        next(errorHandler(500, "Error updating user"));

    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id != req.params.userId) {
        return next(errorHandler(403, "You are not allowed to delete this user"));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User deleted successfully");
    } catch (error) {
        next(errorHandler(500, "Error deleting user"));
    }
}