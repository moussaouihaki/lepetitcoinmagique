'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { ShoppingBag, ChevronRight, Search } from 'lucide-react';

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: string;
    createdAt: any;
    shippingAddress?: any;
    items?: any[];
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    paid: 'bg-green-500/10 text-green-400 border-green-500/20',
    shipped: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'En attente', paid: 'Payée', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée',
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetch = async () => {
            try {
                const snap = await getDocs(collection(db, 'orders'));
                const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Order[];
                data.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
                setOrders(data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        await updateDoc(doc(db, 'orders', id), { status });
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    };

    const filtered = orders.filter(o => {
        const matchSearch = (o.customerName || '').toLowerCase().includes(search.toLowerCase()) || (o.customerEmail || '').toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || o.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-cinzel text-3xl text-white tracking-widest uppercase">Commandes</h1>
                    <p className="text-gray-500 font-architects mt-1">
                        {orders.length} commande{orders.length !== 1 ? 's' : ''} · CA total: <span className="text-[#b38b59]">{totalRevenue.toFixed(2)} CHF</span>
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="text" placeholder="Rechercher un client..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#b38b59]/50 font-architects" />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b38b59]/50 font-architects">
                    <option value="all">Tous les statuts</option>
                    {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="text-left p-5 text-gray-500 font-architects text-sm font-normal">Client</th>
                            <th className="text-left p-5 text-gray-500 font-architects text-sm font-normal">Date</th>
                            <th className="text-left p-5 text-gray-500 font-architects text-sm font-normal">Statut</th>
                            <th className="text-left p-5 text-gray-500 font-architects text-sm font-normal">Total</th>
                            <th className="text-right p-5 text-gray-500 font-architects text-sm font-normal">Changer statut</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="p-5"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>)}</tr>
                            ))
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={5} className="p-12 text-center"><ShoppingBag size={40} className="text-gray-700 mx-auto mb-3" /><p className="text-gray-600 font-architects">Aucune commande</p></td></tr>
                        ) : (
                            filtered.map((order) => (
                                <tr key={order.id} className="hover:bg-white/2 transition-colors">
                                    <td className="p-5">
                                        <p className="text-white font-architects text-sm">{order.customerName || 'Invité'}</p>
                                        <p className="text-gray-600 text-xs mt-0.5">{order.customerEmail}</p>
                                    </td>
                                    <td className="p-5 text-gray-400 font-architects text-sm">
                                        {order.createdAt?.toDate?.()?.toLocaleDateString('fr-CH', { day: '2-digit', month: 'short', year: 'numeric' }) || '—'}
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-xs border font-architects ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                                            {STATUS_LABELS[order.status] || 'En attente'}
                                        </span>
                                    </td>
                                    <td className="p-5 text-[#b38b59] font-architects font-bold text-sm">{(order.total || 0).toFixed(2)} CHF</td>
                                    <td className="p-5 text-right">
                                        <select
                                            value={order.status || 'pending'}
                                            onChange={e => updateStatus(order.id, e.target.value)}
                                            className="bg-[#0d0d0d] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#b38b59]/50 font-architects"
                                        >
                                            {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
