'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Header() {
    const { totalItems } = useCartStore();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileBoutiqueOpen, setMobileBoutiqueOpen] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        // Fetch categories dynamically from Firebase
        getDocs(collection(db, 'products')).then(snap => {
            const cats = [...new Set(
                snap.docs.map(d => (d.data().category || '').toUpperCase()).filter(Boolean)
            )].sort();
            setCategories(cats);
        }).catch(() => { });
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header className={`fixed w-full top-0 z-50 transition-all duration-700 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-gold shadow-premium py-2' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 max-w-[1600px] h-full flex flex-col md:flex-row items-center justify-between">

                    <div className="w-full flex justify-between items-center md:hidden mb-4">
                        {/* Mobile Menu Toggle */}
                        <button className="text-[#4a2128]" onClick={() => setMobileMenuOpen(true)}>
                            <Menu size={32} strokeWidth={1.5} />
                        </button>
                        <Link href="/" className="relative h-14 w-14 rounded-full overflow-hidden border border-[#b38b59] p-0.5 bg-white shadow-sm">
                            <Image
                                src="https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/fb_img_1747862163342-1-high.jpg"
                                alt="Le Petit Coin Magique"
                                fill
                                className="object-cover rounded-full"
                            />
                        </Link>
                        <Link href="/cart" className="relative text-[#4a2128]">
                            <ShoppingCart size={28} strokeWidth={1.5} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#b38b59] text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>

                    <div className="hidden md:flex flex-1 justify-start">
                        <nav className="flex gap-x-12 items-center">
                            <Link href="/" className="font-cinzel text-xl tracking-widest text-gray-700 hover:text-[#b38b59] transition-colors uppercase">
                                Accueil
                            </Link>

                            {/* Boutique Dropdown */}
                            <div className="relative group/boutique">
                                <button className="font-cinzel text-xl tracking-widest text-gray-700 group-hover/boutique:text-[#b38b59] transition-colors uppercase flex items-center gap-2 pb-6 -mb-6">
                                    Boutique
                                    <ChevronDown size={16} className="transition-transform duration-500 group-hover/boutique:rotate-180" />
                                </button>

                                <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover/boutique:opacity-100 group-hover/boutique:visible transition-all duration-300">
                                    <div className="bg-white border text-center border-gold shadow-premium p-8 min-w-[320px] flex flex-col gap-5">
                                        <span className="font-architects text-[#b38b59] text-sm mb-2">Découvrez nos envoûtements</span>
                                        <div className="h-[1px] w-12 bg-gold/50 mx-auto mb-2" />
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat}
                                                href={`/category/${encodeURIComponent(cat.toLowerCase())}`}
                                                className="font-cinzel tracking-widest text-sm uppercase text-gray-600 hover:text-[#4a2128] hover:tracking-[0.25em] transition-all"
                                            >
                                                {cat}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Link href="/notre-equipe-de-createurs" className="font-cinzel text-xl tracking-widest text-gray-700 hover:text-[#b38b59] transition-colors uppercase whitespace-nowrap">
                                La Confrérie
                            </Link>

                            <Link href="/contact" className="font-cinzel text-xl tracking-widest text-gray-700 hover:text-[#b38b59] transition-colors uppercase whitespace-nowrap">
                                Contact
                            </Link>
                        </nav>
                    </div>

                    <div className="hidden md:flex flex-1 justify-center relative">
                        <Link href="/" className={`transition-all duration-1000 z-10 flex flex-col items-center gap-2 group ${scrolled ? 'scale-75 -translate-y-2' : ''}`}>
                            <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-[#b38b59] p-1 bg-white shadow-lg group-hover:border-[#4a2128] transition-colors duration-500">
                                <Image
                                    src="https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/fb_img_1747862163342-1-high.jpg"
                                    alt="Le Petit Coin Magique"
                                    fill
                                    className="object-cover rounded-full"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:flex flex-1 justify-end gap-10 items-center">
                        <Link href="/cart" className="relative text-gray-700 hover:text-[#b38b59] transition-colors flex items-center gap-2">
                            <span className="font-cinzel text-xl tracking-widest uppercase">Panier</span>
                            <ShoppingCart size={20} strokeWidth={1.5} />
                            {totalItems > 0 && (
                                <span className="absolute -top-3 -right-3 bg-[#b38b59] text-white text-[11px] rounded-full h-[22px] w-[22px] flex items-center justify-center font-bold shadow-sm">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-[#fdfaf6] md:hidden overflow-y-auto"
                    >
                        <div className="p-6 pb-24 border-8 border-[#b38b59]/10 min-h-screen">
                            <div className="flex justify-end mb-12">
                                <button className="text-[#4a2128] p-2" onClick={() => setMobileMenuOpen(false)}>
                                    <X size={32} strokeWidth={1.5} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-8 text-center items-center">
                                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-cinzel text-2xl tracking-widest uppercase text-[#4a2128]">Accueil</Link>

                                {/* Boutique accordion */}
                                <div className="w-full flex flex-col items-center">
                                    <button
                                        onClick={() => setMobileBoutiqueOpen(!mobileBoutiqueOpen)}
                                        className="flex items-center gap-3 font-cinzel text-2xl tracking-widest uppercase text-[#4a2128]"
                                    >
                                        Boutique
                                        <ChevronDown size={20} className={`transition-transform duration-300 ${mobileBoutiqueOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {mobileBoutiqueOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden w-full"
                                            >
                                                <div className="flex flex-col gap-5 pt-5 items-center">
                                                    {categories.map((cat, i) => (
                                                        <motion.div
                                                            key={cat}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.04 }}
                                                        >
                                                            <Link
                                                                href={`/category/${encodeURIComponent(cat.toLowerCase())}`}
                                                                onClick={() => { setMobileMenuOpen(false); setMobileBoutiqueOpen(false); }}
                                                                className="font-cinzel text-lg tracking-widest uppercase text-gray-600 hover:text-[#4a2128] transition-colors"
                                                            >
                                                                {cat}
                                                            </Link>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="h-[1px] w-24 bg-[#b38b59]/40 my-2" />

                                <Link href="/notre-equipe-de-createurs" onClick={() => setMobileMenuOpen(false)} className="font-cinzel text-2xl tracking-widest uppercase text-[#4a2128]">La Confrérie</Link>
                                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="font-cinzel text-2xl tracking-widest uppercase text-[#4a2128]">Contact</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
