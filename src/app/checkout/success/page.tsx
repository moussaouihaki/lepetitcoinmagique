'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');
    const sessionId = searchParams.get('session_id');
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (orderId && sessionId) {
            updateDoc(doc(db, 'orders', orderId), {
                status: 'paid',
                stripeSessionId: sessionId,
            }).catch(console.error);
        }
    }, [orderId, sessionId]);

    // Auto-redirect countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [router]);

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

                {orderId && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
                        <p className="font-architects text-gray-500 text-sm mb-1">Numéro de commande</p>
                        <p className="font-architects text-[#b38b59] font-bold text-lg break-all">{orderId}</p>
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

                <p className="font-architects text-gray-400 text-sm">
                    Redirection automatique dans <span className="text-[#b38b59] font-bold">{countdown}s</span>...
                </p>
            </div>
        </div>
    );
}
