import type { Metadata } from 'next';
import { Cinzel_Decorative, Architects_Daughter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

const cinzel = Cinzel_Decorative({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-cinzel-google',
  display: 'swap',
});

const architects = Architects_Daughter({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-architects-google',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Le Petit Coin Magique - Artisanat féérique',
  description: 'Créations artisanales, chaudrons, poterie, forge, bijoux. Un monde magique dans le Jura Bernois.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${cinzel.variable} ${architects.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-architects">
        <AuthProvider>
          <Header />
          <main className="flex-grow pt-32">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
