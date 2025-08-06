'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    api.get('/companies/', { params: { category } })
      .then((response) => setCompanies(response.data))
      .catch((error) => console.error('Error fetching companies:', error));
  }, [category]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Companies</h1>
      <div className="mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Categories</option>
          <option value="technology">Technology</option>
          <option value="education">Education</option>
          <option value="transport">Transport</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card key={company.id} title={company.name}>
            <p className="text-gray-600 mb-4">{company.description}</p>
            <p className="text-sm text-gray-500">Category: {company.category}</p>
            <Link href={`/companies/${company.id}`}>
              <Button variant="primary" className="mt-4">View Details</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}