import React, {useContext, useEffect} from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {CartContext} from "./contextAPI/cartContext.jsx";

const ProductCard = ({ item }) => {
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
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCartItems();
      }
      if (data.cartExists) {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
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
      <div className="image">
        <img src={item.image} alt={item.name} />
      </div>

      <h3 className="product-title">{item.name}</h3>
      <div className="weight">
        {item.quantity} {item.unit}
      </div>
      <div className="price">Rs. {item.price}</div>

      <button className="add-to-cart" onClick={() => handleCart(item._id)}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
