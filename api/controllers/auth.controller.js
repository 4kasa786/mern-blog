import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js"

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return next(errorHandler(400, "All fields are required"));
    }

    //check if user already exists
    let checkUser = await User.findOne({ email });

    if (checkUser) {
        return next(errorHandler(400, "User already exists"));
    }
    checkUser = await User.findOne({ username });
    if (checkUser) {
        return next(errorHandler(400, "User already exists"));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        return res.json({ message: "User signup successfull" });
    } catch (err) {
        next(err);
    }

}