import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { addHomeSlideController, deleteMultipleSlideController, deleteSlideController, getAllHomeSlidesController, getSlideController, homeSliderImageUploadController, removeHomeSlideImageFromCloudinary, updateSlideController } from "../controllers/homeSlider.controller.js";

const homeSlideRouter = Router();

homeSlideRouter.post("/uploadImages", auth, upload.array("images"), homeSliderImageUploadController);
homeSlideRouter.post("/addSlider", auth, addHomeSlideController);
homeSlideRouter.get("/getAll", auth, getAllHomeSlidesController);
homeSlideRouter.get("/get/:id", getSlideController);
homeSlideRouter.delete("/deleteSlide", auth, removeHomeSlideImageFromCloudinary);
homeSlideRouter.delete("/deleteSlides/:id", auth, deleteSlideController);
homeSlideRouter.delete("/deleteMultiple/:id", auth, deleteMultipleSlideController);
homeSlideRouter.put("/update", auth, updateSlideController);

export default homeSlideRouter;