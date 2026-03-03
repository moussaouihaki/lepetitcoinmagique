'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, Truck, User, Mail, Phone, MapPin, CreditCard, Loader2, Check } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'awaiting_payment', label: 'Paiement en cours', color: 'bg-orange-50 text-orange-600' },
    { value: 'paid', label: 'Payée', color: 'bg-green-100 text-green-700' },
    { value: 'shipped', label: 'Expédiée', color: 'bg-blue-100 text-blue-700' },
    { value: 'delivered', label: 'Livrée', color: 'bg-emerald-100 text-emerald-700' },
    { value: 'cancelled', label: 'Annulée', color: 'bg-red-100 text-red-700' },
];

interface OrderItem {
    id: string; name: string; price: number; quantity: number; image?: string;
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    status: string;
    total: number;
    shippingCost?: number;
    shippingAddress?: { address: string; city: string; zip: string; country: string; };
    notes?: string;
    paymentMethod?: string;
    stripeSessionId?: string;
    items: OrderItem[];
    createdAt?: any;
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [savingStatus, setSavingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const snap = await getDoc(doc(db, 'orders', orderId));
                if (snap.exists()) {
                    const data = snap.data();
                    const o = { id: snap.id, ...data } as Order;
                    setOrder(o);
                    setNewStatus(o.status || 'pending');
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, [orderId]);

    const handleStatusUpdate = async () => {
        if (!order || newStatus === order.status) return;
        setSavingStatus(true);
        try {
            await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
            setOrder(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (e) { console.error(e); }
        finally { setSavingStatus(false); }
    };

    const statusInfo = STATUS_OPTIONS.find(s => s.value === (order?.status || 'pending'));
    const subtotal = order?.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
    const shippingCost = order?.shippingCost || 0;
    const orderTotal = order?.total || (subtotal + shippingCost);

    if (loading) return (
        <div className="p-8 flex justify-center pt-20">
            <div className="w-8 h-8 border-2 border-[#b38b59] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!order) return (
        <div className="p-8 text-center">
            <p className="font-architects text-gray-500">Commande introuvable.</p>
            <Link href="/admin/orders" className="text-[#b38b59] font-architects text-sm mt-4 block">← Retour aux commandes</Link>
        </div>
    );

    return (
        <div className="p-8 max-w-4xl">
            <Link href="/admin/orders" className="flex items-center gap-2 text-gray-500 hover:text-[#4a2128] transition-colors mb-8 font-architects text-sm">
                <ArrowLeft size={16} /> Retour aux commandes
            </Link>

            <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
                <div>
                    <h1 className="font-cinzel text-2xl text-[#4a2128] tracking-widest uppercase">Commande</h1>
                    <p className="font-architects text-gray-400 text-sm mt-1 break-all">#{orderId}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-architects font-semibold ${statusInfo?.color}`}>
                        {statusInfo?.label}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left col */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                            <Package size={16} className="text-[#b38b59]" />
                            <h2 className="font-cinzel text-[#4a2128] text-sm uppercase tracking-widest">Articles commandés</h2>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {order.items?.length > 0 ? order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4">
                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                        {item.image
                                            ? <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                                            : <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-gray-300" /></div>
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-architects text-gray-800 font-medium text-sm">{item.name}</p>
                                        <p className="font-architects text-gray-400 text-xs mt-0.5">
                                            {item.price.toFixed(2)} CHF × {item.quantity}
                                        </p>
                                    </div>
                                    <span className="font-architects font-bold text-[#4a2128] text-sm flex-shrink-0">
                                        {(item.price * item.quantity).toFixed(2)} CHF
                                    </span>
                                </div>
                            )) : (
                                <div className="p-8 text-center">
                                    <p className="font-architects text-gray-400 text-sm">Aucun article enregistré</p>
                                </div>
                            )}
                        </div>
                        {/* Totals */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-2">
                            <div className="flex justify-between font-architects text-sm text-gray-600">
                                <span>Sous-total</span><span>{subtotal.toFixed(2)} CHF</span>
                            </div>
                            <div className="flex justify-between font-architects text-sm text-gray-600">
                                <span>Frais de port</span>
                                <span>{shippingCost > 0 ? `${shippingCost.toFixed(2)} CHF` : 'À définir'}</span>
                            </div>
                            <div className="flex justify-between font-cinzel text-[#4a2128] text-base border-t border-gray-200 pt-2 mt-1">
                                <span>Total</span><span className="text-[#b38b59] font-bold">{orderTotal.toFixed(2)} CHF</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping address */}
                    {order.shippingAddress && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Truck size={16} className="text-[#b38b59]" />
                                <h2 className="font-cinzel text-[#4a2128] text-sm uppercase tracking-widest">Adresse de livraison</h2>
                            </div>
                            <div className="font-architects text-gray-700 space-y-1">
                                <div className="flex items-start gap-2">
                                    <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p>{order.shippingAddress.address}</p>
                                        <p>{order.shippingAddress.zip} {order.shippingAddress.city}</p>
                                        <p>{order.shippingAddress.country}</p>
                                    </div>
                                </div>
                                {order.notes && (
                                    <p className="text-gray-500 text-sm mt-3 italic border-t border-gray-100 pt-3">
                                        Note : {order.notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right col */}
                <div className="space-y-6">
                    {/* Customer info */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <User size={16} className="text-[#b38b59]" />
                            <h2 className="font-cinzel text-[#4a2128] text-sm uppercase tracking-widest">Client</h2>
                        </div>
                        <div className="space-y-3 font-architects text-sm">
                            <p className="text-gray-800 font-medium">{order.customerName}</p>
                            {order.customerEmail && (
                                <a href={`mailto:${order.customerEmail}`} className="flex items-center gap-2 text-gray-600 hover:text-[#b38b59] transition-colors">
                                    <Mail size={13} className="flex-shrink-0" /> {order.customerEmail}
                                </a>
                            )}
                            {order.customerPhone && (
                                <a href={`tel:${order.customerPhone}`} className="flex items-center gap-2 text-gray-600 hover:text-[#b38b59] transition-colors">
                                    <Phone size={13} className="flex-shrink-0" /> {order.customerPhone}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Payment info */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard size={16} className="text-[#b38b59]" />
                            <h2 className="font-cinzel text-[#4a2128] text-sm uppercase tracking-widest">Paiement</h2>
                        </div>
                        <div className="font-architects text-sm space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Méthode</span>
                                <span className="uppercase font-medium">{order.paymentMethod || 'Stripe'}</span>
                            </div>
                            {order.stripeSessionId && (
                                <p className="text-gray-400 text-xs break-all">ID: {order.stripeSessionId}</p>
                            )}
                        </div>
                    </div>

                    {/* Change status */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <h2 className="font-cinzel text-[#4a2128] text-sm uppercase tracking-widest mb-4">Changer le statut</h2>
                        <select
                            value={newStatus}
                            onChange={e => setNewStatus(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-architects text-sm text-gray-700 focus:outline-none focus:border-[#b38b59]/60 mb-3"
                        >
                            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <button
                            onClick={handleStatusUpdate}
                            disabled={savingStatus || newStatus === order.status}
                            className="w-full bg-[#4a2128] hover:bg-[#b38b59] text-white font-cinzel tracking-widest py-2.5 rounded-xl transition-all uppercase text-xs disabled:opacity-40 flex items-center justify-center gap-2"
                        >
                            {savingStatus
                                ? <><Loader2 size={14} className="animate-spin" /> Sauvegarde...</>
                                : <><Check size={14} /> Mettre à jour</>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
