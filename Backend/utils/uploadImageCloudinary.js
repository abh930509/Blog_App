import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET_KEY

})

const uploadImageToCloudinary =async(Image)=>{
    const buffer =Image?.buffer || Buffer.from(await Image.arrayBuffer());
    const uploadImage = await new Promise((resolve,reject)=>{

        cloudinary.uploader.upload_stream({folder:"BlogApp"},(error,uploadResult)=>{
            if(error) return reject(error);
            return resolve(uploadResult);
        }).end(buffer);
    })

    return uploadImage;

}

export default uploadImageToCloudinary;