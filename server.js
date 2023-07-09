import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import UserRoute from "./route/UserRoute.js";
import bodyParser from "body-parser";
import CourseController from "./controller/CourseController.js";
import CellRouter from "./route/CellRoute.js"
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("tiny"));
app.disable("x-powered-by");

mongoose
  .connect("mongodb://127.0.0.1:27017/first")
  .then(() => console.log("success"))
  .catch((err) => console.log("fuck"));

app.use("/", UserRoute);
app.use("/", CourseController);
app.use("/",CellRouter);
app.listen(8080, () => {
  console.log("server listening on port 8080");
});
export default app;