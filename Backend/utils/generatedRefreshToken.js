import UserModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const generatedrefreshToken = async(userId)=>{
    const token = jwt.sign({_id:userId},
        process.env.SECRET_KEY_REFRESH_TOKEN,
        {expiresIn:'7d'}
    )

    const updateRefreshToken =await UserModel.updateOne({
        _id:userId
    },{
        refresh_token:token
    })
    return token;
}

export default generatedrefreshToken;