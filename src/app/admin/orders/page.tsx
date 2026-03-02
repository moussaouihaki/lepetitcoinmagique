'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ShoppingBag, Search, ChevronDown } from 'lucide-react';

interface Order {
    id: string; customerName: string; customerEmail: string;
    total: number; status: string; createdAt: any; items?: any[];
}

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
        const matchSearch = (o.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
            (o.customerEmail || '').toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || o.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-cinzel text-3xl text-[#4a2128] tracking-widest uppercase">Commandes</h1>
                    <p className="text-gray-500 font-architects mt-1">
                        {orders.length} commande{orders.length !== 1 ? 's' : ''} · CA total :
                        <span className="text-[#b38b59] font-bold ml-1">{totalRevenue.toFixed(2)} CHF</span>
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Rechercher un client..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b38b59]/60 font-architects shadow-sm" />
                </div>
                <div className="relative">
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-gray-700 focus:outline-none focus:border-[#b38b59]/60 font-architects shadow-sm cursor-pointer">
                        <option value="all">Tous les statuts</option>
                        {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="text-left p-5 text-gray-500 font-architects text-xs font-semibold uppercase tracking-wider">Client</th>
                            <th className="text-left p-5 text-gray-500 font-architects text-xs font-semibold uppercase tracking-wider">Date</th>
                            <th className="text-left p-5 text-gray-500 font-architects text-xs font-semibold uppercase tracking-wider">Statut</th>
                            <th className="text-left p-5 text-gray-500 font-architects text-xs font-semibold uppercase tracking-wider">Total</th>
                            <th className="text-right p-5 text-gray-500 font-architects text-xs font-semibold uppercase tracking-wider">Changer statut</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="p-5"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}</tr>
                            ))
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={5} className="p-16 text-center">
                                <ShoppingBag size={40} className="text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-400 font-architects">Aucune commande</p>
                            </td></tr>
                        ) : (
                            filtered.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-5">
                                        <p className="font-architects text-gray-800 text-sm font-medium">{order.customerName || 'Invité'}</p>
                                        <p className="text-gray-400 text-xs mt-0.5">{order.customerEmail}</p>
                                    </td>
                                    <td className="p-5 text-gray-500 font-architects text-sm">
                                        {order.createdAt?.toDate?.()?.toLocaleDateString('fr-CH', { day: '2-digit', month: 'short', year: 'numeric' }) || '—'}
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-architects font-medium ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                                            {STATUS_LABELS[order.status] || 'En attente'}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <span className="font-architects font-bold text-[#b38b59] text-sm">{(order.total || 0).toFixed(2)} CHF</span>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="relative inline-block">
                                            <select value={order.status || 'pending'} onChange={e => updateStatus(order.id, e.target.value)}
                                                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-gray-700 text-sm focus:outline-none focus:border-[#b38b59]/60 font-architects cursor-pointer">
                                                {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                            </select>
                                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
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
