import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    // console.log(token);
    // console.log(token);
    if (!token) {
        return next(errorHandler(401, "Unauthorized!"));

    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // console.log(err);
            return next(errorHandler(401, "Token is not valid!"));
        }
        req.user = user;
        next();
    })
}