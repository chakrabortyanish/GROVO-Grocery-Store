import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import { dbConnection } from "./db/connection.js";
import { router } from "./routes/User.js";
import cors from "cors";

import { adminRouter } from "./routes/admin.route.js";
import { productRouter } from "./routes/product.route.js";

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

dbConnection();

// user Routes
app.use("/user", router);

// admin Routes
app.use("/api/admin", adminRouter);

// products Routes
app.use("/api/products", productRouter);

// Order Routes
import orderRoutes from "./routes/order.route.js";
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => console.log(`Server started at PORT : ${PORT}`));
