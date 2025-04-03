import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const generateAccessToken = async (userId) => {
  const token = await jwt.sign(
    {
      id: userId,
    },
    process.env.ACCESS_TOKEN_PASSWORD,
    { expiresIn: "5h" }
  );
  return token;
};

export default generateAccessToken;
