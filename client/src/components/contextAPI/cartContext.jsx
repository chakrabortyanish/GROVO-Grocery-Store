import React from 'react';
import { createContext, useState, useEffect } from 'react';

import { jwtDecode } from "jwt-decode";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartCount, setCartCount] = useState(0);

  const [user, setUser] = useState(() => {

    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {

    const stored =
      JSON.parse(localStorage.getItem("items")) || [];

    setCartCount(stored.length);

  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        setCartCount,

        user,
        setUser,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
