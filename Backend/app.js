import express from 'express';

import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB.js';
import userRouter from './routes/userRoute.js';
import postRouter from './routes/postRoute.js';
import commentRouter from './routes/commentRoute.js';
import cors from 'cors';
import likeRouter from './routes/likesRoute.js';


const app  = express();


app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());





app.get('/',(req,res)=>{
    res.send('Api is running smoothly');
})
app.use('/api', userRouter);
app.use('/api',postRouter);
app.use('/api',commentRouter);
app.use("/api",likeRouter);

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server is running on port", PORT);
  });
});

