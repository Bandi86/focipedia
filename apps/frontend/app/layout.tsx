import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Added Inter font import

import './globals.css';
import { Providers } from './providers';
import Navbar from '../components/Navbar'; // Import the Navbar component

const inter = Inter({ subsets: ['latin'] }); // Initialize Inter font

export const metadata: Metadata = {
  title: 'Focipedia Admin', // Updated title
  description: 'Admin panel for Focipedia', // Updated description
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {' '}
        {/* Added className */}
        <Navbar /> {/* Add the Navbar here */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
