import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

async function auth(req, res, next) {
  var token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1];
  if (!token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      message: "Provide token",
      success: false,
      error: true,
    });
  }

  try {
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
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired",
        success: false,
        error: true,
      });
    }

    return res.status(401).json({
      message: "Invalid or malformed token",
      success: false,
      error: true,
    });
  }
}

export default auth;
