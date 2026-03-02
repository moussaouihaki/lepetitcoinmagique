'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
    LayoutDashboard, Package, ShoppingBag, Users, LogOut, Sparkles, ChevronRight
} from 'lucide-react';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Produits', icon: Package },
    { href: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
    { href: '/admin/customers', label: 'Clients', icon: Users },
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
            <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#b38b59] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user && pathname !== '/admin/login') return null;

    if (pathname === '/admin/login') return <>{children}</>;

    return (
        <div className="min-h-screen bg-[#0d0d0d] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#111] border-r border-white/5 flex flex-col fixed h-full z-50">
                {/* Brand */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#b38b59]/20 border border-[#b38b59]/30 flex items-center justify-center">
                            <Sparkles size={16} className="text-[#b38b59]" />
                        </div>
                        <div>
                            <p className="font-cinzel text-white text-sm tracking-widest">ADMIN</p>
                            <p className="text-gray-600 text-xs font-architects">Le Petit Coin Magique</p>
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
                                        ? 'bg-[#b38b59]/15 text-[#b38b59] border border-[#b38b59]/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#b38b59]/20 flex items-center justify-center text-[#b38b59] text-xs font-bold">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-architects truncate">{user?.email}</p>
                            <p className="text-gray-600 text-xs">Administrateur</p>
                        </div>
                    </div>
                    <button
                        onClick={async () => { await logout(); router.push('/admin/login'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
                    >
                        <LogOut size={18} />
                        <span className="font-architects text-sm">Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="ml-64 flex-1 min-h-screen">
                {children}
            </main>
        </div>
    );
}
