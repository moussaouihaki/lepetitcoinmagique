'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { collection, updateDoc, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const [finalOrderId, setFinalOrderId] = useState<string | null>(null);
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        const confirmPayment = async () => {
            if (!sessionId) return;

            try {
                // 1. Find the order with this session ID
                const ordersRef = collection(db, 'orders');
                const q = query(ordersRef, where('stripeSessionId', '==', sessionId));
                const querySnap = await getDocs(q);

                if (!querySnap.empty) {
                    const orderDoc = querySnap.docs[0];
                    const orderId = orderDoc.id;
                    const orderData = orderDoc.data();
                    setFinalOrderId(orderId);

                    // 2. Mark order as paid
                    if (orderData.status !== 'paid') {
                        await updateDoc(doc(db, 'orders', orderId), {
                            status: 'paid',
                        });

                        // 3. Manage Stocks
                        const items = orderData.items || [];
                        for (const item of items) {
                            if (item.id) {
                                const prodRef = doc(db, 'products', item.id);
                                const prodSnap = await getDoc(prodRef);

                                if (prodSnap.exists()) {
                                    const prodData = prodSnap.data();
                                    const currentStock = typeof prodData.stock === 'number' ? prodData.stock : 1;
                                    const orderedQty = item.quantity || 1;
                                    const newStock = Math.max(0, currentStock - orderedQty);

                                    await updateDoc(prodRef, {
                                        stock: newStock,
                                        is_available: newStock > 0
                                    });
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error confirming payment:', error);
            }
        };

        confirmPayment();
    }, [sessionId]);


    return (
        <div className="min-h-screen bg-[#fdfaf6] pt-40 pb-20 flex items-center justify-center">
            <div className="max-w-lg w-full mx-auto px-6 text-center">
                {/* Success icon */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
                    <div className="relative w-24 h-24 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                        <Check size={40} className="text-green-500" />
                    </div>
                </div>

                <div className="mb-2 flex items-center justify-center gap-2">
                    <Sparkles size={16} className="text-[#b38b59]" />
                    <span className="font-architects text-[#b38b59] text-sm uppercase tracking-widest">Paiement confirmé</span>
                    <Sparkles size={16} className="text-[#b38b59]" />
                </div>

                <h1 className="font-cinzel text-4xl text-[#4a2128] uppercase tracking-widest mb-4">Commande Confirmée</h1>
                <p className="font-architects text-xl text-gray-600 mb-6">Merci pour votre confiance ! ✨</p>

                {finalOrderId && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
                        <p className="font-architects text-gray-500 text-sm mb-1">Numéro de commande</p>
                        <p className="font-architects text-[#b38b59] font-bold text-lg break-all">{finalOrderId}</p>
                    </div>
                )}

                <p className="font-architects text-gray-500 mb-10 leading-relaxed">
                    Votre paiement a bien été reçu. Nous avons enregistré votre commande et vous contacterons avec les détails d'expédition.
                </p>

                <Link href="/">
                    <button className="bg-[#4a2128] text-white font-cinzel tracking-widest py-4 px-10 uppercase hover:bg-[#b38b59] transition-colors rounded-xl mb-4 w-full">
                        Retour à la boutique
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#b38b59] border-t-transparent rounded-full animate-spin" /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
