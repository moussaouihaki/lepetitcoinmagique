'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Settings, Loader2, Check } from 'lucide-react';

export default function AdminSettingsPage() {
    const [shippingCost, setShippingCost] = useState('11');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        getDoc(doc(db, 'settings', 'shop')).then(snap => {
            if (snap.exists()) setShippingCost((snap.data().shippingCost ?? 11).toString());
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true); setSaved(false);
        try {
            await setDoc(doc(db, 'settings', 'shop'), {
                shippingCost: parseFloat(shippingCost) || 0,
            }, { merge: true });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    if (loading) return (
        <div className="p-8 flex justify-center pt-20">
            <div className="w-8 h-8 border-2 border-[#b38b59] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-xl mx-auto md:mx-0">
            <h1 className="font-cinzel text-2xl md:text-3xl text-[#4a2128] tracking-widest uppercase mb-2">Paramètres</h1>
            <p className="font-architects text-sm md:text-base text-gray-500 mb-8">Configuration générale de la boutique</p>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Settings size={18} className="text-[#b38b59]" />
                        <h2 className="font-cinzel text-[#4a2128] text-lg">Livraison</h2>
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm font-architects mb-2">
                            Frais de port (CHF)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={shippingCost}
                                onChange={e => setShippingCost(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-16 text-gray-800 focus:outline-none focus:border-[#b38b59]/60 font-architects text-lg"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-architects text-gray-400 font-bold">CHF</span>
                        </div>
                        <p className="font-architects text-gray-400 text-xs mt-2">
                            Ce montant est automatiquement ajouté au total client et inclus dans le paiement Stripe.
                            Mettez 0 pour la livraison gratuite.
                        </p>
                    </div>

                    <div className="mt-6 bg-[#b38b59]/5 border border-[#b38b59]/20 rounded-xl p-4">
                        <p className="font-architects text-[#4a2128] text-sm font-medium mb-1">Aperçu sur le panier</p>
                        <div className="flex justify-between font-architects text-sm text-gray-600">
                            <span>Sous-total</span><span>XX.XX CHF</span>
                        </div>
                        <div className="flex justify-between font-architects text-sm text-gray-600">
                            <span>Frais de port</span><span>{parseFloat(shippingCost || '0').toFixed(2)} CHF</span>
                        </div>
                        <div className="flex justify-between font-architects text-sm font-bold text-[#4a2128] border-t border-[#b38b59]/20 pt-2 mt-2">
                            <span>Total</span><span>XX.XX + {parseFloat(shippingCost || '0').toFixed(2)} CHF</span>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-[#4a2128] hover:bg-[#b38b59] text-white font-cinzel tracking-widest py-4 rounded-xl transition-all uppercase flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                >
                    {saving ? (
                        <><Loader2 size={18} className="animate-spin" /> Sauvegarde...</>
                    ) : saved ? (
                        <><Check size={18} /> Sauvegardé !</>
                    ) : (
                        'Sauvegarder'
                    )}
                </button>
            </form>
        </div>
    );
}
