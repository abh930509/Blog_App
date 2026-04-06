import express from 'express';

import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB.js';
import userRouter from './routes/userRoute.js';
import postRouter from './routes/postRoute.js';
import cors from 'cors';


const app  = express();


app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());





app.get('/',(req,res)=>{
    res.send('Api is running smoothly');
})
app.use('/api/users', userRouter);
app.use('/api/users',postRouter);

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running on port", PORT);
});

