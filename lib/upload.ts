"use server";

import { v2 as cloudinary } from 'cloudinary';

export async function getCloudinarySignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = "ml_default";

  const paramsToSign = {
    timestamp: timestamp,
    folder: folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return { 
    signature, 
    timestamp, 
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY 
  };
}