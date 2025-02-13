import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "../../config/env.config";
import { AppError } from "../../util/Error.util";

//TODO - maybe merge with the video upload
const uploadToCdn = async (file: Blob): Promise<string> => {
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("file", file);
  formData.append("folder", "training");
  const res = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const imgUrl: { secure_url: string } = await res.json();
  if (!imgUrl) {
    throw AppError.create("No return value", 502);
  }
  return imgUrl.secure_url;
};

export const imagesService = {
  uploadToCdn,
};
