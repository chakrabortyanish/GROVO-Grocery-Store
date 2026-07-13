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

    orderStatus: {
      type: String,
      default: "",
    },

    paymentMethod: {
        type:String,
        default:"Razorpay"
    },

    paymentStatus: {
      type: String,
      enum: ["Paid"],
      default: "Paid",
    },

    // Razorpay Details
    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
