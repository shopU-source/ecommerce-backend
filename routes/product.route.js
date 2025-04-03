import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  createProductController,
  deleteProductController,
  getAllFeaturedProductController,
  getAllProductCountController,
  getAllProductsByCategoryIdController,
  getAllProductsByCategoryNameController,
  getAllProductsByRatingController,
  getAllProductsBySubCategoryIdController,
  getAllProductsBySubCategoryNameController,
  getAllProductsBythirdSubCategoryIdController,
  getAllProductsBythirdSubCategoryNameController,
  getAllProductsController,
  getFilteredProductByPriceController,
  getSingleProductController,
  productImageUpload,
  removeProductImageFromCloudinary,
  updateProductController,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post(
  "/uploadImages",
  auth,
  upload.array("images"),
  productImageUpload
);
productRouter.post("/create", auth, createProductController);
productRouter.post("/getAllProducts", getAllProductsController);
productRouter.post(
  "/getAllProductsByCategoryId/:id",
  getAllProductsByCategoryIdController
);
productRouter.post(
  "/getAllProductsByCategoryName",
  getAllProductsByCategoryNameController
);
productRouter.post(
  "/getAllProductsBySubCategoryId/:id",
  getAllProductsBySubCategoryIdController
);
productRouter.post(
  "/getAllProductsBySubCategoryName",
  getAllProductsBySubCategoryNameController
);
productRouter.post(
  "/getAllProductsBythirdSubCategoryId/:id",
  getAllProductsBythirdSubCategoryIdController
);
productRouter.post(
  "/getAllProductsBythirdSubCategoryName",
  getAllProductsBythirdSubCategoryNameController
);
productRouter.post(
  "/getFilteredProductByPrice",
  getFilteredProductByPriceController
);
productRouter.post("/getAllProductsByRating", getAllProductsByRatingController);
productRouter.post("/getAllProductsCount", getAllProductCountController);
productRouter.post("/getAllFeaturedProduct", getAllFeaturedProductController);
productRouter.post("/deleteProduct/:id", deleteProductController);
productRouter.post("/getProduct/:id", getSingleProductController);
productRouter.post("/deleteImage", auth, removeProductImageFromCloudinary);
productRouter.post("/updateProduct/:id", auth, updateProductController);

export default productRouter;
