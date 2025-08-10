import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header  from '@/components/layout/Header';
import  Footer  from '@/components/layout/Footer';
import MobileBottomBar from '@/components/layout/MobileBottomBar';
import { NotificationsProvider } from "@/context/NotificationsContext";
import { AuthProvider } from '@/hooks/useAuth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Multi-Service Platform',
  description: 'Platform for companies, reviews, library, e-learning, services, and e-commerce',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationsProvider>
        <Header />
       {/* <AuthContext.Provider value={{ user, login, logout, register }}>
          
          <main className="min-h-screen">*/} {children}{/*</main>
          
        </AuthProvider>*/}
        <Footer />
        <MobileBottomBar />
        </NotificationsProvider>
      </body>
    </html>
  );
}