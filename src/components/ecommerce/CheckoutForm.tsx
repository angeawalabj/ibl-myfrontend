'use client';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { initializeStripe } from '@/lib/stripe';
import api from '@/lib/api';

export const CheckoutForm = () => {
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
      const stripe = await initializeStripe();
      if (!stripe) throw new Error('Stripe failed to load');

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: clientSecret });
      if (stripeError) throw new Error(stripeError.message);

      clearCart();
    } catch (err) {
      setError('Failed to process payment.');
    }
  };

  return (
    <div className="form-container">
      {error && <p className="error-text">{error}</p>}
      <p className="text-gray-600 mb-4">Total: ${getTotal()}</p>
      <Button onClick={handleCheckout} variant="primary">Pay with Stripe</Button>
    </div>
  );
};
