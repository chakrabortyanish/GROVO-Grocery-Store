import express from "express";
import {
  createOrder,findAllOrders, verifyPayment, downloadInvoice
} from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, createOrder);
router.post("/verify-payment", verifyToken, verifyPayment);
router.get("/allOrders", verifyToken, findAllOrders);
router.get("/invoice/:id", verifyToken, downloadInvoice);

export default router; 