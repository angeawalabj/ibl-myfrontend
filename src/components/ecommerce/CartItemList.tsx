import { CartItem } from '@/types';
import { Button } from '@/components/common/Button';

interface CartItemListProps {
  cart: CartItem[];
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

export const CartItemList = ({ cart, onRemove, onUpdateQuantity }: CartItemListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {cart.map((item) => (
        <div key={item.id} className="card-container">
          <p className="text-gray-600">{item.item_type === 'trip' ? 'Trip' : 'Product'} ID: {item.item_id}</p>
          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
          <div className="flex items-center mt-2">
            <Button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              variant="secondary"
              className="mr-2"
              disabled={item.quantity <= 1}
            >
              -
            </Button>
            <Button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              variant="secondary"
              className="mr-2"
            >
              +
            </Button>
            <Button onClick={() => onRemove(item.id)} variant="danger">Remove</Button>
          </div>
        </div>
      ))}
    </div>
  );
};
