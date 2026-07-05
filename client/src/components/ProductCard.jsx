import React from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();

  const userToken = localStorage.getItem("token");
  if (!userToken) {
    toast.error("Please login first");
    setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
  }

  const handleCart = async (productId) => {
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
        }
      );

      if (data.success) {
        toast.success(data.message);
      }
      if (data.cartExists) {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="itemInfo">
      <div className="image">
        <img src={item.image} alt={item.name} />
      </div>

      <h3>{item.name}</h3>
      <div className="weight">
        {item.quantity} {item.unit}
      </div>
      <div className="price">Rs. {item.price}</div>

      <button className="add-to-cart" onClick={() => handleCart(item._id)}>
        Add to Cart
      </button>
      <ToastContainer />
    </div>
  );
};

export default ProductCard;
