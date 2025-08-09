import { Order } from '@/types';
import { Card } from '@/components/common/Card';

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <Card title={`Order #${order.id}`}>
      <p className="text-gray-600 mb-4">Total: ${order.total}</p>
      <p className="text-sm text-gray-500">Status: {order.status}</p>
      <p className="text-sm text-gray-500">Items: {order.items.length}</p>
    </Card>
  );
};