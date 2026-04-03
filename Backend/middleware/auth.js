import jwt from 'jsonwebtoken';

const auth =(req,res,next)=>{
    try {
        const token  =req?.cookies?.accessToken || req?.headers?.authorization?.split(" ")[1];
       

        if(!token){
            return res.status(401).json({
                message:'Token not found',
                error:true,
                success:false
            })
        }

        const decoded =jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN);
        console.log(decoded);
        console.log(req.userId);
        req.userId = decoded._id;
        next();
        
    } catch (error) {
        return res.status((500).json({
            message:'Authentication failed',
            error:error.message,
            success:false
        }))
        
    }
}

export default auth;