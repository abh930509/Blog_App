import {Router} from "express";
import auth from '../middleware/auth.js';

import upload  from "../middleware/multer.js";

import { registerUserController,loginUserController,logoutController,updateUserController,refreshToken,GetUserController,getUserProfileController } from "../controllers/userController.js";



const userRouter =Router();

userRouter.post('/signup',registerUserController);
userRouter.post('/signin',loginUserController);
userRouter.get('/logout',auth,logoutController);
userRouter.put('/updateuser',auth,updateUserController);
userRouter.get('/getuser',auth,GetUserController);
userRouter.get('/userProfile/:userId',auth,getUserProfileController);

userRouter.post('/refresh-token',refreshToken);



export default userRouter;






