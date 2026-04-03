import jwt from 'jsonwebtoken';

const generatedAccessToken =async(userid)=>{
    const token =jwt.sign({_id : userid},
        process.env.SECRET_KEY_ACCESS_TOKEN,
        {expiresIn:'5h'}
    )
    return token;
}

export default generatedAccessToken;