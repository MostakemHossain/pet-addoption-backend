import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});
export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND,
  jwt__access_secret: process.env.JWT_REFRESH_SECRET,
  jwt__refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt__access_expire_in: process.env.JWT_ACCESS_EXPIRE_IN,
  jwt__refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN,
  reset_password_token: process.env.RESET_PASSWORD_TOKEN,
  reset_password_expire_in: process.env.RESET_PASSWORD_TOKEN_EXPIRE_IN,
  reset_password_link: process.env.RESET_PASSWORD_LINK,
  emailSender: {
    email: process.env.EMAIL,
    app_password: process.env.APP_PASSWORD,
  },
  cloudinary_cloud_name: process.env.CLOUD_NAME,
  cloudinary_api_key: process.env.API_KEY,
  cloudinary_api_serect: process.env.API_SECRET,
};
