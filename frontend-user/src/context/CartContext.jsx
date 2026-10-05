import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { cartAPI } from '../api/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const EMPTY_TOTALS = { totalItems: 0, total: 0 };

// The cart endpoints return { cart, total_items, total } — the totals sit next
// to `cart`, not inside it. Fall back to summing items if they are missing.
const totalsFrom = (data) => {
  const items = data?.cart?.items || [];
  return {
    totalItems: Number(data?.total_items ?? items.reduce((n, i) => n + Number(i.quantity || 0), 0)),
    total: Number(data?.total ?? 0),
  };
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [totals, setTotals] = useState(EMPTY_TOTALS);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const apply = useCallback((data) => {
    setCart(data?.cart ?? null);
    setTotals(totalsFrom(data));
    return data;
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      apply(await cartAPI.getCart());
    } catch (error) {
      console.error('Failed to fetch cart:', error.message);
    } finally {
      setLoading(false);
    }
  }, [apply]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Signed out: never show the previous user's cart.
      setCart(null);
      setTotals(EMPTY_TOTALS);
    }
  }, [isAuthenticated, fetchCart]);

  const addToCart = async (productId, quantity = 1) => apply(await cartAPI.addItem(productId, quantity));

  const updateCartItem = async (itemId, quantity) => apply(await cartAPI.updateItem(itemId, quantity));

  const removeFromCart = async (itemId) => apply(await cartAPI.removeItem(itemId));

  const clearCart = async () => {
    await cartAPI.clearCart();
    setCart(null);
    setTotals(EMPTY_TOTALS);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
    totalItems: totals.totalItems,
    total: totals.total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
