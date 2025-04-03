import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  addToCartItemController,
  deleteCartItemController,
  getCartItemController,
  updateCartItemQuantityController,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/addCartItem", auth, addToCartItemController);
cartRouter.post("/getCartItem", auth, getCartItemController);
cartRouter.post("/updateQuantity", auth, updateCartItemQuantityController);
cartRouter.post("/deleteCartItem", auth, deleteCartItemController);

export default cartRouter;
