import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart as fetchCartApi, addToCart as addToCartApi, updateCartQuantity as updateQuantityApi, removeFromCart as removeFromCartApi } from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  const fetchCart = async () => {
    setCartLoading(true);
    setCartError(null);
    try {
      const response = await fetchCartApi();
      if (response.data && response.data.success) {
        setCartItems(response.data.cart);
      }
    } catch (error) {
      setCartError(error.response?.data?.message || 'Failed to fetch cart');
      // If unauthorized, clear cart
      if (error.response?.status === 401) {
        setCartItems([]);
      }
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId) => {
    setCartLoading(true);
    setCartError(null);
    try {
      const response = await addToCartApi(productId);
      if (response.data && response.data.success) {
        setCartItems(response.data.cart);
      }
    } catch (error) {
      setCartError(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setCartLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setCartLoading(true);
    setCartError(null);
    try {
      const response = await updateQuantityApi(productId, quantity);
      if (response.data && response.data.success) {
        setCartItems(response.data.cart);
      }
    } catch (error) {
      setCartError(error.response?.data?.message || 'Failed to update quantity');
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setCartLoading(true);
    setCartError(null);
    try {
      const response = await removeFromCartApi(productId);
      if (response.data && response.data.success) {
        setCartItems(response.data.cart);
      }
    } catch (error) {
      setCartError(error.response?.data?.message || 'Failed to remove from cart');
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{
      cartItems: cartItems || [],
      cartLoading,
      cartError,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
