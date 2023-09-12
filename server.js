import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import otpRouter from "./routes/otp.routes.js";
import orderRouter from "./routes/order.routes.js";

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true })); // parses application/x-www-form-urlencoded
app.use(express.json()); // parses application/json
app.use(cors()); // setting Cross-Origin Resource Sharing access

// Root
app.get("/", (req, res) => {
  res.send("Hi !");
});

// Connect to DB
mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected !");
  })
  .catch((error) => {
    console.log("Failed to Connect to MongoDB with error : ", error);
  });
// Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/otp", otpRouter);
app.use("/api/orders", orderRouter);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Listen to port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}.`));
