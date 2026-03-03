'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Package, ShoppingBag, Users, TrendingUp, ArrowRight } from 'lucide-react';

interface Stats { products: number; orders: number; customers: number; revenue: number; }

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, customers: 0, revenue: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [prodSnap, orderSnap] = await Promise.all([
                    getDocs(collection(db, 'products')),
                    getDocs(collection(db, 'orders')),
                ]);
                const orders = orderSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

                // On ne compte que les commandes "réelles" (payées ou confirmées)
                const validOrders = orders.filter(o =>
                    o.status === 'paid' ||
                    o.status === 'shipped' ||
                    o.status === 'delivered' ||
                    o.status === 'cancelled'
                );

                // CA Total : Uniquement les commandes payées ou livrées (pas annulées)
                const revenueStatus = ['paid', 'shipped', 'delivered'];
                const revenue = orders
                    .filter(o => revenueStatus.includes(o.status))
                    .reduce((s, o) => s + (o.total || 0), 0);

                const emails = new Set(validOrders.map((o: any) => o.customerEmail).filter(Boolean));

                setStats({
                    products: prodSnap.size,
                    orders: validOrders.length,
                    customers: emails.size,
                    revenue
                });

                const sorted = [...validOrders].sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
                setRecentOrders(sorted.slice(0, 5));
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const statCards = [
        { label: 'Produits', value: stats.products, icon: Package, color: 'bg-[#4a2128]/5 text-[#4a2128]', iconColor: 'text-[#4a2128]', href: '/admin/products' },
        { label: 'Commandes', value: stats.orders, icon: ShoppingBag, color: 'bg-[#b38b59]/10 text-[#b38b59]', iconColor: 'text-[#b38b59]', href: '/admin/orders' },
        { label: 'Clients', value: stats.customers, icon: Users, color: 'bg-blue-50 text-blue-600', iconColor: 'text-blue-500', href: '/admin/customers' },
        { label: 'CA Total', value: `${stats.revenue.toFixed(2)} CHF`, icon: TrendingUp, color: 'bg-green-50 text-green-600', iconColor: 'text-green-500', href: '/admin/orders' },
    ];

    const STATUS_COLORS: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        paid: 'bg-green-100 text-green-700',
        shipped: 'bg-blue-100 text-blue-700',
        delivered: 'bg-emerald-100 text-emerald-700',
        cancelled: 'bg-red-100 text-red-700',
    };
    const STATUS_LABELS: Record<string, string> = {
        pending: 'En attente', paid: 'Payée', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée',
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="font-cinzel text-3xl text-[#4a2128] tracking-widest uppercase">Dashboard</h1>
                <p className="text-gray-500 font-architects mt-1">Bienvenue dans votre espace de gestion</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.label} href={card.href}>
                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                                    <Icon size={20} />
                                </div>
                                {loading ? (
                                    <div className="h-7 w-16 bg-gray-100 rounded animate-pulse mb-1" />
                                ) : (
                                    <p className="font-cinzel text-2xl text-gray-800 font-bold">{card.value}</p>
                                )}
                                <p className="text-gray-500 text-sm font-architects">{card.label}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Recent orders */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-cinzel text-lg text-[#4a2128] uppercase tracking-widest">Commandes récentes</h2>
                    <Link href="/admin/orders" className="text-[#b38b59] font-architects text-sm flex items-center gap-1 hover:underline">
                        Voir tout <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="divide-y divide-gray-50">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-4 p-5">
                                <div className="flex-1 h-4 bg-gray-100 rounded animate-pulse" />
                                <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
                            </div>
                        ))
                    ) : recentOrders.length === 0 ? (
                        <div className="p-12 text-center">
                            <ShoppingBag size={36} className="text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 font-architects">Aucune commande pour le moment</p>
                        </div>
                    ) : (
                        recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center gap-4 p-5 hover:bg-gray-50/50 transition-colors">
                                <div className="flex-1">
                                    <p className="font-architects text-gray-800 text-sm">{order.customerName || 'Invité'}</p>
                                    <p className="text-gray-400 text-xs">{order.customerEmail}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-architects font-medium ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                                    {STATUS_LABELS[order.status] || 'En attente'}
                                </span>
                                <span className="font-architects font-bold text-[#b38b59] text-sm">{(order.total || 0).toFixed(2)} CHF</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
