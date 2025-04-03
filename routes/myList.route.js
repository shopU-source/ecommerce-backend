import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  addToMyListController,
  deleteFromMyListController,
  getMyListController,
} from "../controllers/myList.controller.js";

const myListRouter = Router();

myListRouter.post("/addMyList", auth, addToMyListController);
myListRouter.post("/", auth, getMyListController);
myListRouter.post("/deleteMyList/:id", auth, deleteFromMyListController);

export default myListRouter;
