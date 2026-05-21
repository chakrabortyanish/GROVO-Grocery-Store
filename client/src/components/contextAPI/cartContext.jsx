import React from 'react';
import { createContext, useState, useEffect } from 'react';

import { jwtDecode } from "jwt-decode";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  
  const token = localStorage.getItem("token") || "";
      if (token) {
        var decodedToken = jwtDecode(token);
      }
      const { firstName, lastName } = decodedToken || {};

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("items")) || [];
    setCartCount(stored.length);
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, firstName, lastName }}>
      {children}
    </CartContext.Provider>
  );
};
