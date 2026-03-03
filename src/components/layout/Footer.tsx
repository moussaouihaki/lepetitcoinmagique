'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Facebook, Instagram, Music2 } from 'lucide-react';

export default function Footer() {
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="bg-[#FDFBF8] text-[#4a2128] py-20 font-architects mt-24 border-t border-[#b38b59]/20 relative">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center">
                        <h3 className="font-cinzel text-3xl mb-6 text-[#b38b59] uppercase tracking-widest leading-tight">Le Petit<br />Coin Magique</h3>
                        <div className="w-12 h-px bg-[#b38b59]/30 mb-6" />
                        <p className="text-gray-600 text-sm leading-relaxed max-w-[280px] mb-4">
                            Créations artisanales venues tout droit du Jura Bernois, pour un quotidien enchanté et mystique.
                        </p>
                        <p className="text-[#b38b59]/60 text-xs uppercase tracking-widest px-4 py-2 border border-[#b38b59]/10 rounded-full">
                            Grand-Rue 13 • 2710 Tavannes
                        </p>
                    </div>

                    {/* Links Section */}
                    <div className="flex flex-col items-center">
                        <h3 className="font-cinzel text-lg mb-8 tracking-[0.3em] uppercase text-[#4a2128]">Informations</h3>
                        <nav className="flex flex-col gap-4 text-sm uppercase tracking-widest font-bold">
                            <Link href="/notre-equipe-de-createurs" className="hover:text-[#b38b59] transition-colors duration-300">La Confrérie</Link>
                            <Link href="/contact" className="hover:text-[#b38b59] transition-colors duration-300">Nous contacter</Link>
                            <Link href="/cgv" className="hover:text-[#b38b59] transition-colors duration-300">Conditions Générales</Link>
                            <Link href="/mentions-legales" className="hover:text-[#b38b59] transition-colors duration-300">Mentions Légales</Link>
                        </nav>
                    </div>

                    {/* Social Section */}
                    <div className="flex flex-col items-center">
                        <h3 className="font-cinzel text-lg mb-8 tracking-[0.3em] uppercase text-[#4a2128]">Réseaux Sociaux</h3>
                        <p className="text-gray-500 text-xs mb-8 uppercase tracking-widest">Suivez nos dernières incantations</p>
                        <div className="flex items-center gap-8 text-[#4a2128]">
                            <a href="https://www.facebook.com/profile.php?id=100076310434630" target="_blank" rel="noreferrer" className="hover:text-[#b38b59] transition-all transform hover:scale-110">
                                <Facebook size={24} />
                            </a>
                            <a href="https://www.instagram.com/le_petit_coin_magique" target="_blank" rel="noreferrer" className="hover:text-[#b38b59] transition-all transform hover:scale-110">
                                <Instagram size={24} />
                            </a>
                            <a href="https://www.tiktok.com/@le.petit.coin.magique" target="_blank" rel="noreferrer" className="hover:text-[#b38b59] transition-all transform hover:scale-110">
                                <Music2 size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-24 pt-8 border-t border-[#b38b59]/10 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 bg-[#b38b59] rotate-45" />
                        <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-cinzel">
                            © {year} Le Petit Coin Magique
                        </p>
                        <div className="w-1.5 h-1.5 bg-[#b38b59] rotate-45" />
                    </div>

                    <Link href="/admin" className="text-[10px] uppercase tracking-[0.4em] text-gray-300 hover:text-[#b38b59] transition-colors duration-500 font-cinzel">
                        Grimoire
                    </Link>
                </div>
            </div>
        </footer>
    );
}
