import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import{ ApiError} from "./ApiError.js";
// Configuration
cloudinary.config({
  cloud_name: "dkuaro4xo",
  api_key: "633499734991716",
  api_secret: "AU1XfKi8Btley20m06VbVsN_Q3s", // Click 'View API Keys' above to copy your API secret
});

const cloudinayUpload = async (localpath) => {
  try {
    if (!localpath) {
      return null;
    }

    const result = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
      folder_name: "ShivamMedical",
    });
    console.log(result.url);

    fs.unlinkSync(localpath);
    // Delete local file after upload to Cloudinary
    return result.url;
  } catch (error) {
    fs.unlinkSync(localpath);
    throw new ApiError(5000, "Error uploading to Cloudinary");
  }
};
export default cloudinayUpload;

