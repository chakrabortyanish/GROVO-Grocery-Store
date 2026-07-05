import React from "react";
import { createContext, useState, useEffect } from "react";

import axios from "axios";

import { jwtDecode } from "jwt-decode";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [totalProductsPrice, setTotalProductsPrice] = useState(0);

  const userToken = localStorage.getItem("token");

  const [user, setUser] = useState(() => {
    if (!userToken) return null;

    try {
      return jwtDecode(userToken);
    } catch (error) {
      return null;
    }
  });

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
        setCartItems(data.totalItems);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        setCartCount,
        totalProductsPrice,
        setTotalProductsPrice,
        cartItems, setCartItems,
        user,
        setUser,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
