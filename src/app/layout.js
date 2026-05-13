import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'SDecor | Premium Event Decorations in Patna',
  description: 'Book stunning balloon & floral decorations for birthdays, anniversaries, baby showers & more in Patna. Same-day service guaranteed. Lowest price promise.',
  keywords: 'event decoration, birthday decoration, anniversary decoration, baby shower, balloon decoration, Patna, SDecor',
  openGraph: {
    title: 'SDecor | Premium Event Decorations in Patna',
    description: 'Patna\'s most trusted event decoration service. 10,000+ happy customers.',
    siteName: 'SDecor',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-[#FAFAFA] text-gray-900`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
