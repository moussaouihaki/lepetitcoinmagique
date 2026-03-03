'use client';

import { useCartStore } from '@/store/cart';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
    const router = useRouter();

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
                <ShoppingBag size={64} className="text-gray-200 mb-6" />
                <h1 className="font-cinzel text-4xl text-[#4a2128] uppercase tracking-widest mb-4">Panier Vide</h1>
                <p className="font-architects text-gray-500 text-xl mb-10">Votre grimoire n'a pas encore été ensemencé.</p>
                <Link href="/#boutique">
                    <button className="bg-[#4a2128] text-white font-cinzel tracking-widest py-4 px-10 uppercase hover:bg-[#b38b59] transition-colors">
                        Découvrir la Boutique
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#fdfaf6] min-h-screen pb-20">
            <div className="container mx-auto px-6 max-w-[1100px]">
                <div className="py-12 border-b border-gray-100 mb-10">
                    <h1 className="font-cinzel text-4xl md:text-5xl text-[#4a2128] uppercase tracking-widest">Mon Panier</h1>
                    <p className="font-architects text-gray-500 mt-2">{items.length} article{items.length > 1 ? 's' : ''}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Items list */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    exit={{ opacity: 0, x: -30, height: 0 }}
                                    className="bg-white border border-gray-100 rounded-2xl flex flex-col sm:flex-row gap-4 p-4 sm:p-5 shadow-sm"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        {/* Image */}
                                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                            {item.image && (
                                                <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0 pt-1">
                                            <p className="font-cinzel text-[#4a2128] text-sm uppercase tracking-wide leading-tight">{item.name}</p>
                                            <p className="font-architects text-gray-400 text-xs mt-1">{item.category}</p>

                                            {/* Qty + delete */}
                                            <div className="flex items-center gap-4 mt-3 flex-wrap">
                                                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="px-3 py-1.5 hover:bg-gray-50 transition-colors text-gray-600"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-3 py-1.5 font-architects text-sm font-bold border-x border-gray-200 min-w-[2rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-3 py-1.5 hover:bg-gray-50 transition-colors text-gray-600"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-1.5 text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="flex-shrink-0 sm:text-right border-t border-gray-100 sm:border-0 pt-3 sm:pt-0 mt-2 sm:mt-0 flex sm:block justify-between items-center w-full sm:w-auto">
                                        <span className="sm:hidden font-architects text-gray-500 text-sm">Sous-total :</span>
                                        <div>
                                            <span className="font-architects font-bold text-[#b38b59] text-lg">
                                                {(item.price * item.quantity).toFixed(2)} CHF
                                            </span>
                                            {item.quantity > 1 && (
                                                <p className="text-gray-400 text-xs mt-0.5">{item.price.toFixed(2)} CHF / unité</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <Link href="/#boutique" className="inline-flex items-center gap-2 text-[#b38b59] font-architects text-sm hover:underline mt-4">
                            ← Continuer mes achats
                        </Link>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-36">
                            <h2 className="font-cinzel text-xl text-[#4a2128] uppercase tracking-widest mb-6">Récapitulatif</h2>

                            <div className="space-y-3 mb-6">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="font-architects text-gray-600 truncate max-w-[150px]">{item.name} × {item.quantity}</span>
                                        <span className="font-architects text-gray-700 font-bold flex-shrink-0">{(item.price * item.quantity).toFixed(2)} CHF</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                                <div className="flex justify-between">
                                    <span className="font-architects text-gray-500 text-sm">Sous-total</span>
                                    <span className="font-architects text-gray-700 text-sm">{totalPrice.toFixed(2)} CHF</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-architects text-gray-500 text-sm">Livraison</span>
                                    <span className="font-architects text-gray-500 text-sm">Calculée à l'étape suivante</span>
                                </div>
                            </div>

                            <div className="flex justify-between border-t border-gray-100 pt-4 mb-6">
                                <span className="font-cinzel text-[#4a2128] text-lg">Total</span>
                                <span className="font-cinzel text-[#b38b59] text-2xl font-bold">{totalPrice.toFixed(2)} CHF</span>
                            </div>

                            {/* Checkout button — no login required */}
                            <button
                                onClick={() => router.push('/checkout')}
                                className="w-full bg-[#4a2128] text-white font-cinzel tracking-widest py-4 rounded-xl uppercase hover:bg-[#b38b59] transition-all duration-300 text-sm"
                            >
                                Commander →
                            </button>

                            <p className="text-center font-architects text-gray-400 text-xs mt-4">
                                ✓ Aucun compte requis · Paiement sécurisé
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
