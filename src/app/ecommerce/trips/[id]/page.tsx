'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

interface Trip {
  id: string;
  departure: string;
  destination: string;
  departure_time: string;
  price: number;
  company: string;
}

export default function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/ecommerce/trips/${id}/`)
      .then((response) => setTrip(response.data))
      .catch((error) => console.error('Error fetching trip:', error));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    addToCart({ item_id: id as string, item_type: 'trip', quantity: 1 });
    alert('Trip added to cart!');
  };

  if (!trip) return <div className="container mx-auto py-8">Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <Card title={`${trip.departure} to ${trip.destination}`}>
        <p className="text-gray-600 mb-4">Price: ${trip.price}</p>
        <p className="text-sm text-gray-500">Departure: {new Date(trip.departure_time).toLocaleString()}</p>
        <p className="text-sm text-gray-500">Company: {trip.company}</p>
        <Button onClick={handleAddToCart} variant="primary" className="mt-4">Add to Cart</Button>
      </Card>
    </div>
  );
}
