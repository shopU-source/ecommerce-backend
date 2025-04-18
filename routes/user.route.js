import { Router } from "express";
import {
  forgotPasswordController,
  loginUserController,
  logoutController,
  refreshTokenController,
  registerUserController,
  removeImageFromCloudinary,
  resetPasswordController,
  updateUserDetails,
  userAvatarController,
  userDetailsController,
  verifyEmailController,
  verifyForgotPasswordOtp,
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verifyEmail", verifyEmailController);
userRouter.post("/login", loginUserController);
userRouter.get("/logout", auth, logoutController);
userRouter.put(
  "/userAvatar",
  auth,
  upload.array("avatar"),
  userAvatarController
);
userRouter.post("/deleteImage", auth, removeImageFromCloudinary);
userRouter.put("/update/:id", auth, updateUserDetails);
userRouter.post("/forgotPassword", forgotPasswordController);
userRouter.post("/verifyForgotPasswordOtp", verifyForgotPasswordOtp);
userRouter.post("/resetPassword", resetPasswordController);
userRouter.post("/refreshToken", refreshTokenController);
userRouter.get("/userDetails", auth, userDetailsController);

export default userRouter;
