'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Trip, Product, Order } from '@/types';

export const useEcommerce = (category?: string) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/ecommerce/trips/', { params: { category } }),
      api.get('/ecommerce/products/', { params: { category } }),
    ])
      .then(([tripsResponse, productsResponse]) => {
        setTrips(tripsResponse.data);
        setProducts(productsResponse.data);
      })
      .catch((err) => setError('Failed to fetch ecommerce data'))
      .finally(() => setLoading(false));
  }, [category]);

  const getOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/ecommerce/orders/');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  return { trips, products, orders, getOrders, loading, error };
};
