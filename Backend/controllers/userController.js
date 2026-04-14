import UserModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generatedAccessToken from "../utils/generateAccessToken.js";
import generatedrefreshToken from "../utils/generatedRefreshToken.js";

//Register
export async function registerUserController(req,res) {
    try {
        if(!req.body){
            return res.status(400).json({
                message:'Request body is missing',
                error:true,
                success:false
                
            })
        }

        const {name, email, password} =req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message:'provide name, email and password.',
                error:true,
                success:false
            })
        }

        const UserExists = await UserModel.findOne({email});

        if(UserExists){
            return res.status(400).json({
                message:'Already Registered.',
                error:true,
                success:false
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const payLoad ={
            name,
            email,
            password:hashedPassword
        };

        const newUser = new UserModel(payLoad);
        const savedUser = await newUser.save();

        return res.json({
            message:'User registered Successfully.',
            error:false,
            success:true,
            data:savedUser
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message|| error,
            error:true,
            success:false
        })
        
    }
}

//login

export async function loginUserController(req,res) {
    try {
        if(!req.body){
        return res.status(500).json({
            message:'Request body is missing.',
            error:true,
            success:false
        })
    }

    const {email,password} =req.body;
    if(!email || !password){
        return res.status(400).json({
            message:"Provide email and password ",
            error:true,
            success:false
        })
    }

    const user =await UserModel.findOne({email});

    if(!user){
        return res.status(400).json({
            message:'User not Registered',
            error:true,
            success:false
        })
    }

    const isPasswordMatched =await bcrypt.compare(password,user.password);

    if(!isPasswordMatched){
        return res.status(400).json({
            message:'Invalid Credentials',
            error:true,
            success:false
        })
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedrefreshToken(user._id);

     const UpateUser = await UserModel.findByIdAndUpdate(user._id,{
        last_login_date :new Date()
    })
   
    const cookieOption ={
        httpOnly:true,
        secure:true,
        sameSite:"None"
    };

    res.cookie("accessToken",accessToken,cookieOption);
    res.cookie("refreshToken",refreshToken,cookieOption);

     return res.json({
        message:'Login Successfull',
        error:false,
        success:true,
        data: {
            user,refreshToken,accessToken
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

//Logout
export async function logoutController(req,res) {
    try {
        const userId =req.userId;
        if(!userId){
            return res.json(400).json({
                message:'user id is missing.',
                error:true,
                success:false
            })
        }

        res.cookieOption ={
            httpOnly:true,
            secure:true,
            sameSite:"None"
        }

        res.clearCookie("accessToken",res.cookieOption);
        res.clearCookie("refreshToken",res.cookieOption);

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId,{
            refresh_token:""
        })

        return res.json({
            message:"Logout SuccessFull.",
            error:false,
            success:true
        })
    } catch (error) {
        return res.status(400).json({
            message:error.message|| error,
            error:true,
            success:false
        })
        
    }
    
}

//Update user
export async function updateUserController(req,res) {
    try {
        const userId =req.userId;
        const {name,mobile,email,password}= req.body

        let hashedPassword =""

        if(password){
            const salt =await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password,salt);
        }

        const updateUser = await UserModel.updateOne({_id:userId},{
            ...(name && {name :name}),
            ...(mobile && {mobile:mobile}),
            ...(email && {email:email}),
            ...(password && {password:hashedPassword})
        })

        return res.json({
            message:"User details upated successfully",
            error:false,
            success:true,
            data:{
                updateUser,
                name,
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



export async function GetUserController(req, res){
  try {
    const userId= req.userId;
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.log("Get User Error", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



//refresh Token after access token expired

export async function  refreshToken(req,res) {
  try {
    const refreshToken  = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1];

    if(!refreshToken){
      return res.status(401).json({
        message:"Invalid Token",
        error:true,
        success:false
      })
    }
     const verifyToken =await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN);

     if(!verifyToken){
      return res.status(401).json({
        message:"token is Expired",
        error:true,
        success:false
      })
     }

    
     const userId = verifyToken?._id;

     const newAccessToken = await generatedAccessToken(userId);

     const cookieOption ={
      httpOnly:true,
      secure:true,
      sameSite:"None"
     }

     res.cookie("accessToken",newAccessToken,cookieOption);

     return res.json({
      message:"New Access token generated Successfully",
      error:false,
      success:true,
      data:{
        accessToken:newAccessToken,

      }
     })
;

    
  } catch (error) {
    return res.status(500).json({
      message:error.message || error,
      error:true,
      success:false
    })
  }
}
