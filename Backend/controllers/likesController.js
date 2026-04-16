import { response } from "express";
import PostModel from "../models/postModel.js";

export async function ToggleLikeController(req,res) {
    try {
        
        const userId =req.userId;
        const {postId} = req.params;

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
                message:"Post not found",
                error:true,
                success:false
            })
        }

        const isAlreadyLiked = Post.Likes.includes(userId);
        console.log(isAlreadyLiked);
         
        if(isAlreadyLiked){
           Post.Likes.pull(userId);
        }else{
            Post.Likes.push(userId);
        }

        const updatedPost = await Post.save()

        return res.json({
            message:isAlreadyLiked ?"Post Unliked" :"Post Liked",
            error:false,
            success:true,
            data:{
                updatedPost,
                likes:updatedPost.Likes.length,
                 liked: !isAlreadyLiked,

            }
        })
        
        
    } catch (error) {
        return res.status(400).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }    
}


export async function GetLikesController(req,res) {
    try {
        const userId =req.userId;
        const {postId} = req.postId;

        if(!postId){
            return res.status(400).json({
                message:"Post id not found",
                error:true,
                success:false
            })
        }
       
        const Post =await PostModel.findById(postId);

        if(!Post){
            return res.status(400).json({
                message:"Post not found",
                error:true,
                success:false
            })
        }

         return json({
            message:"Likes fetched successfully.",
            error:false,
            success:true,
            data:{
                liked:Post.Likes.includes(userId),
                userId,
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





export async function getLikesController(req,res) {
    try {
        const {postId}= req.params;

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
                message:"Post not found",
                error:true,
                success:false
            })
        }

        return res.json({
            message:"Likes fetched Successfully.",
            error:false,
            success:true,
            data:{
                LikesCount: Post.Likes.length,
                
            }
        })
        
    } catch (error) {
        return res.status(400).json({
            message:error.message|| error,
            error:true,
            success:false,
        })
    }
}

export async function myLikedPosts(req,res) {
   try {
    const userId = req.userId;
     
    const AllLikedpost = await PostModel.find({Likes:userId})

    if(!AllLikedpost){
        return res.status({
            message:"No post Found",
            error:true,
            success:false
        })
    }

    return res.json({
        message:"All Liked Post Fetched successfully.",
        error:false,
        success:true,
        data:{
            likedpost:Allpost.length,
            AllLikedpost
        }
    })


   } catch (error) {
     return res.status(400).json({
        message:error.message || error,
        error:true,
        success:false
     })
   } 
}
