import express from "express";

import {
  addToCart,
  getCart,
  increaseCart,
  decreaseCart,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);

router.get("/", verifyToken, getCart);

router.patch("/increase/:productId", verifyToken, increaseCart);

router.patch("/decrease/:productId", verifyToken, decreaseCart);

router.delete("/remove/:productId", verifyToken, removeCartItem);

router.delete("/clear", verifyToken, clearCart);

export { router as cartRoutes };