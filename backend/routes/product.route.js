import express from "express";

import {
  addProduct,
  getProducts,
  getAdminProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  getProductsByCategory,
} from "../controllers/product.controller.js";

import upload from "../middleware/upload.middleware.js";
import { adminAuth } from "../middleware/admin.middleware.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);

productRouter.get("/admin", adminAuth, getAdminProducts);

productRouter.get("/:id", getSingleProduct);

productRouter.post("/add", adminAuth, upload.single("image"), addProduct);

productRouter.put("/:id", adminAuth, upload.single("image"), updateProduct);

productRouter.delete("/:id", adminAuth, deleteProduct);

productRouter.get("/category/:category", getProductsByCategory);

export { productRouter };
