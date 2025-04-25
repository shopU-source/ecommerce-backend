import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  createProductController,
  deleteMultipleProductController,
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
productRouter.get("/getAllProducts", getAllProductsController);
productRouter.get(
  "/getAllProductsByCategoryId/:id",
  getAllProductsByCategoryIdController
);
productRouter.get(
  "/getAllProductsByCategoryName",
  getAllProductsByCategoryNameController
);
productRouter.get(
  "/getAllProductsBySubCategoryId/:id",
  getAllProductsBySubCategoryIdController
);
productRouter.get(
  "/getAllProductsBySubCategoryName",
  getAllProductsBySubCategoryNameController
);
productRouter.get(
  "/getAllProductsBythirdSubCategoryId/:id",
  getAllProductsBythirdSubCategoryIdController
);
productRouter.get(
  "/getAllProductsBythirdSubCategoryName",
  getAllProductsBythirdSubCategoryNameController
);
productRouter.get(
  "/getFilteredProductByPrice",
  getFilteredProductByPriceController
);
productRouter.get("/getAllProductsByRating", getAllProductsByRatingController);
productRouter.get("/getAllProductsCount", getAllProductCountController);
productRouter.get("/getAllFeaturedProduct", getAllFeaturedProductController);
productRouter.delete("/deleteProduct/:id", deleteProductController);
productRouter.delete("/deleteMultiple", deleteMultipleProductController);
productRouter.get("/getProduct/:id", getSingleProductController);
productRouter.delete("/deleteImage", auth, removeProductImageFromCloudinary);
productRouter.post("/updateProduct/:id", auth, updateProductController);

export default productRouter;
