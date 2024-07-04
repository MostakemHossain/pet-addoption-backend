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
};
