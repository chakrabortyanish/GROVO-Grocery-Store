import Order from "../models/order.model.js";
import jwt from "jsonwebtoken";
import razorpay from "../config/razorpay.js";
import Product from "../models/product.model.js";
import crypto from "crypto";


// ============================
// CREATE ORDER
// ============================

export const createOrder = async (req, res) => {
  try {
    const {totalProductsPrice, items} = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalProductsPrice * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      totalAmount: totalProductsPrice,
      razorpayOrder,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// VERIFY PAYMENT
// ============================

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      address,
      paymentMethod,
      totalProductsPrice,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

      if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment Verification Failed",
      });
    }

    const existingOrder = await Order.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });

    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "Order already exists",
      });
    }

    const order = await Order.create({
      userId: req.user.id,

      items,

      address,

      totalAmount: totalProductsPrice,

      paymentMethod: paymentMethod || "Razorpay",

      paymentStatus: "Paid",

      razorpayOrderId: razorpay_order_id,

      razorpayPaymentId: razorpay_payment_id,

      razorpaySignature: razorpay_signature,
    });

    res.status(200).json({
      success: true,
      message: "Payment Successful",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const findAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items.product").sort({ createdAt: -1 }); 
    if (!orders) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }  
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
