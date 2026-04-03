import commentModel from "../models/comments";
import PostModel from "../models/postModel";

export async function createCommentController(req,res) {
    try {
        const userId =req.userId;
        const {postId} =req.params;
        

        if(!userId){
            return res.status(400).json({
                message:"User id not found",
                error:true,
                success:false
            })
        }

        if(!postId){
            return res.status(400).json({
                message:"Post id is not found",
                error:true,
                success:false
            })
        }

        const Post = await PostModel.findById(postId);

        if(!Post){
            return res.status(400).json({
                message:"Post not found.",
                error:true,
                success:false
            })
        }
         
        const {text} =req.body;

        if(!text){
            return res.status(400).json({
                message:"Comment is Required",
                error:true,
                success:false
            })
        } 
        const payload ={
            userId,
            author:userId,
            text
        }

        const newComment = new commentModel(payload);
        const savedcomment = await  newComment.save();

        Post.Comments.push(savedcomment._id);
        const savedPost = await Post.save();

         return res.json({
            message:'Comment Successfully Created',
            error:false,
            success:true,
            data:{
                savedcomment,
                savedPost

            }
         })



    } catch (error) {
         return res.status(400).json({
            message:error.message||error,
            error:true,
            success:false
         })
        
    }
}

// get all comments

// update comments


//delete comments