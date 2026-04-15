import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true

    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:[true,"Comment is required."]
    },
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
        default:null
        
    },
    replies:  [{ 
        type: mongoose.Schema.Types.ObjectId, ref: "Comment"
     }],

    likes:[{
         type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    
     isEdited: { type: Boolean, default: false },

},{
    timestamps:true
})

const commentModel = mongoose.model("Comment",commentSchema);
export default commentModel;