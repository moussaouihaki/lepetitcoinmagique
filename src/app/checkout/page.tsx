'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingBag, ChevronRight, Truck, Shield, CreditCard, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';

type Step = 'cart' | 'shipping';
type DeliveryMethod = 'shipping' | 'pickup';

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCartStore();
    const router = useRouter();
    const [step, setStep] = useState<Step>('cart');
    const [loading, setLoading] = useState(false);
    const [stripeError, setStripeError] = useState('');
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [loadingShipping, setLoadingShipping] = useState(true);

    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        address: '', city: '', zip: '', country: 'Suisse',
        notes: '',
    });

    const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('shipping');

    useEffect(() => {
        // Calculate max shipping cost from items
        const maxShipping = items.reduce((max, item) => Math.max(max, item.shippingCost || 7.5), 0);
        setShippingCost(deliveryMethod === 'shipping' ? maxShipping : 0);
        setLoadingShipping(false);
    }, [items, deliveryMethod]);

    const grandTotal = totalPrice + shippingCost;

    const handleOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStripeError('');
        try {
            // 1. Save order to Firebase
            const orderRef = await addDoc(collection(db, 'orders'), {
                customerName: `${form.firstName} ${form.lastName}`,
                customerEmail: form.email,
                customerPhone: form.phone,
                total: grandTotal,
                shippingCost: shippingCost,
                deliveryMethod: deliveryMethod,
                subtotal: totalPrice,
                status: 'pending',
                shippingAddress: deliveryMethod === 'shipping' ? {
                    address: form.address,
                    city: form.city,
                    zip: form.zip,
                    country: form.country,
                } : null,
                notes: form.notes,
                paymentMethod: 'stripe',
                items: items.map(i => ({
                    id: i.id,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity,
                    image: i.image,
                })),
                createdAt: serverTimestamp(),
            });

            // 2. Call Stripe API
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(i => ({
                        name: i.name,
                        price: i.price,
                        quantity: i.quantity,
                        image: i.image,
                    })),
                    orderId: orderRef.id,
                    customerEmail: form.email,
                    shippingCost: shippingCost,
                }),
            });

            const data = await res.json();

            if (data.error) {
                // Show Stripe error, don't simulate success
                setStripeError(`Erreur Stripe : ${data.error}`);
                setLoading(false);
                return;
            }

            if (data.url) {
                clearCart();
                window.location.href = data.url;
            }
        } catch (e: any) {
            setStripeError('Une erreur est survenue. Veuillez réessayer.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#b38b59]/60 font-architects bg-gray-50";

    if (items.length === 0 && step === 'cart') {
        return (
            <div className="min-h-screen bg-[#fdfaf6] pt-40 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag size={60} className="text-gray-300 mx-auto mb-6" />
                    <h1 className="font-cinzel text-3xl text-[#4a2128] uppercase tracking-widest mb-4">Panier Vide</h1>
                    <p className="font-architects text-gray-500 mb-8">Votre grimoire est vide pour le moment.</p>
                    <Link href="/curiosites"><button className="bg-[#4a2128] text-white font-cinzel tracking-widest py-4 px-10 uppercase hover:bg-[#b38b59] transition-colors">Découvrir la boutique</button></Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfaf6] pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-[1200px]">

                {/* Steps */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    {(['cart', 'shipping'] as const).map((s, i) => (
                        <div key={s} className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 ${step === s ? 'text-[#4a2128]' : 'text-[#b38b59]'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-cinzel text-sm ${step === s ? 'border-[#4a2128] bg-[#4a2128] text-white' : 'border-[#b38b59] text-[#b38b59]'}`}>
                                    {(s === 'cart' && step === 'shipping') ? <Check size={14} /> : i + 1}
                                </div>
                                <span className="font-cinzel text-sm uppercase tracking-widest hidden sm:block">
                                    {s === 'cart' ? 'Panier' : 'Livraison & Paiement'}
                                </span>
                            </div>
                            {i < 1 && <ChevronRight size={16} className="text-gray-300" />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left */}
                    <div className="lg:col-span-2">
                        {step === 'cart' && (
                            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="font-cinzel text-2xl text-[#4a2128] uppercase tracking-widest">Mon Panier</h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-6">
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                                {item.image && <Image src={item.image} alt={item.name} fill className="object-contain p-2" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-cinzel text-[#4a2128] text-sm uppercase tracking-wide">{item.name}</p>
                                                <p className="text-gray-400 text-xs font-architects mt-0.5">{item.category}</p>
                                                <div className="flex items-center justify-between mt-3">
                                                    <span className="font-architects text-gray-500 text-sm">Qté: {item.quantity}</span>
                                                    <span className="font-architects font-bold text-[#b38b59]">{(item.price * item.quantity).toFixed(2)} CHF</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
                                    {/* Delivery Method Selector */}
                                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                                        <button
                                            onClick={() => setDeliveryMethod('shipping')}
                                            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${deliveryMethod === 'shipping' ? 'border-[#b38b59] bg-[#b38b59]/5' : 'border-gray-200 bg-white hover:border-[#b38b59]/50'}`}
                                        >
                                            <Truck size={24} className={deliveryMethod === 'shipping' ? 'text-[#b38b59]' : 'text-gray-400'} />
                                            <span className={`font-cinzel text-sm uppercase tracking-wide ${deliveryMethod === 'shipping' ? 'text-[#b38b59] font-bold' : 'text-gray-500'}`}>Livraison</span>
                                        </button>
                                        <button
                                            onClick={() => setDeliveryMethod('pickup')}
                                            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${deliveryMethod === 'pickup' ? 'border-[#b38b59] bg-[#b38b59]/5' : 'border-gray-200 bg-white hover:border-[#b38b59]/50'}`}
                                        >
                                            <ShoppingBag size={24} className={deliveryMethod === 'pickup' ? 'text-[#b38b59]' : 'text-gray-400'} />
                                            <span className={`font-cinzel text-sm uppercase tracking-wide ${deliveryMethod === 'pickup' ? 'text-[#b38b59] font-bold' : 'text-gray-500'}`}>Sur place</span>
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between font-architects text-sm text-gray-600">
                                            <span>Sous-total</span><span>{totalPrice.toFixed(2)} CHF</span>
                                        </div>
                                        <div className="flex justify-between font-architects text-sm text-gray-600">
                                            <span>Frais de port</span>
                                            <span>{loadingShipping ? '...' : shippingCost === 0 ? 'Gratuit' : `${shippingCost.toFixed(2)} CHF`}</span>
                                        </div>
                                        <div className="flex justify-between font-cinzel text-[#4a2128] text-base border-t border-gray-200 pt-2">
                                            <span>Total</span>
                                            <span className="text-[#b38b59] font-bold">{grandTotal.toFixed(2)} CHF</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <button onClick={() => setStep('shipping')} className="w-full bg-[#4a2128] text-white font-cinzel tracking-widest py-4 rounded-xl uppercase hover:bg-[#b38b59] transition-colors flex items-center justify-center gap-2 shadow-sm">
                                        Continuer <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'shipping' && (
                            <form onSubmit={handleOrder} className="space-y-6">
                                {stripeError && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 font-architects text-sm">
                                        ⚠ {stripeError}
                                    </div>
                                )}

                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <h2 className="font-cinzel text-xl text-[#4a2128] uppercase tracking-widest mb-6 flex items-center gap-2">
                                        {deliveryMethod === 'shipping' ? <Truck size={20} /> : <ShoppingBag size={20} />}
                                        {deliveryMethod === 'shipping' ? 'Informations de livraison' : 'Informations de contact'}
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div><label className="block text-gray-600 text-sm font-architects mb-1">Prénom *</label><input required type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className={inputClass} /></div>
                                        <div><label className="block text-gray-600 text-sm font-architects mb-1">Nom *</label><input required type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className={inputClass} /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div><label className="block text-gray-600 text-sm font-architects mb-1">Email *</label><input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} /></div>
                                        <div><label className="block text-gray-600 text-sm font-architects mb-1">Téléphone</label><input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} /></div>
                                    </div>
                                    {deliveryMethod === 'shipping' && (
                                        <>
                                            <div className="mb-4"><label className="block text-gray-600 text-sm font-architects mb-1">Adresse *</label><input required type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={inputClass} /></div>
                                            <div className="grid grid-cols-3 gap-4 mb-4">
                                                <div><label className="block text-gray-600 text-sm font-architects mb-1">NPA *</label><input required type="text" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} className={inputClass} /></div>
                                                <div className="col-span-2"><label className="block text-gray-600 text-sm font-architects mb-1">Ville *</label><input required type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={inputClass} /></div>
                                            </div>
                                        </>
                                    )}
                                    <div><label className="block text-gray-600 text-sm font-architects mb-1">Notes {deliveryMethod === 'pickup' && '(Optionnel, ex: date de retrait)'}</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder={deliveryMethod === 'shipping' ? "Instructions de livraison..." : "Heure ou jour de retrait souhaité..."} className={`${inputClass} resize-none`} /></div>
                                </div>

                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <h2 className="font-cinzel text-xl text-[#4a2128] uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <CreditCard size={20} /> Paiement sécurisé
                                    </h2>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#635bff] rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CreditCard size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="font-architects text-gray-800 font-medium text-sm">Stripe — Carte bancaire</p>
                                            <p className="font-architects text-gray-500 text-xs">Visa, Mastercard, Amex · SSL</p>
                                        </div>
                                        <div className="ml-auto flex gap-1">
                                            {['VISA', 'MC', 'AMEX'].map(c => <span key={c} className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-gray-600">{c}</span>)}
                                        </div>
                                    </div>
                                    <p className="font-architects text-gray-400 text-xs text-center mt-3">Vous serez redirigé vers la page Stripe sécurisée</p>
                                </div>

                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setStep('cart')} className="flex-1 bg-gray-100 text-gray-700 font-cinzel tracking-widest py-4 rounded-xl uppercase hover:bg-gray-200 transition-colors">Retour</button>
                                    <button type="submit" disabled={loading} className="flex-[2] bg-[#4a2128] text-white font-cinzel tracking-widest py-4 rounded-xl uppercase hover:bg-[#b38b59] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                        {loading ? <><Loader2 size={18} className="animate-spin" /> Redirection vers Stripe...</> : `Payer · ${grandTotal.toFixed(2)} CHF`}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-36">
                            <h3 className="font-cinzel text-lg text-[#4a2128] uppercase tracking-widest mb-6">Récapitulatif</h3>
                            <div className="space-y-3 mb-6">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between items-start gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-architects text-gray-700 text-sm truncate">{item.name}</p>
                                            <p className="text-gray-400 text-xs">× {item.quantity}</p>
                                        </div>
                                        <span className="font-architects text-gray-700 text-sm flex-shrink-0">{(item.price * item.quantity).toFixed(2)} CHF</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 pt-4 space-y-2">
                                <div className="flex justify-between"><span className="font-architects text-gray-500 text-sm">Sous-total</span><span className="font-architects text-gray-700 text-sm">{totalPrice.toFixed(2)} CHF</span></div>
                                <div className="flex justify-between"><span className="font-architects text-gray-500 text-sm">Frais de port</span><span className="font-architects text-gray-700 text-sm">{loadingShipping ? '...' : `${shippingCost.toFixed(2)} CHF`}</span></div>
                                <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                                    <span className="font-cinzel text-[#4a2128] text-base">Total</span>
                                    <span className="font-cinzel text-[#b38b59] text-xl font-bold">{grandTotal.toFixed(2)} CHF</span>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center gap-2 text-gray-400 text-xs font-architects">
                                <Shield size={14} /><span>Paiement sécurisé par Stripe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
