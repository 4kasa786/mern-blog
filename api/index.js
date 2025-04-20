import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import cookieParser from 'cookie-parser'
import commentRoutes from './routes/comment.route.js'



dotenv.config()

const app = express();
mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB")
})
    .catch((err) => {
        console.log("Error connecting to MongoDB:", err);
    })
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);


app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false, //this is telling the client that the request was not successful
        statusCode,
        message,
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})