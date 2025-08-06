
import { Company } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import Link from 'next/link';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  return (
    <Card title={company.name}>
      <p className="text-gray-600 mb-4">{company.description}</p>
      <p className="text-sm text-gray-500">Category: {company.category}</p>
      <Link href={`/companies/${company.id}`}>
        <Button variant="primary" className="mt-4">View Details</Button>
      </Link>
    </Card>
  );
};
