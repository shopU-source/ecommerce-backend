import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verificationEmail from "../utils/verifyEmailTemplate.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendEmail.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import fs from "fs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_APIKEY,
  api_secret: process.env.CLOUDINARY_CLOUD_APISECRET,
  secure: true,
});

let imagesArray = [];

export async function registerUserController(req, res) {
  try {
    let user;
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Provide email, name, password",
        error: true,
        success: false,
      });
    }

    // Check if user already exists
    user = await UserModel.findOne({ email: email });
    if (user) {
      return res.status(409).json({
        message: "User already registered with this email",
        error: true,
        success: false,
      });
    }

    // Generate verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    // Create new user
    user = await new UserModel({
      email: email,
      password: hashPassword,
      name: name,
      otp: verifyCode,
      otpExpiry: Date.now() + 600000,
    });

    const mailSendResult = await sendMail(
      email,
      "Verify email from ShopU",
      "Your verification code is: " + verifyCode,
      verifyEmailTemplate(name, verifyCode)
    );

    // Check if email was sent successfully
    if (!mailSendResult.success) {
      return res.status(500).json({
        message: "Failed to send verification email",
        error: true,
        success: false,
        details: mailSendResult.error,
      });
    }

    // Save user
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_PASSWORD
    );

    return res.status(201).json({
      success: true,
      error: false,
      message: "User registered successfully",
      token: token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(req, res) {
  const { email, otp } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      error: true,
      success: false,
      message: "User not found",
    });
  }

  const isOtpValid = user.otp == otp;
  const isNotExpired = user.otpExpiry > Date.now();

  if (isOtpValid && isNotExpired) {
    user.verifyEmail = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    return res.status(200).json({
      success: true,
      error: false,
      message: "Email verified successfully",
    });
  } else if (!isOtpValid) {
    return res.status(400).json({
      error: true,
      success: false,
      message: "Invalid otp",
    });
  } else {
    return res.json(400).json({
      error: true,
      success: false,
      messsage: "OTP expires",
    });
  }
}

export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not registered",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Account is inactive. Please contact admin",
        error: true,
        success: false,
      });
    }

    // Handle email verification first
    if (!user.verifyEmail) {
      // Generate new verification code
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Update user with new OTP and expiry
      await UserModel.findByIdAndUpdate(user._id, {
        otp: verifyCode,
        otpExpiry: Date.now() + 600000, // 10 minutes
      });

      // Send verification email
      const mailResult = await sendMail(
        email,
        "Verify email from ShopU",
        "Your verification code is: " + verifyCode,
        verificationEmail(user.name, verifyCode)
      );

      if (!mailResult.success) {
        return res.status(500).json({
          message: "Failed to send verification email. Please try again later.",
          error: true,
          success: false,
        });
      }

      return res.status(400).json({
        message:
          "Please verify your email. A new verification code has been sent.",
        error: true,
        success: false,
      });
    }

    // Check password after email verification
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invalid password",
      });
    }

    // Generate tokens
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    // Update user with tokens and login date
    await UserModel.findByIdAndUpdate(user._id, {
      lastLoginDate: new Date(),
      accessToken,
      refreshToken,
    });

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.status(200).json({
      message: "Login successful",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function logoutController(req, res) {
  const userId = req.userId;

  const cookiesOption = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res.clearCookie("accessToken", cookiesOption);
  res.clearCookie("refreshToken", cookiesOption);

  await UserModel.findByIdAndUpdate(userId, {
    refreshToken: "",
    accessToken: "",
  });

  return res.status(200).json({
    message: "Logout successfull",
    error: false,
    success: true,
  });
}

export async function userAvatarController(req, res) {
  imagesArray = [];

  const userId = req.userId;
  const images = req.files;

  const user = await UserModel.findOne({ _id: userId });

  if (!user) {
    return res.status(401).json({
      message: "user not founde",
      success: false,
      error: true,
    });
  }

  // first remove image from cloudinary
  const imageUrl = user.avatar;
  const urlArray = imageUrl.split("/");
  const avatarImage = urlArray[urlArray.length - 1];
  const imageName = avatarImage.split(".")[0];

  if (imageName) {
    await cloudinary.uploader.destroy(imageName, (error, result) => {
      // console.log(error, result)
    });
  }

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: false,
  };

  for (let i = 0; i < images?.length; i++) {
    await cloudinary.uploader.upload(
      images[i].path,
      options,
      function (error, result) {
        console.log(result);
        imagesArray.push(result.secure_url);
        fs.unlinkSync(`uploads/${images[i].filename}`);
        console.log(images[i].filename);
      }
    );
  }

  await UserModel.findByIdAndUpdate(userId, {
    avatar: imagesArray[0],
  });

  return res.status(200).json({
    _id: userId,
  });
}

export async function removeImageFromCloudinary(req, res) {
  const imageUrl = req.query.img;
  const urlArray = imageUrl.split("/");
  const image = urlArray[urlArray.length - 1];
  const imageName = image.split(".")[0];

  if (imageName) {
    const response = await cloudinary.uploader.destroy(
      imageName,
      (error, result) => {
        // console.log(error, result)
      }
    );

    if (response) {
      return res.status(200).json({
        message: "Image deleted from cloudinary",
        success: true,
        error: false,
      });
    }
  }
}

export async function updateUserDetails(req, res) {
  const userId = req.userId;
  const { email, name, password, phone } = req.body;

  const userExists = await UserModel.findById(userId);

  if (!userExists) {
    return res.status(400).send("The user cannot be updated");
  }

  let verifyCode = "";

  if (email !== userExists.email) {
    verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  }

  let hashPassword = "";

  if (password) {
    const salt = await bcryptjs.genSalt(10);
    hashPassword = await bcryptjs.hash(password, salt);
  } else {
    hashPassword = userExists.password;
  }

  const updateUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      name: name,
      email: email,
      phone: phone,
      verifyEmail: email !== userExists.email ? false : true,
      password: hashPassword,
      otp: verifyCode !== "" ? verifyCode : null,
      otpExpiry: verifyCode !== "" ? Date.now() + 600000 : "",
    },
    {
      new: true,
    }
  );

  if (email !== userExists.email) {
    await sendMail(
      email,
      "Verify email from ShopU",
      "Your verification code is: " + verifyCode,
      verificationEmail(userExists.name, verifyCode)
    );
    return res.status(303).json({
      message: "Verify your otp first",
      success: true,
      error: false,
    });
  }

  return res.status(200).json({
    message: "User updated successfully",
    error: false,
    success: true,
    user: updateUser,
  });
}

export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    } else {
      let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = verifyCode;
      user.otpExpiry = Date.now() + 100000;

      await user.save();

      await sendMail(
        email,
        "Verify email from ShopU",
        "Your verification code is: " + verifyCode,
        verificationEmail(user.name, verifyCode)
      );

      return res.status(200).json({
        message: "Otp send",
        success: true,
        error: false,
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

export async function verifyForgotPasswordOtp(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(401).json({
      message: "Provide required field email, otp",
      error: true,
      success: false,
    });
  }

  const user = await UserModel.findOne({ email: email });

  if (!user) {
    return res.status(400).json({
      message: "Email not available",
      error: true,
      success: true,
    });
  }

  if (otp !== user.otp) {
    return res.status(404).json({
      message: "Invalid otp",
      error: true,
      success: false,
    });
  }

  const currentTime = new Date().toISOString();
  if (user.otpExpiry < currentTime) {
    return res.status(400).json({
      message: "OTP is expired",
      error: true,
      success: false,
    });
  }

  user.otp = "";
  user.otpExpiry = "";

  await user.save();

  return res.status(201).json({
    message: "Verify OTP successfully",
    error: false,
    success: true,
  });
}

export async function resetPasswordController(req, res) {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message:
        "Please provide required fields email, password, confirmpassword",
      success: false,
      error: true,
    });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Email is not available",
      error: true,
      success: false,
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "New Password and Confirm Password should be same",
      error: true,
      success: false,
    });
  }

  const salt = await bcryptjs.genSalt(10);
  const hashPassword = await bcryptjs.hash(newPassword, salt);

  const update = await UserModel.findByIdAndUpdate(user._id, {
    password: hashPassword,
  });

  return res.status(201).json({
    message: "Password updated successfully",
    error: false,
    success: true,
    update,
  });
}

export async function refreshTokenController(req, res) {
  const refreshToken =
    req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1];

  if (!refreshToken) {
    return res.status(401).json({
      message: "Invalid token",
      error: true,
      success: false,
    });
  }

  const verifyToken = await jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_PASSWORD
  );
  if (!verifyToken) {
    return res.status(401).json({
      message: "Token is expired",
      error: true,
      success: false,
    });
  }

  const userId = verifyToken?._id;
  const newAccessToken = await generateAccessToken(userId);

  const cookiesOption = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res.cookie("accessToken", newAccessToken, cookiesOption);

  return res.status(201).json({
    message: "New access token generated",
    error: false,
    success: true,
    data: {
      accessToken: newAccessToken,
    },
  });
}

export async function userDetailsController(req, res) {
  const userId = req.userId;
  const user = await UserModel.findById(userId).select(
    "-password -refreshToken"
  );

  return res.status(201).json({
    message: "User details",
    error: false,
    success: true,
    user,
  });
}
