'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/common/Card';
import { useAuth } from '@/hooks/useAuth';
import { OrderCard } from '@/components/ecommerce/OrderCard';

interface Order {
  id: string;
  user: string;
  items: { id: string; item_id: string; item_type: 'trip' | 'product'; quantity: number }[];
  total: number;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      api.get('/ecommerce/orders/')
        .then((response) => setOrders(response.data))
        .catch((error) => console.error('Error fetching orders:', error));
    }
  }, [user]);

  if (!user) return <div className="container mx-auto py-8">Please log in to view your orders.</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
