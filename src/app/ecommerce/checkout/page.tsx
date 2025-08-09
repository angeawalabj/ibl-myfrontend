'use client';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { loadStripe } from '@stripe/stripe-js';
import api from '@/lib/api';
import { requestNotificationPermission } from '@/lib/firebase';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [error, setError] = useState<string>('');

  const handleCheckout = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    try {
      const response = await api.post('/ecommerce/orders/', { items: cart });
      const { clientSecret } = response.data;
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: clientSecret });
      if (stripeError) throw new Error(stripeError.message);

      const token = await requestNotificationPermission();
      if (token) {
        await api.post('/users/notify/', {
          token,
          message: 'Your order has been placed successfully!',
        });
      }
      clearCart();
    } catch (err) {
      setError('Failed to process payment.');
    }
  };

  if (!user) return <div className="container mx-auto py-8">Please log in to checkout.</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <Card title="Order Summary">
        {error && <p className="error-text">{error}</p>}
        <p className="text-gray-600 mb-4">Total: ${getTotal()}</p>
        <Button onClick={handleCheckout} variant="primary">Pay with Stripe</Button>
      </Card>
    </div>
  );
}
