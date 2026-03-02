'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, Search } from 'lucide-react';

interface Customer {
    id: string; name: string; email: string;
    orderCount: number; totalSpent: number; lastOrder: any;
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const ordersSnap = await getDocs(collection(db, 'orders'));
                const orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
                const customerMap: Record<string, Customer> = {};
                for (const order of orders) {
                    const email = order.customerEmail || 'inconnu';
                    if (!customerMap[email]) {
                        customerMap[email] = { id: email, name: order.customerName || 'Invité', email, orderCount: 0, totalSpent: 0, lastOrder: null };
                    }
                    customerMap[email].orderCount++;
                    customerMap[email].totalSpent += order.total || 0;
                    if (!customerMap[email].lastOrder || (order.createdAt?.toMillis?.() || 0) > (customerMap[email].lastOrder?.toMillis?.() || 0)) {
                        customerMap[email].lastOrder = order.createdAt;
                    }
                }
                setCustomers(Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent));
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8">
                <h1 className="font-cinzel text-3xl text-[#4a2128] tracking-widest uppercase">Clients</h1>
                <p className="text-gray-500 font-architects mt-1">{customers.length} client{customers.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Rechercher un client..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b38b59]/60 font-architects shadow-sm" />
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left p-5 text-gray-500 font-architects text-xs font-semibold uppercase tracking-wider">Client</th>
                                <th className="text-left p-5 text-gray-500 font-architects text-xs font-semibold uppercase tracking-wider">Commandes</th>
                                <th className="text-left p-5 text-gray-500 font-architects text-xs font-semibold uppercase tracking-wider">Total dépensé</th>
                                <th className="text-left p-5 text-gray-500 font-architects text-xs font-semibold uppercase tracking-wider">Dernière commande</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>{Array.from({ length: 4 }).map((_, j) => <td key={j} className="p-5"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}</tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={4} className="p-16 text-center">
                                    <Users size={40} className="text-gray-200 mx-auto mb-3" />
                                    <p className="text-gray-400 font-architects">Aucun client pour le moment</p>
                                </td></tr>
                            ) : (
                                filtered.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3 min-w-[150px]">
                                                <div className="w-9 h-9 rounded-full bg-[#4a2128]/10 border border-[#4a2128]/10 flex items-center justify-center text-[#4a2128] text-sm font-bold flex-shrink-0">
                                                    {customer.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-architects text-gray-800 text-sm font-medium">{customer.name}</p>
                                                    <p className="text-gray-400 text-xs">{customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="bg-[#4a2128]/5 text-[#4a2128] border border-[#4a2128]/10 px-2.5 py-1 rounded-full text-xs font-architects font-medium">
                                                {customer.orderCount} commande{customer.orderCount !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className="font-architects font-bold text-[#b38b59] text-sm">{customer.totalSpent.toFixed(2)} CHF</span>
                                        </td>
                                        <td className="p-5 text-gray-500 font-architects text-sm">
                                            {customer.lastOrder?.toDate?.()?.toLocaleDateString('fr-CH', { day: '2-digit', month: 'short', year: 'numeric' }) || '—'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
