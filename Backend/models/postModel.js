import mongoose  from "mongoose";

const Post = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'please provide title']
    },
    content:{
        type:String,
        required:[true,'please provide content']
    },
     images:[
    {
      url:{
        type:String
      },
      public_id:{
        type:String
      }
    }
  ],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,'please provide author']
    },
    Likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
   
    Comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    
},{
    timestamps:true
})

const PostModel = mongoose.model('Post',Post);
export default PostModel;
