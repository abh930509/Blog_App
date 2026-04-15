import {Router} from "express";
import auth from '../middleware/auth.js';
import {createCommentController,getAllComment,UpdateComment,DeleteComments,ToogleLikesComment} from '../controllers/commentController.js';

const commentRouter = Router();

commentRouter.post("/post/:postId/comment", auth, createCommentController);      
commentRouter.get("/post/:postId/comments", auth, getAllComment);         
commentRouter.put("/comment/:commentId", auth, UpdateComment);         
commentRouter.delete("/comment/:commentId", auth, DeleteComments);       
commentRouter.put("/comment/:commentId/like", auth, ToogleLikesComment); 

export default commentRouter;