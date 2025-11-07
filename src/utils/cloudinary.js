import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
});


const uploadImgToCloudinary = async (localImagePath) => {
  try {
    if (!localImagePath) return null;
    const responseFromClodinary =
      await cloudinary.uploader.upload(localImagePath, {resource_type:"auto"});
    console.log("responseFromClodinary", responseFromClodinary);
    if(responseFromClodinary){
      fs.unlinkSync(localImagePath);
    }
    return responseFromClodinary;
  } catch (error) {
    fs.unlinkSync(localImagePath);
    return null;
  }
};

export { uploadImgToCloudinary };
