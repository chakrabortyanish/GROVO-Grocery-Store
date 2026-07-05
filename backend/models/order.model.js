import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        itemTotal: Number,
        cartQuantity: Number,
      },
    ],

    address: {
      fullName: String,
      area: String,
      city: String,
      state: String,
      pin: String,
      phone: String,
    },

    totalAmount: Number,

    paymentMethod: String,

    paymentStatus: String,
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
