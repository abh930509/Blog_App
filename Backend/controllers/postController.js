import PostModel from "../models/postModel.js"
import UserModel from "../models/userModel.js"
import uploadImageToCloudinary from "../utils/uploadImageCloudinary.js";



export async function createPostController(req,res) {
    try {
        const userId =req.userId;
        const files =req.files;
       

          const uploadedImages = [];

    

        if(!userId){
            return res.status(400).json({
                message:'User id is missing.',
                error:true,
                success:false
            })

        }
        if(!req.body){
            return res.status(500).json({
                message:'Request Body not found',
                error:true,
                success:false
            })


        }

        const {title,content} =req.body;

        if(!title || !content){
            return res.status(400).json({
                message:'Title and content are required',
                error:true,
                success:false
            })
        }


        if(files && files.length > 0){
      for (const file of files) {

        const result = await uploadImageToCloudinary(file);
       

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    }

        const payload ={
            title,
            content,
            images:uploadedImages,
            author:userId
        }

        const newPost =new PostModel(payload);
        const savedPost =await newPost.save();

        return res.json({
            message:'Post Created successfully.',
            error:false,
            success:true,
            data:{
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


export async function allPostsController(req,res) {
     
    try {

        const cursor = req.query.cursor;
        let limit = parseInt(req.query.limit )|| 20;
        const userId =req.userId;

        if(limit>10) limit =10;

        let query ={};;

        if(cursor){
            query._id ={$lt :cursor}
        }

      const Allposts = await PostModel.find(query)
  .populate("author", "name email profilePic")
  .sort({ createdAt: -1 }).limit(limit).lean();

        const nextCursor = Allposts.length ?Allposts[Allposts.length -1]._id:null;

        if(!Allposts){
            return res.status(400).json({
                message:'No Post found ',
                error:true,
                success:false
            })
        }

        
        const updatedPosts = Allposts.map(post => ({
  ...post,
   liked: post.Likes?.some(id => id.toString() === userId.toString()),
  likesCount: post.Likes.length
}));

        

        return res.json({
            message:'Post found successfully',
            error:false,
            success:true,
            data:{
                Allposts: updatedPosts,
                nextCursor,
                hasMore:Allposts.length === limit
            }
        })
        
    } catch (error) {

        return res.status(400).json({
            message:error.message||message,
            error:true,
            success:false
        })
        
    }
        

    
}

export async function  mypostsController(req,res) {
    try {

        const userId =req.userId;
        const myAllPosts = await PostModel.find({author:userId});

        if(!myAllPosts){
            return res.status(400).json({
                messsage:'No Post found ,Please create your Posts.',
                error:true,
                success:false
            })
        }

        return res.json({
            message:"Your all posts find successfully.",
            error:false,
            success:true,
            data:{
                myAllPosts
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

export async function  updatePostController(req,res) {
    try {
        const {postId} = req.params;
          const userId =req.userId;
        
        const {title,content} = req.body;
        
        const images = req.files;
        console.log(images);

        if(!postId){
            return res.status(400).json({
                message:'PostId is not found',
                error:true,
                success:false
            })
        }

        const post = await PostModel.findById(postId);
        console.log(post);

        if(!post){
            return res.status(400).json({
                message:'No Post found ',
                error:true,
                success:false
            })
        }
          const updatedImages =[];
        if(images && images.length>0){

            for(const image of images){
                const result =await uploadImageToCloudinary(image);

                updatedImages.push({
                    url:result.secure_url,
                    public_id:result.public_id
                })

            }
        }
        
        const updatedPost =await PostModel.updateOne({_id:postId},{
            ...(title && {title:title}),
            ...(content && {content:content}),
            ...(updatedImages.length > 0 && {images:updatedImages})
        })

        return res.json({
            message:'Post updated Successfully',
            error:false,
            success:true,
            data:{
                updatedPost
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


export async function  getPostController(req,res) {
    try {
        const {postId} =req.params;
        const userId =req.userId;

        if(!postId){
            return res.status(400).json({
                message:'Post id is not found.',
                error:true,
                success:false
            })
        }

        const post = await PostModel.findById(postId);

        if(!post){
            return res.status(400).json({
                message:'Post not found ',
                error:true,
                success:false
            })
        }

        return res.json({
            message:'Post fetched  successfully.',
            error:false,
            success:true,
            data:{
                post,
                userId,
                postId
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

export async function deletePostController(req,res) {
    try {
    const {postId} = req.params;
    
    if(!postId){
        return res.status(400).json({
            message:'Post Id is not found',
            error:true,
            success:false
        })
    }

    const deletedpost = await PostModel.findByIdAndDelete(postId);

    return res.json({
        message:'Post deleted successfully.',
        error:false,
        success:true,
        data:{
            deletedpost,
            postId
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
