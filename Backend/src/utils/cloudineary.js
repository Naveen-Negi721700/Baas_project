import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINEARY_CLOUD_NAME,
    api_key: process.env.CLOUDINEARY_API_KEY,
    api_secret: process.env.CLOUDINEARY_API_SECRET
});



// console.log("Cloudinary config:", cloudinary.config());


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "auto"
            }
        );

        console.log("File uploaded successfully:", response.url);

        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.log("Cloudinary upload error:", error);

        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

export { uploadOnCloudinary };