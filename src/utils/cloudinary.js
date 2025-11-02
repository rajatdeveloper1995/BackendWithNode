import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadImgToCloudinary = async (localImagePath) => {
  try {
    if (!localImagePath) return null;
    const responseFromClodinary =
      await cloudinary.uploader.upload(localImagePath, {resource_type:"auto"});
    console.log("responseFromClodinary", responseFromClodinary);
    if(responseFromClodinary){
      fs.unlinkSync("/Public/temp");
    }
    return responseFromClodinary;
  } catch (error) {
    fs.unlinkSync("/Public/temp");
    return null;
  }
};

export { uploadImgToCloudinary };
