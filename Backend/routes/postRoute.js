import {Router } from "express";
import auth from '../middleware/auth.js';

import upload  from "../middleware/multer.js";
import {allPostsController,mypostsController,createPostController,updatePostController,getPostController,deletePostController} from "../controllers/postController.js"

const postRouter = Router();

postRouter.post('/createpost',auth,upload.array("photos",12),createPostController);
postRouter.get('/allposts',auth,allPostsController);
postRouter.get('/myposts',auth,mypostsController);
postRouter.put('/updatepost/:postId',auth,upload.array("photos",12),updatePostController);
postRouter.get('/getpost/:postId',auth,getPostController);
postRouter.delete('/deletepost/:postId',auth,deletePostController);

export default postRouter;
