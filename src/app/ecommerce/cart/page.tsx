'use client';
import { useCart } from '@/hooks/useCart';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { CartItemList } from '@/components/ecommerce/CartItemList';

export default function CartPage() {
  const { cart, loading, error, removeFromCart, updateQuantity, getTotal } = useCart();
  const { user } = useAuth();

  if (!user) return <div className="container mx-auto py-8">Please log in to view your cart.</div>;
  if (loading) return <div className="container mx-auto py-8">Loading...</div>;
  if (error) return <div className="container mx-auto py-8 text-error-color">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <CartItemList
            cart={cart}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
          />
          <Card title="Summary" className="mt-6">
            <p className="text-gray-600 mb-4">Total: ${getTotal()}</p>
            <Link href="/ecommerce/checkout">
              <Button variant="primary">Proceed to Checkout</Button>
            </Link>
          </Card>
        </>
      )}
    </div>
  );
}
