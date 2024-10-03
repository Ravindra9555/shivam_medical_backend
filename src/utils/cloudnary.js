import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import{ ApiError} from "./ApiError.js";
// Configuration
cloudinary.config({
  cloud_name: "dkuaro4xo",
  api_key: "633499734991716",
  api_secret: "AU1XfKi8Btley20m06VbVsN_Q3s", // Click 'View API Keys' above to copy your API secret
});

const cloudinayUpload = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "ShivamMedical",
    });
    console.log(result.url);

    fs.unlinkSync(localFilePath);
    // Delete local file after upload to Cloudinary
    return result;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    throw new ApiError(400, "Error uploading to Cloudinary");
  }
};
export { cloudinayUpload};

