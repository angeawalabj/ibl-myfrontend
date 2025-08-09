import { Product } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card title={product.name}>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p className="text-sm text-gray-500">Price: ${product.price}</p>
      <p className="text-sm text-gray-500">Category: ${product.category}</p>
      <Link href={`/ecommerce/products/${product.id}`}>
        <Button variant="primary" className="mt-4">View Details</Button>
      </Link>
    </Card>
  );
};