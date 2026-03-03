import type { Metadata } from 'next';
import { Cinzel_Decorative, Architects_Daughter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import PublicLayout from '@/components/layout/PublicLayout';

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
  title: {
    default: 'Le Petit Coin Magique - Artisanat Ésotérique & Créations Féériques',
    template: '%s | Le Petit Coin Magique'
  },
  description: 'Découvrez l\'échoppe mystique de Tavannes : artisanat local, chaudrons de sorcière, poterie médiévale, bijoux énergétiques et forge d\'art. Un univers magique au cœur du Jura Bernois, Suisse.',
  keywords: ['artisanat magique', 'échoppe ésotérique', 'Tavannes', 'Jura Bernois', 'chaudrons', 'poterie artisanale', 'bijoux spirituels', 'forge d\'art', 'Suisse artisanat', 'cadeau original', 'monde féérique'],
  authors: [{ name: 'Le Petit Coin Magique' }],
  creator: 'Le Petit Coin Magique',
  openGraph: {
    type: 'website',
    locale: 'fr_CH',
    url: 'https://lepetitcoinmagique.ch',
    title: 'Le Petit Coin Magique - Artisanat Ésotérique & Créations Féériques',
    description: 'Boutique artisanale spécialisée dans les objets magiques et spirituels à Tavannes. Forge, poterie, bijoux et curiosités.',
    siteName: 'Le Petit Coin Magique',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Petit Coin Magique - Artisanat Ésotérique',
    description: 'Objets magiques et créations artisanales uniques à Tavannes, Jura Bernois.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  }
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
          <PublicLayout>{children}</PublicLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
