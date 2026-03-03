'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function TempSetupPage() {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const createAdmin = async () => {
        setLoading(true);
        setStatus('Création en cours...');
        try {
            await createUserWithEmailAndPassword(auth, 'admin@lepetitcoinmagique.ch', 'Test1234');
            setStatus('Succès ! Compte admin@lepetitcoinmagique.ch créé avec Test1234. Redirection...');
            setTimeout(() => router.push('/admin/login'), 2000);
        } catch (err: any) {
            setStatus('Erreur: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-20 text-center font-architects">
            <h1 className="text-2xl mb-8">🛠 Configuration Temporaire de l'Admin</h1>
            <p className="mb-8">Si ton compte n'existe pas encore sur le nouveau Firebase, clique ici :</p>
            <button
                onClick={createAdmin}
                disabled={loading}
                className="bg-[#4a2128] text-white px-8 py-4 rounded-xl hover:bg-[#b38b59] transition-all"
            >
                {loading ? 'Chargement...' : 'Créer le compte Admin (admin@lepetitcoinmagique.ch)'}
            </button>
            {status && <p className="mt-8 text-red-600">{status}</p>}
        </div>
    );
}
