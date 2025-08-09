'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { CartItem } from '@/types';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get('/ecommerce/cart/')
      .then((response) => setCart(response.data))
      .catch((err) => setError('Failed to fetch cart'))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = async (item: { item_id: string; item_type: 'trip' | 'product'; quantity: number }) => {
    setLoading(true);
    try {
      const response = await api.post('/ecommerce/cart/', item);
      setCart((prev) => [...prev, response.data]);
      setError(null);
    } catch (err) {
      setError('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    setLoading(true);
    try {
      await api.delete(`/ecommerce/cart/${itemId}/`);
      setCart((prev) => prev.filter((item) => item.id !== itemId));
      setError(null);
    } catch (err) {
      setError('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    setLoading(true);
    try {
      const response = await api.put(`/ecommerce/cart/${itemId}/`, { quantity });
      setCart((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
      setError(null);
    } catch (err) {
      setError('Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await api.delete('/ecommerce/cart/');
      setCart([]);
      setError(null);
    } catch (err) {
      setError('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.quantity * 100, 0); // Placeholder price calculation
  };

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, loading, error };
};
