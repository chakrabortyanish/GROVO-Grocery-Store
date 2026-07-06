import React from "react";
import { createContext, useState } from "react";

import { jwtDecode } from "jwt-decode";

// eslint-disable-next-line react-refresh/only-export-components
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
      return error;
    }
  });

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
