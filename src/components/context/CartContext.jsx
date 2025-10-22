
import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [data, setData] = useState([]);

  return (
    <CartContext.Provider value={{ data, setData }}>
      {children}
    </CartContext.Provider>
  );
};
