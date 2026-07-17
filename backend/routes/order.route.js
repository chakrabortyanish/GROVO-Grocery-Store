import express from "express";
import {
  createOrder,findAllOrders, verifyPayment, downloadInvoice,
  handleOrders, updateOrderStatus
} from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { adminAuth } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, createOrder);
router.post("/verify-payment", verifyToken, verifyPayment);
router.get("/userOrders", verifyToken, findAllOrders);
router.get("/allOrders", adminAuth, handleOrders);
router.put("/update/:id/status", adminAuth, updateOrderStatus);
router.get("/invoice/:id", verifyToken, downloadInvoice);

export default router; 