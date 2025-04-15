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
categoryRouter.get("/", getCategoryController);
categoryRouter.post("/categoryCount", getCategoryCountController);
categoryRouter.post("/subCategorycount", getSubCategoryCountController);
categoryRouter.get("/get/:id", getCategoryById);
categoryRouter.delete("/deleteImage", auth, removeCategoryImageFromCloudinary);
categoryRouter.delete("/deleteCategory/:id", auth, deleteCategoryController);
categoryRouter.put("/updateCategory/:id", auth, updateCategoryController);

export default categoryRouter;
