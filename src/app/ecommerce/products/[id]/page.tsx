'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  company: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/ecommerce/products/${id}/`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error('Error fetching product:', error));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    addToCart({ item_id: id as string, item_type: 'product', quantity: 1 });
    alert('Product added to cart!');
  };

  if (!product) return <div className="container mx-auto py-8">Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <Card title={product.name}>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-sm text-gray-500">Price: ${product.price}</p>
        <p className="text-sm text-gray-500">Category: {product.category}</p>
        <p className="text-sm text-gray-500">Company: {product.company}</p>
        <Button onClick={handleAddToCart} variant="primary" className="mt-4">Add to Cart</Button>
      </Card>
    </div>
  );
}