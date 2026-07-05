import { Cart } from "../models/cart.model.js";
import Product from "../models/product.model.js";

// add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    // Check if product is already in cart
    const productExists = cart.items.some(
      (item) => item.product.toString() === productId
    );

    if (productExists) {
      return res.status(400).json({
        success: false,
        message: "Product already in cart",
      });
    }

    // Add product
    cart.items.push({
      product: productId,
      cartQuantity: 1,
    });

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Added to cart",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get cart items
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("items.product");

    if (!cart) {
      return res.json({
        success: true,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
    }

    const items = cart.items.map((item) => ({
      productId: item.product._id,

      name: item.product.name,

      image: item.product.image,

      category: item.product.category,

      quantity: item.product.quantity,

      unit: item.product.unit,

      inStock: item.product.inStock,

      price: item.product.price,

      cartQuantity: item.cartQuantity,

      itemTotal:
        item.cartQuantity * item.product.price,
    }));

    const totalPrice = items.reduce(
      (acc, item) => acc + item.itemTotal,
      0
    );

    const totalItems = items.reduce(
      (acc, item) => acc + item.cartQuantity,
      0
    );

    res.json({
      success: true,
      items,
      totalPrice,
      totalItems,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// increase cart quantity
export const increaseCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart)
      return res.status(404).json({
        success: false,
      });

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item)
      return res.status(404).json({
        success: false,
      });

    item.cartQuantity++;

    await cart.save();

    res.json({
      success: true,
      message: "Quantity Increased",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


//decrease cart quantity
export const decreaseCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart)
      return res.status(404).json({
        success: false,
      });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1)
      return res.status(404).json({
        success: false,
      });

    if (cart.items[itemIndex].cartQuantity > 1) {
      cart.items[itemIndex].cartQuantity--;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    res.json({
      success: true,
      message: "Quantity Updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// remove item from cart
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart)
      return res.status(404).json({
        success: false,
      });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.json({
      success: true,
      message: "Item Removed",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};