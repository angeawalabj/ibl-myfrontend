'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-primary-color text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Platform</Link>
        <nav className="space-x-4">
          <Link href="/companies">Companies</Link>
          <Link href="/library">Library</Link>
          <Link href="/elearning">E-Learning</Link>
          <Link href="/eservices">Services</Link>
          <Link href="/ecommerce">E-Commerce</Link>
          {user ? (
            <>
              <Link href="/profile">Profile</Link>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};