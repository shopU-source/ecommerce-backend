import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { createProductSizeController, deleteProductSizeControllers, getProductSizeById, getProductSizeControllers, updateProductSizeController } from "../controllers/productSize.controller.js";

const productSizeRouter = Router();

productSizeRouter.post("/create", auth, createProductSizeController);
productSizeRouter.delete("/delete/:id", auth, deleteProductSizeControllers);
productSizeRouter.put("/updateSize/:id", auth, updateProductSizeController);
productSizeRouter.get("/getSizes", auth, getProductSizeControllers);
productSizeRouter.get("/getSize/:id", getProductSizeById);

export default productSizeRouter;
