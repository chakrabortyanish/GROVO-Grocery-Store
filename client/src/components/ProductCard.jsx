import React, { useContext, useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CartContext } from "./contextAPI/cartContext.jsx";

const ProductCard = ({ item }) => {
  const isInStock = item.inStock === "In Stock";

  // Helper function to safely parse and format JSON stringified pack items
  const formatPackItems = (packItems) => {
    if (!packItems) return "";
    try {
      const items =
        typeof packItems === "string" ? JSON.parse(packItems) : packItems;
      return Array.isArray(items) ? items.join(", ") : packItems;
    } catch (error) {
      return packItems; // Fallback if parsing fails or if it's already a plain string
    }
  };
  // console.log("ProductCard item:", item); // Log the item prop to check its value
  const navigate = useNavigate();
  const { setCartCount } = useContext(CartContext);

  const userToken = localStorage.getItem("token");

  const handleCart = async (productId) => {
    if (!userToken) {
      toast.error("Please login first");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        {
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          withCredentials: true,
        },
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCartItems();
      }
      if (data.cartExists) {
        toast.error(data.message);
      }
    } catch (error) {
      // console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart: " + error.response.data.message);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          withCredentials: true,
        },
      );

      if (data.success) {
        setCartCount(data.totalItems);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  return (
    <div className="itemInfo">
      {/* Stock Status Badge */}
      <div
        className={`stock-status ${isInStock ? "in-stock" : "out-of-stock"}`}
      >
        {isInStock ? "In Stock" : "Out of Stock"}
      </div>

      {/* Product Image */}
      <div className="image">
        <img src={item.image} alt={item.name} />
      </div>

      {/* Title */}
      <h3 className="product-title">{item.name}</h3>

      {/* Weight / Unit Badge */}
      <div className="weight">
        {item.quantity} {item.unit}
      </div>

      {/* Render Pack Items list if available */}
      {item.packItems && (
        <div className="pack-items-text">{formatPackItems(item.packItems)}</div>
      )}

      {/* Price */}
      <div className="price">Rs. {item.price}</div>

      {/* Action Button */}
      <button
        className="add-to-cart"
        onClick={() => handleCart && handleCart(item._id)}
        disabled={!isInStock}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
