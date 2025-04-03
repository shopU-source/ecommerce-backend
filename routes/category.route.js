import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  categoryImageUpload,
  createCategoryController,
  deleteCategoryController,
  getCategoryById,
  getCategoryController,
  getCategoryCountController,
  getSubCategoryCountController,
  removeCategoryImageFromCloudinary,
  updateCategoryController,
} from "../controllers/category.controller.js";

const categoryRouter = Router();
categoryRouter.post(
  "/uploadImages",
  auth,
  upload.array("images"),
  categoryImageUpload
);
categoryRouter.post("/create", auth, createCategoryController);
categoryRouter.post("/", getCategoryController);
categoryRouter.post("/categoryCount", getCategoryCountController);
categoryRouter.post("/subCategorycount", getSubCategoryCountController);
categoryRouter.post("/get/:id", getCategoryById);
categoryRouter.post("/deleteImage", auth, removeCategoryImageFromCloudinary);
categoryRouter.post("/deleteCategory/:id", auth, deleteCategoryController);
categoryRouter.post("/updateCategory/:id", auth, updateCategoryController);

export default categoryRouter;
