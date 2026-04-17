import commentModel from "../models/comments.js";
import PostModel from "../models/postModel.js";

export async function createCommentController(req, res) {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "User id not found",
        error: true,
        success: false,
      });
    }

    if (!postId) {
      return res.status(400).json({
        message: "Post id is not found",
        error: true,
        success: false,
      });
    }

    const Post = await PostModel.findById(postId);

    if (!Post) {
      return res.status(400).json({
        message: "Post not found.",
        error: true,
        success: false,
      });
    }

    const { text, parentId } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Comment is Required",
        error: true,
        success: false,
      });
    }

    if (parentId) {
      const parentComment = await commentModel.findById(parentId);
      if (!parentComment) {
        return res.status(400).json({
          message: "Parent comment is not found.",
          error: true,
          success: false,
        });
      }
    }

    const payload = {
      postId,
      author: userId,
      text,
      parentId: parentId || null,
    };

    const newComment = new commentModel(payload);
    const savedcomment = await newComment.save();

    if (parentId) {
      await commentModel.findByIdAndUpdate(parentId, {
        $push: { replies: savedcomment._id },
      });
    } else {
      Post.Comments.push(savedcomment._id);
      await Post.save();
    }
   const populatedComment = await savedcomment.populate("author","name email profilePic");

    return res.json({
      message: "Comment Successfully Created",
      error: false,
      success: true,
      data: {
        savedcomment,
        populatedComment
      },
    });


  } catch (error) {
    return res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// get all comments

export async function getAllComment(req,res) {
    try {
        const {postId}= req.params;
        
        if(!postId){
            return res.status(400).json({
                message:"Post Id is not found",
                error:true,
                success:false
            })
        }

        const Post = await PostModel.findById(postId);

        if(!Post ){
            return res.status(400).json({
                message:"Post not Found",
                error:true,
                success:false
            })
        }

        const allComments = await commentModel
          .find({ postId })
          .populate("author", "name email profilePic")
          .sort({ createdAt: 1 })
          .lean();

        const commentMap ={};
        const roots=[];

        allComments.forEach((comment)=> {
             commentMap[comment._id]={...comment, replies:[]}
        });

        allComments.forEach((comment) => {
            if(comment.parentId){
                if(commentMap[comment.parentId]){
                    commentMap[comment.parentId].replies.push(commentMap[comment._id]);
                } else {
                    roots.push(commentMap[comment._id]);
                }
            } else {
                roots.push(commentMap[comment._id]);
            }
        });

        return res.json({
            message:"Comment fetched Successfully.",
            error:false,
            success:true,
            data:roots
        })

    } catch (error) {
          return res.status(400).json({
            message:error.message || error,
            error:true,
            success:false
          })
    }
}

// update comments

export async function UpdateComment(req,res) {
    try {
        const userId =req.userId;
        const {commentId}= req.params;
        const {text } = req.body;

        if(!commentId){
            return res.status(400).json({
                message:"Comment Id is required",
                error:true,
                success:false
            })
        }

        if(!text){
            return res.status(400).json({
                message:"Comment is required",
                error:true,
                success:false
            })
        }

        const comment = await commentModel.findById(commentId);

        if(!comment){
            return res.status(400).json({
                message:"Comment is not Found",
                error:true,
                success:false
            })
        }

        if(comment.author.toString() !== userId.toString()){
            return res.status(400).json({
                message:"Only author or real user can Update only.",
                error:true,
                success:false
            })
        }
       
        comment.text =text;
        comment.isEdited =true;
        const updatedComment = await comment.save();

        return res.json({
            message:"Comment is update successfully.",
            error:false,
            success:true,
            data:updatedComment
        })

    } catch (error) {
        return res.status(400).json({
            message:error.message|| error,
            error:true,
            success:false
        })
    }
}



//delete comments

export async function DeleteComments(req,res) {
    try {
        const userId = req.userId;
        const {commentId}= req.params;

        if(!commentId){
            return res.status(400).json({
                message:"commentid is required.",
                error:true,
                success:false
            })
        }
        
        const comment = await commentModel.findById(commentId);

        if(!comment){
            return res.status(400).json({
                message:"Comment is not found .",
                error:true,
                success:false
            })
        }

        if(comment.author.toString() !== userId.toString()){
            return res.status(400).json({
                message:"Unauthorized to delete this  comment.",
                error:true,
                success:false
            })
        }

        const getAllReplies =async(parentId)=>{
         const replies = await commentModel.findById(parentId);
         let ids =replies.map((r)=>r._id);
          
         for(const reply of replies ){
            const nestedReplies = getAllReplies(replies._id);
            ids =[...ids , ...nestedIds]
         }
           return ids;
        };

        const replyIds = getAllReplies(commentId);

        if(replyIds.length >0 ){
            await commentModel.deleteMany({_id : {$in :replyIds}});
        }

        if(comment.parentId){
            await commentModel.findByIdAndUpdate(comment.parentId ,{$pull :{replies :comment._id}})
        }else{
            await PostModel.findByIdAndUpdate(comment.postId ,{$pull :{Comments:comment._id}})
        }

        const deletedComment = await commentModel.findByIdAndDelete(commentId);

        return res.json({
            message:"Comment Deleted Successfully.",
            error:false,
            success:true
        })



    } catch (error) {
      return res.status(400).json({
        message:error.message || error,
        error:true,
        success:false
      })   
    }
}

// toggle likes in comments

export async function ToogleLikesComment(req,res) {
    try {
        
        const {commentId} = req.params;
        const userId = req.userId;

        if(!commentId){
            return res.status(400).json({
                message:"Comment Id is not found.",
                error:true,
                success:false

            })
        }
      
        const comment = await commentModel.findById(commentId);

         if(!comment){
            return res.status(400).json({
                message:"Comment is not found.",
                error:true,
                success:false
            })
         }

         const isAlreadyLiked = comment.likes.includes(userId);
        
         if(isAlreadyLiked){
            comment.likes = comment.likes.filter((id)=> id.toString() !== userId.toString());
         }else{
            comment.likes.push(userId);
         }

        const updatedComments = await comment.save();

        return res.json({
            message:isAlreadyLiked ?"Like Removed ":"Liked Comment",
            error:false,
            success:true,
            data:{
                updatedComments,
               likes:comment.likes.length,
               liked :!isAlreadyLiked
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
