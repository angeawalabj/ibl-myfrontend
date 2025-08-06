'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

interface Company {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  average_rating: number;
}

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/companies/${id}/`)
      .then((response) => setCompany(response.data))
      .catch((error) => console.error('Error fetching company:', error));
  }, [id]);

  const handleContact = async () => {
    if (!user) {
      alert('Please log in to contact this company.');
      return;
    }
    try {
      await api.post(`/companies/${id}/contact/`, { message: 'Interested in your services!' });
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message.');
    }
  };

  if (!company) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <Card title={company.name}>
        <p className="text-gray-600 mb-4">{company.description}</p>
        <p className="text-sm text-gray-500">Category: {company.category}</p>
        <p className="text-sm text-gray-500">Address: {company.address}</p>
        <p className="text-sm text-gray-500">Phone: {company.phone}</p>
        <p className="text-sm text-gray-500">Email: {company.email}</p>
        <p className="text-sm text-gray-500">Average Rating: {company.average_rating || 'No reviews'}</p>
        <Button onClick={handleContact} variant="primary" className="mt-4">Contact Company</Button>
      </Card>
    </div>
  );
}