import Order from "../models/order.model.js";
import jwt from "jsonwebtoken";

export const createOrder = async (req, res) => {
  try {
    const { items, address, totalAmount, paymentMethod, paymentStatus } =
      req.body;

    const newOrder = new Order({
      userId: req.user.id, // from verifyToken middleware
      items,
      address,
      totalAmount,
      paymentMethod,
      paymentStatus,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const findAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 }); 
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
