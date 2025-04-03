import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const generateRefreshToken = async (userId) => {
  const token = await jwt.sign(
    {
      id: userId,
    },
    process.env.REFRESH_TOKEN_PASSWORD,
    { expiresIn: "7d" }
  );

  await UserModel.updateOne(
    { id: userId },
    {
      refreshToken: token,
    }
  );
  return token;
};

export default generateRefreshToken;
