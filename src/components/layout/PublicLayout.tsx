'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        // Admin pages: no header/footer, no pt-32
        return <main className="flex-grow">{children}</main>;
    }

    return (
        <>
            <Header />
            <main className="flex-grow pt-32">{children}</main>
            <Footer />
        </>
    );
}
