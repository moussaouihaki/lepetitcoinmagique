'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Package, ShoppingBag, Users, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Stats {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    recentOrders: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalRevenue: 0,
        recentOrders: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [productsSnap, ordersSnap, customersSnap] = await Promise.all([
                    getDocs(collection(db, 'products')),
                    getDocs(collection(db, 'orders')),
                    getDocs(collection(db, 'customers')),
                ]);

                const orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
                const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
                const recentOrders = orders
                    .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
                    .slice(0, 5);

                setStats({
                    totalProducts: productsSnap.size,
                    totalOrders: ordersSnap.size,
                    totalCustomers: customersSnap.size,
                    totalRevenue,
                    recentOrders,
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Produits', value: stats.totalProducts, icon: Package, color: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/20', iconColor: 'text-purple-400', href: '/admin/products' },
        { label: 'Commandes', value: stats.totalOrders, icon: ShoppingBag, color: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/20', iconColor: 'text-blue-400', href: '/admin/orders' },
        { label: 'Clients', value: stats.totalCustomers, icon: Users, color: 'from-green-500/20 to-green-600/5', border: 'border-green-500/20', iconColor: 'text-green-400', href: '/admin/customers' },
        { label: 'Chiffre d\'affaires', value: `${stats.totalRevenue.toFixed(2)} CHF`, icon: TrendingUp, color: 'from-[#b38b59]/20 to-[#b38b59]/5', border: 'border-[#b38b59]/20', iconColor: 'text-[#b38b59]', href: '/admin/orders' },
    ];

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        paid: 'bg-green-500/10 text-green-400 border-green-500/20',
        shipped: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    const statusLabels: Record<string, string> = {
        pending: 'En attente',
        paid: 'Payée',
        shipped: 'Expédiée',
        delivered: 'Livrée',
        cancelled: 'Annulée',
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-10">
                <h1 className="font-cinzel text-3xl text-white tracking-widest uppercase">Dashboard</h1>
                <p className="text-gray-500 font-architects mt-1">Vue d'ensemble de votre magasin</p>
            </div>

            {/* Stats Cards */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Link key={card.label} href={card.href}>
                                <div className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-6 hover:scale-[1.02] transition-transform cursor-pointer`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <Icon size={22} className={card.iconColor} />
                                        <ChevronRight size={16} className="text-gray-600" />
                                    </div>
                                    <p className="font-architects text-gray-400 text-sm mb-1">{card.label}</p>
                                    <p className="font-cinzel text-white text-2xl">{card.value}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Recent Orders */}
            <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <Clock size={18} className="text-[#b38b59]" />
                        <h2 className="font-cinzel text-white text-lg">Commandes Récentes</h2>
                    </div>
                    <Link href="/admin/orders" className="text-[#b38b59] text-sm font-architects hover:underline flex items-center gap-1">
                        Voir tout <ChevronRight size={14} />
                    </Link>
                </div>

                {stats.recentOrders.length === 0 ? (
                    <div className="p-12 text-center">
                        <ShoppingBag size={40} className="text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-600 font-architects">Aucune commande pour le moment</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {stats.recentOrders.map((order) => (
                            <Link key={order.id} href={`/admin/orders/${order.id}`}>
                                <div className="flex items-center justify-between p-5 hover:bg-white/2 transition-colors">
                                    <div>
                                        <p className="text-white font-architects text-sm">{order.customerName || order.customerEmail}</p>
                                        <p className="text-gray-600 text-xs mt-0.5">{order.customerEmail}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs border font-architects ${statusColors[order.status] || statusColors.pending}`}>
                                            {statusLabels[order.status] || 'En attente'}
                                        </span>
                                        <span className="text-[#b38b59] font-architects font-bold text-sm w-24 text-right">
                                            {(order.total || 0).toFixed(2)} CHF
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
