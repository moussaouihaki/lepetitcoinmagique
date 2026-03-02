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

            <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Settings size={18} className="text-[#b38b59]" />
                    <h2 className="font-cinzel text-[#4a2128] text-lg">Livraison</h2>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="font-architects text-blue-800 text-sm">
                        Les frais de port sont désormais calculés automatiquement en fonction des articles dans le panier.
                        Vous pouvez définir le coût de livraison spécifique de chaque produit depuis la page de modification du produit.
                        (ex: 11 CHF pour un objet fragile, 7.50 CHF pour un objet standard).
                    </p>
                </div>
            </div>
        </div>
    );
}
