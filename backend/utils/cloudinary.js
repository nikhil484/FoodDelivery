// import { v2 as cloudinary } from 'cloudinary'
// import fs from 'fs'
// const uploadOnCloudinary= async(file)=>{
//   cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret:process.env.CLOUDINARY_API_SECRET
// });
//     try {
//      const result=await cloudinary.uploader.upload(file)   
//      fs.unlinkSync(file)
//      return result.secure_url
//     } catch (error) {
//       fs.unlinkSync(file)  
//       console.log("cloudinary err",error)
//     }
// }

// export default uploadOnCloudinary

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    ).end(fileBuffer);
  });
};

export default uploadOnCloudinary;
