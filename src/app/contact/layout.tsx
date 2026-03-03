import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contactez-nous - L\'Échoppe de Tavannes',
    description: 'Venez nous rendre visite à Tavannes (Jura Bernois). Horaires, adresse, téléphone et réseaux sociaux du Petit Coin Magique.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
