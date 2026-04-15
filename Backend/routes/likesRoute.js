import {Router} from 'express';
import { ToggleLikeController,getLikesController,myLikedPosts } from '../controllers/likesController.js';
import auth from '../middleware/auth.js';
const likeRouter =Router();

likeRouter.post("/like/:postId" ,auth,ToggleLikeController); // likes and unlike toggle route
likeRouter.get("/likes/:postId" ,getLikesController);  // get total likes on post
likeRouter.get("/mylikedposts",auth,myLikedPosts);  // get all my liked posts

export default likeRouter;
