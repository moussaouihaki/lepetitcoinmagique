'use client';

import { useCartStore } from '@/store/cart';
import { Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items }),
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Erreur: Configurez vos clés Stripe pour activer le paiement en ligne.');
            }
        } catch (e) {
            alert("Une erreur est survenue lors du passage à la caisse.");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-4xl text-center font-architects">
                <ShoppingCartIcon size={64} className="mx-auto text-gray-300 mb-6" />
                <h1 className="font-cinzel text-4xl text-gray-800 mb-4 text-[#92544e]">Votre chaudron est vide</h1>
                <p className="text-gray-500 mb-8">Ajoutez quelques articles enchantés avant de passer votre commande.</p>
                <Link href="/" className="bg-[#92544e] text-white px-8 py-3 rounded-full hover:bg-[#7a433e] transition font-bold shadow-md">
                    Explorer la boutique
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl font-architects">
            <h1 className="font-cinzel text-5xl mb-8 border-b pb-4 text-[#92544e]">Votre Panier</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 border border-gray-100 p-4 rounded bg-white shadow-sm items-center">
                            <div className="relative w-24 h-24 rounded overflow-hidden shrink-0">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl">{item.name}</h3>
                                <p className="text-sm text-gray-500">{item.price.toFixed(2)} CHF</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center border rounded">
                                        <button className="px-3 py-1 bg-gray-50 hover:bg-gray-100" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
                                        <span className="px-3 py-1 border-x font-mono">{item.quantity}</span>
                                        <button className="px-3 py-1 bg-gray-50 hover:bg-gray-100" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 p-2 ml-auto" title="Supprimer">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-xl border border-[#92544e]/20 shadow-md h-fit top-24 sticky">
                    <h2 className="font-bold text-xl mb-4 text-center border-b pb-4 border-gray-100 flex items-center justify-center gap-2">
                        <ShoppingBag size={20} />
                        Résumé de la commande
                    </h2>
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Sous-total</span>
                            <span className="font-mono">{totalPrice.toFixed(2)} CHF</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Livraison (Magasin)</span>
                            <span className="font-mono">Gratuit</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-8">
                        <span className="font-bold text-xl text-[#92544e]">Total</span>
                        <span className="font-bold text-2xl tracking-wider font-mono">{totalPrice.toFixed(2)} CHF</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full bg-[#92544e] text-white py-4 rounded-xl font-bold hover:bg-[#7a433e] transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                        {loading ? 'Redirection Stripe...' : 'Payer avec Stripe'}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
                        Paiement sécurisé via Stripe. <br /> En continuant, vous acceptez nos conditions de vente.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Helper to render icon for empty cart
function ShoppingCartIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    );
}
