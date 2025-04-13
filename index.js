import express from "express";
import cors from "cors";
import { config } from "dotenv";
import connectionToDB from "./config/dbConnection.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import userRouter from "./routes/user.route.js";
import categoryRouter from "./routes/category.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import myListRouter from "./routes/myList.route.js";
import addressRouter from "./routes/address.route.js";
config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/myList", myListRouter);
app.use("/api/address", addressRouter)

app.listen(PORT, async () => {
  await connectionToDB();
  console.log(`App is listening on ${PORT}`);
});

export default app;
