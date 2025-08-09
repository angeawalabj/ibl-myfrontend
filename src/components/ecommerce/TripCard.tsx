
import { Trip } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import Link from 'next/link';

interface TripCardProps {
  trip: Trip;
}

export const TripCard = ({ trip }: TripCardProps) => {
  return (
    <Card title={`${trip.departure} to ${trip.destination}`}>
      <p className="text-gray-600 mb-4">Price: ${trip.price}</p>
      <p className="text-sm text-gray-500">Company: ${trip.company}</p>
      <Link href={`/ecommerce/trips/${trip.id}`}>
        <Button variant="primary" className="mt-4">View Details</Button>
      </Link>
    </Card>
  );
};