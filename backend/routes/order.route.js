import express from "express";
import {
  createOrder,findAllOrders
} from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, createOrder);
router.get("/allOrders", verifyToken, findAllOrders);

export default router; 