'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            router.push('/admin');
        } catch (err: any) {
            setError('Identifiants incorrects. Vérifiez votre email et mot de passe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center p-6">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#b38b59]/30 to-transparent" />
                <div className="absolute inset-8 border border-[#b38b59]/10" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#b38b59]/40 mx-auto mb-5 shadow-md">
                        <Image
                            src="/images/logo.jpg"
                            alt="Le Petit Coin Magique"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h1 className="font-cinzel text-3xl text-[#4a2128] tracking-widest uppercase">Grimoire Admin</h1>
                    <p className="text-gray-500 mt-2 font-architects">Le Petit Coin Magique</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-md">
                    <h2 className="font-cinzel text-xl text-[#4a2128] mb-6 text-center">Accès Réservé</h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-6 text-sm font-architects">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-600 text-sm font-architects mb-2">Email administrateur</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@lepetitcoinmagique.com"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#b38b59]/60 transition-colors font-architects"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-600 text-sm font-architects mb-2">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-12 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#b38b59]/60 transition-colors font-architects"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#4a2128] hover:bg-[#b38b59] text-white font-cinzel tracking-widest py-3.5 rounded-xl transition-all duration-300 uppercase disabled:opacity-50 mb-4"
                        >
                            {loading ? 'Authentification...' : 'Entrer dans le Grimoire'}
                        </button>

                        <Link
                            href="/"
                            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-[#b38b59] transition-colors font-architects text-sm"
                        >
                            <ArrowLeft size={14} /> Retourner à l'accueil
                        </Link>
                    </form>
                </div>

                <p className="text-center text-gray-400 text-sm mt-6 font-architects">
                    Accès réservé aux administrateurs
                </p>
            </div>
        </div>
    );
}
