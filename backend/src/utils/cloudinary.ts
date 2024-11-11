import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/**
 * Upload a file to Cloudinary
 * @param localFilePath - Path to the file stored locally
 * @returns Response from Cloudinary or null if upload fails
 */
export const uploadOnCloudinary = async (
    localFilePath: string
  ): Promise<any> => {
    try {
      if (!localFilePath) return null;
  
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
  
      fs.unlinkSync(localFilePath);
  
      return response;
    } catch (error) {
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
  
      console.error("CLOUDINARY :: FILE UPLOAD ERROR", error);
      return null;
    }
  };
  
  

/**
 * Delete a file from Cloudinary
 * @param url - Cloudinary URL of the file to be deleted
 * @returns Result from Cloudinary or false if deletion fails
 */
export const deleteFromCloudinary = async (url: string): Promise<boolean> => {
  try {
    if (!url) {
      console.log("No URL provided for deletion");
      return false;
    }

    // Extract the public ID from the Cloudinary URL
    const publicIdMatch = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    const publicId = publicIdMatch ? publicIdMatch[1] : null;

    const resourceType = url.includes("/video/") ? "video" : "image"; // Determine resource type

    if (!publicId) {
      console.log("No public ID found in the URL");
      return false;
    }

    // Delete the file from Cloudinary
    const deleteResult = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return deleteResult.result === "ok";
  } catch (error) {
    console.error("CLOUDINARY :: FILE DELETE ERROR", error);
    throw error;
  }
};
