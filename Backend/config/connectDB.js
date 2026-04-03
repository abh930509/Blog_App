import mongoose  from "mongoose";
import dotenv from  'dotenv';
dotenv.config();

if(!process.env.MONGODB_URI){
    throw new Error('Please provide MONGODB_URI in .env file')

}

const connectDB =async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }

}

export default connectDB;