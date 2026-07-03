import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const categories = await Product.distinct("category");

    res.json({
      success: true,
      stats: {
        products: totalProducts,
        orders: totalOrders,
        categories: categories.length,
        revenue: revenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};