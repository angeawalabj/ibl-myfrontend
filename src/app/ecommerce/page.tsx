'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { TripCard } from '@/components/ecommerce/TripCard';
import { ProductCard } from '@/components/ecommerce/ProductCard';
//import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface Trip {
  id: string;
  departure: string;
  destination: string;
  price: number;
  company: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export default function EcommercePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>('');
  //const { user } = useAuth();

  useEffect(() => {
    api.get('/ecommerce/trips/', { params: { category } })
      .then((response) => setTrips(response.data))
      .catch((error) => console.error('Error fetching trips:', error));
    api.get('/ecommerce/products/', { params: { category } })
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, [category]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">E-Commerce</h1>
      <div className="mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-input"
        >
          <option value="">All Categories</option>
          <option value="travel">Travel</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
        </select>
      </div>
      {/*<h2 className="text-2xl font-semibold mb-4">Bus Trips</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
      <h2 className="text-2xl font-semibold mb-4 mt-8">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          //<ProductCard key={product.id} product={product} />
        ))}
      </div>
      {!user && (
        <div className="mt-8 text-center">
          <p className="mb-4">Please log in to add items to your cart.</p>
          <Link href="/login">
            <Button variant="primary">Login</Button>
          </Link>
        </div>
      )}*/}
    </div>
  );
}