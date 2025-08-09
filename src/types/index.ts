
export interface Company {
  id: string;
  name: string;
  description: string;
  category: string;
  address?: string;
  phone?: string;
  email?: string;
  average_rating?: number;
}

export interface Review {
  id: string;
  company: string;
  user: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  is_2fa_enabled: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  file_url: string;
  is_accessible: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  company: string;
  is_enrolled: boolean;
}

export interface Module {
  id: string;
  course: string;
  title: string;
  content: string;
  order: number;
}

export interface Exercise {
  id: string;
  module: string;
  question: string;
  answer?: string;
  is_submitted: boolean;
}

export interface Certificate {
  id: string;
  course: string;
  user: string;
  issued_at: string;
  pdf_url: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  company: string;
}

export interface Opportunity {
  id: string;
  service: string;
  title: string;
  description: string;
  requirements: string;
  deadline: string;
}

export interface Application {
  id: string;
  opportunity: string;
  user: string;
  resume: string;
  cover_letter: string;
  status: string;
}

export interface Trip {
  id: string;
  departure: string;
  destination: string;
  departure_time: string;
  price: number;
  company: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  company: string;
}

export interface CartItem {
  id: string;
  item_id: string;
  item_type: 'trip' | 'product';
  quantity: number;
}

export interface Order {
  id: string;
  user: string;
  items: CartItem[];
  total: number;
  status: string;
  payment_intent?: string;
}
