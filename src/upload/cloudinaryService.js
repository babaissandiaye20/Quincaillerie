import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadSingle(file, folder = 'products') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload vide'));
        resolve({ url: result.secure_url, id: result.public_id });
      }
    );
    uploadStream.end(file.buffer);
  });
}

export async function uploadMultiple(files, folder = 'products') {
  if (!files?.length) return [];
  return await Promise.all(files.map((file) => uploadSingle(file, folder)));
}

export async function deleteFile(fileId) {
  try {
    await cloudinary.uploader.destroy(fileId);
  } catch (error) {
    // Log ou ignorer
  }
} 