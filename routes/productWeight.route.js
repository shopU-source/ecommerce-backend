import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { createProductWeightController, deleteProductWeightControllers, getProductWeightById, getProductWeightControllers, updateProductWeightController } from "../controllers/productWeight.controller.js";

const productWeightRouter = Router();

productWeightRouter.post("/create", auth, createProductWeightController);
productWeightRouter.delete("/delete/:id", auth, deleteProductWeightControllers);
productWeightRouter.put("/updateWeight/:id", auth, updateProductWeightController);
productWeightRouter.get("/getWeights", auth, getProductWeightControllers);
productWeightRouter.get("/getWeight/:id", getProductWeightById);

export default productWeightRouter;
