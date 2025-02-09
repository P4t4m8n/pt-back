import { config } from "dotenv";

config();

export const {
  DATABASE_URL = "",
  COOKIE_SECRET = "",
  JWT_SECRET = "",
  GOOGLE_REDIRECT_URI = "",
  GOOGLE_CLIENT_ID = "",
  GOOGLE_CLIENT_SECRET = "",
  CLOUDINARY_UPLOAD_PRESET = "",
  CLOUDINARY_CLOUD_NAME = "",
  CLOUDINARY_API_KEY = "",
  PORT = 3030,
  BASE_URL = "",
  FRONTEND_URL = "localhost:5174",
  NODE_ENV = "development",
} = process.env;
