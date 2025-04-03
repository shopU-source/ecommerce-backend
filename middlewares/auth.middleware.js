import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

async function auth(req, res, next) {
  const token =
    req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Provide token",
    });
  }

  const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_PASSWORD);

  if (!decode) {
    return res.status(401).json({
      message: "Unauthorized access",
      success: false,
      error: true,
    });
  }

  req.userId = decode.id;
  next();
}

export default auth;
