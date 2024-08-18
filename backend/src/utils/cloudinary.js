import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME),
    api_key: String(process.env.CLOUDINARY_API_KEY),
    api_secret: String(process.env.CLOUDINARY_API_SECRET),
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        const uploadedImage = await cloudinary.uploader.upload(localFilePath);
        if (uploadedImage) {
            fs.unlinkSync(localFilePath);
            return uploadedImage;
        }
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
};

const deleteFromCloudinary = async (image) => {
    try {
        const deletedImage = await cloudinary.uploader.destroy(image, {
            resource_type: "image",
        });
        if (deletedImage) {
            return deletedImage;
        }
    } catch (error) {
        console.log("deletion from cloudinary failed");
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
