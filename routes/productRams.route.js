import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createProductRamsController,
  deleteMultipleProductRamsController,
  deleteProductRamsControllers,
  getProductRamById,
  getProductRamsControllers,
  updateProductRamController
} from "../controllers/productRams.controller.js";

const productRamRouter = Router();

productRamRouter.post("/create", auth, createProductRamsController);
productRamRouter.delete("/delete/:id", auth, deleteProductRamsControllers);
productRamRouter.delete("/deleteMultipleRam", auth, deleteMultipleProductRamsController);
productRamRouter.put("/updateRams/:id", auth, updateProductRamController);
productRamRouter.get("/getRams", auth, getProductRamsControllers);
productRamRouter.get("/getRam/:id", getProductRamById);

export default productRamRouter;
