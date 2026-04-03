import {Router} from "express";
import auth from '../middleware/auth.js';

import upload  from "../middleware/multer.js";

import { registerUserController,loginUserController,logoutController,updateUserController,refreshToken } from "../controllers/userController.js";
import {allPostsController,mypostsController,createPostController,updatePostController,getPostController,deletePostController} from "../controllers/postController.js"


const userRouter =Router();

userRouter.post('/signup',registerUserController);
userRouter.post('/signin',loginUserController);
userRouter.get('/logout',auth,logoutController);
userRouter.put('/updateuser',auth,updateUserController);
userRouter.post('/createpost',auth,upload.array("photos",12),createPostController);
userRouter.get('/allposts',allPostsController);
userRouter.get('/myposts',auth,mypostsController);
userRouter.put('/updatepost/:postId',auth,upload.array("photos",12),updatePostController);
userRouter.get('/getpost/:postId',auth,getPostController);
userRouter.delete('/deletepost/:postId',auth,deletePostController);
userRouter.post('/refresh-token',refreshToken);



export default userRouter;






