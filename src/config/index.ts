import dotenv from "dotenv";

dotenv.config();

export default {
  JWT_SECRET: process.env.JWT_SECRET_KEY,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_REFRESH: process.env.JWT_REFRESH_KEY,
  JWT_REFRESH_IN: process.env.JWT_REFRESH_IN,
  RESET_TOKEN: process.env.RESET_PASSWORD_TOKEN,
  RESET_TOKEN_EXPIRES_IN: process.env.RESET_PASSWORD_EXPIRES_IN,
  RESET_PASSWORD_URL: process.env.RESET_PASSWORD_LINK,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  NODE_ENV: process.env.NODE_ENV,

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
};
