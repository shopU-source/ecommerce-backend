import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { addAddressController, getAddressController } from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.post("/add", auth, addAddressController);
addressRouter.get("/get", auth, getAddressController);

export default addressRouter
