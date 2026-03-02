'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Lock, Mail, Eye, EyeOff } from 'lucide-react';

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
        <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#b38b59]/5 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#b38b59]/10 border border-[#b38b59]/30 mb-4">
                        <Sparkles className="text-[#b38b59]" size={28} />
                    </div>
                    <h1 className="font-cinzel text-3xl text-white tracking-widest uppercase">Grimoire Admin</h1>
                    <p className="text-gray-500 mt-2 font-architects">Le Petit Coin Magique</p>
                </div>

                {/* Card */}
                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h2 className="font-cinzel text-xl text-white mb-6 text-center">Accès Réservé</h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-6 text-sm font-architects">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-400 text-sm font-architects mb-2">Email administrateur</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#b38b59]/50 transition-colors font-architects"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm font-architects mb-2">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#b38b59]/50 transition-colors font-architects"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#b38b59] hover:bg-[#c9a06e] text-white font-cinzel tracking-widest py-3.5 rounded-xl transition-all duration-300 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authentification...' : 'Entrer dans le Grimoire'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-700 text-sm mt-6 font-architects">
                    Accès réservé aux administrateurs du Petit Coin Magique
                </p>
            </div>
        </div>
    );
}
