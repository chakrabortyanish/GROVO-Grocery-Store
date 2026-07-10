import Order from "../models/order.model.js";
import jwt from "jsonwebtoken";
import razorpay from "../config/razorpay.js";
import Product from "../models/product.model.js";
import crypto from "crypto";

import PDFDocument from "pdfkit";

// ============================
// CREATE ORDER
// ============================

export const createOrder = async (req, res) => {
  try {
    const { totalProductsPrice, items } = req.body;

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
    const orders = await Order.find({ userId: req.user.id })
      .populate("userId")
      .populate("items.product")
      .sort({ createdAt: -1 });
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

// download invoice

// Helper function to fetch remote images safely as an ArrayBuffer (Works for both product images and logo URL)
const fetchImageBuffer = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image");
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`Error loading image from ${url}:`, error);
    return null;
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    // Populating both the items' products AND the user's details
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("userId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${order.razorpayOrderId}.pdf`,
    );

    doc.pipe(res);

    // --- COLOR PALETTE ---
    const primaryColor = "#16a34a";
    const darkTextColor = "#1f2937";
    const lightTextColor = "#4b5563";
    const tableHeaderBg = "#f3f4f6";
    const tableRowAlternateBg = "#f9fafb";
    const dividerColor = "#e5e7eb";

    // --- BRAND HEADER SECTION WITH ONLINE LOGO ---
    const logoUrl = "https://grovo-grocery-store.vercel.app/image.png";
    const logoBuffer = await fetchImageBuffer(logoUrl);

    if (logoBuffer) {
      try {
        // Render the logo image
        doc.image(logoBuffer, 50, 32, { width: 50 });

        // Move text to X: 115 to clear the logo, and align perfectly with the top of the logo (Y: 45)
        doc
          .font("Helvetica-Bold")
          .fontSize(28)
          .fillColor(primaryColor)
          .text("GROVO", 115, 45);

        // Let the text flow naturally below "GROVO" without hardcoding a broken Y coordinate
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(lightTextColor)
          .text("Premium Grocery & Stationary Store");
      } catch (imgErr) {
        console.error("Failed to render logo buffer:", imgErr);
      }
    } else {
      // Fallback clean text styling if the network fetch fails
      doc
        .font("Helvetica-Bold")
        .fontSize(28)
        .fillColor(primaryColor)
        .text("GROVO", 50, 45);
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(lightTextColor)
        .text("Premium Grocery & Stationary Store", 50, 75);
    }

    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor(darkTextColor)
      .text("INVOICE", 400, 45, { align: "right" });
    doc.moveDown(2);

    const currentY = doc.y;
    doc
      .strokeColor(dividerColor)
      .lineWidth(1)
      .moveTo(50, currentY)
      .lineTo(545, currentY)
      .stroke();
    doc.moveDown(1);

    // --- METADATA INFORMATION BLOCK (2 COLUMNS) ---
    const metaY = doc.y;

    // Left Column: Core Invoice Info
    doc
      .font("Helvetica-Bold")
      .fillColor(darkTextColor)
      .fontSize(11)
      .text("Invoice Details", 50, metaY);
    doc.font("Helvetica").fontSize(9).fillColor(lightTextColor);
    doc.text(
      `Invoice ID: INV-${order.razorpayOrderId.toString().slice(-6)}`,
      50,
      doc.y + 4,
    );
    doc.text(`Order ID: ${order.razorpayOrderId}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Payment Method: ${order.paymentMethod}`);
    doc.text(`Payment Status: ${order.paymentStatus}`);
    if (order.razorpayPaymentId) {
      doc.text(`Transaction ID: ${order.razorpayPaymentId}`);
    }

    // Right Column: Customer & Shipping Destination
    doc
      .font("Helvetica-Bold")
      .fillColor(darkTextColor)
      .fontSize(11)
      .text("Bill To:", 320, metaY);
    doc.font("Helvetica").fontSize(9).fillColor(lightTextColor);

    const customerName =
      order.userId.firstName + " " + order.userId.lastName || "Valued Customer";
    doc.font("Helvetica-Bold").fillColor(darkTextColor).text(customerName, 350, doc.y + 4);
    doc.font("Helvetica").fillColor(darkTextColor);
    doc.text(`${order.address.area}, ${order.address.city}`);
    doc.text(`${order.address.state} - ${order.address.pin}`);
    doc.text(`Phone: +91 ${order.address.phone}`);

    // --- DELIVERY STATUS DETAILS BOX ---
    doc.moveDown(4);
    const deliveryY = doc.y;
    doc.rect(50, deliveryY, 495, 30).fill("#f0fdf4");
    doc
      .font("Helvetica-Bold")
      .fillColor(primaryColor)
      .fontSize(9)
      .text("Estimated Delivery:", 60, deliveryY + 10);
    doc
      .font("Helvetica")
      .fillColor(darkTextColor)
      .text(
        " Your items are verified and packed. Delivery will be completed within 5 days.",
        155,
        deliveryY + 10,
      );

    doc.moveDown(2);

    // --- PRODUCT MATRIX HEADER ---
    const tableTop = doc.y;

    doc.rect(50, tableTop, 495, 25).fill(tableHeaderBg);
    doc.font("Helvetica-Bold").fillColor(darkTextColor).fontSize(10);
    doc.text("Item", 60, tableTop + 8);
    doc.text("Product Details", 125, tableTop + 8);
    doc.text("Price", 350, tableTop + 8, { width: 50, align: "right" });
    doc.text("Qty", 420, tableTop + 8, { width: 40, align: "center" });
    doc.text("Total", 480, tableTop + 8, { width: 65, align: "right" });

    let itemY = tableTop + 25;

    for (let i = 0; i < order.items.length; i++) {
      const item = order.items[i];

      if (i % 2 === 1) {
        doc.rect(50, itemY, 495, 45).fill(tableRowAlternateBg);
      }

      if (item.product.image) {
        const imageBuffer = await fetchImageBuffer(item.product.image);
        if (imageBuffer) {
          try {
            doc.image(imageBuffer, 60, itemY + 5, { fit: [35, 35] });
          } catch (imgErr) {
            console.error("Could not mount product image:", imgErr);
          }
        }
      }

      doc.font("Helvetica").fillColor(darkTextColor).fontSize(10);
      doc.text(item.product.name, 125, itemY + 12, {
        width: 210,
        height: 25,
        ellipsis: true,
      });
      doc
        .fontSize(8)
        .fillColor(lightTextColor)
        .text(
          `Category: ${item.product.category || "General"}`,
          125,
          itemY + 26,
        );

      doc.fontSize(10).fillColor(darkTextColor);
      doc.text(`₹${item.product.price}`, 350, itemY + 18, {
        width: 50,
        align: "right",
      });
      doc.text(`${item.cartQuantity}`, 420, itemY + 18, {
        width: 40,
        align: "center",
      });
      doc.text(`₹${item.itemTotal}`, 480, itemY + 18, {
        width: 65,
        align: "right",
      });

      doc
        .strokeColor(dividerColor)
        .lineWidth(0.5)
        .moveTo(50, itemY + 45)
        .lineTo(545, itemY + 45)
        .stroke();
      itemY += 45;
    }

    // --- ACCUMULATIVE TOTALS CALCULATION BOX ---
    doc.moveDown(2);
    const totalsY = doc.y;

    doc
      .strokeColor(primaryColor)
      .lineWidth(1)
      .moveTo(350, totalsY)
      .lineTo(545, totalsY)
      .stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(darkTextColor)
      .text("Grand Total:", 350, totalsY + 10);
    doc
      .fontSize(14)
      .fillColor(primaryColor)
      .text(`₹${order.totalAmount}`, 450, totalsY + 8, {
        width: 95,
        align: "right",
      });

    // --- OWNER SIGNATURE SECTION ---
    doc.moveDown(3);
    const sigY = doc.y;
    
    const signatureUrl = "https://grovo-grocery-store.vercel.app/anish.signature.png"; 
    const signatureBuffer = await fetchImageBuffer(signatureUrl);

    if (signatureBuffer) {
      try {
        doc.image(signatureBuffer, 420, sigY, { fit: [100, 55] });
      } catch (sigErr) {
        console.error("Failed to render signature buffer:", sigErr);
      }
    }

    // Moved up from sigY + 50 to sigY + 35 to close the gap
    doc
      .strokeColor(dividerColor)
      .lineWidth(1)
      .moveTo(400, sigY + 35)
      .lineTo(545, sigY + 35)
      .stroke();

    // Moved up from sigY + 55 to sigY + 40
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(darkTextColor)
      .text("Authorized Signatory", 400, sigY + 40, { width: 145, align: "center" });

    // --- FINAL FOOTER MESSAGE ---
    doc.moveDown(4);
    doc
      .font("Helvetica")
      .fillColor("gray")
      .fontSize(10)
      .text("Thank you for shopping with Grovo!", 50, doc.y, {
        align: "center",
      });

    doc
      .fontSize(8)
      .text(
        "If you have any questions regarding this invoice, please contact support.",
        { align: "center" },
      );

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
