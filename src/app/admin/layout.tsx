'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutDashboard, Package, ShoppingBag, Users, LogOut, ChevronRight, Settings
} from 'lucide-react';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Produits', icon: Package },
    { href: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
    { href: '/admin/customers', label: 'Clients', icon: Users },
    { href: '/admin/settings', label: 'Paramètres', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [user, loading, pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#b38b59] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user && pathname !== '/admin/login') return null;
    if (pathname === '/admin/login') return <>{children}</>;

    return (
        <div className="min-h-screen bg-[#fdfaf6] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-50 shadow-sm">
                {/* Brand */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#b38b59]/30 flex-shrink-0">
                            <Image
                                src="https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/fb_img_1747862163342-1-high.jpg"
                                alt="Le Petit Coin Magique"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <p className="font-cinzel text-[#4a2128] text-sm tracking-widest">ADMIN</p>
                            <p className="text-gray-400 text-xs font-architects">Le Petit Coin Magique</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-[#4a2128]/5 text-[#4a2128] border border-[#4a2128]/10'
                                    : 'text-gray-500 hover:text-[#4a2128] hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={18} className={isActive ? 'text-[#b38b59]' : ''} />
                                <span className="font-architects text-sm">{item.label}</span>
                                {isActive && <ChevronRight size={14} className="ml-auto text-[#b38b59]" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User + Logout */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#4a2128]/10 flex items-center justify-center text-[#4a2128] text-xs font-bold flex-shrink-0">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-gray-700 text-sm font-architects truncate">{user?.email}</p>
                            <p className="text-gray-400 text-xs">Administrateur</p>
                        </div>
                    </div>
                    <button
                        onClick={async () => { await logout(); router.push('/admin/login'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                    >
                        <LogOut size={18} />
                        <span className="font-architects text-sm">Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="ml-64 flex-1 min-h-screen bg-[#fdfaf6]">
                {children}
            </main>
        </div>
    );
}
