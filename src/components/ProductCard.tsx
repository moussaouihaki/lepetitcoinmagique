'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product, useCartStore } from '@/store/cart';
import { ShoppingCart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="group flex flex-col items-center text-center relative"
        >
            {/* Exquisite Image Frame */}
            <div className="relative w-full aspect-[4/5] mb-6 overflow-hidden bg-[#f0eae1] p-2 border border-gold shadow-premium transition-transform duration-700 group-hover:-translate-y-2">
                {/* Inner Frame */}
                <div className="relative w-full h-full border border-gold/50 overflow-hidden bg-white">
                    {product.stock !== undefined && product.stock <= 0 && (
                        <div className="absolute top-4 right-4 z-20 bg-[#4a2128] text-white font-cinzel text-[10px] tracking-widest px-3 py-1.5 shadow-lg border border-gold/30 uppercase animate-pulse">
                            Vendu
                        </div>
                    )}
                    <Link href={`/product/${product.id}`} className="block w-full h-full">
                        {(product.image || (product.images && product.images.length > 0)) ? (
                            <Image
                                src={product.image || product.images?.[0] || ''}
                                alt={product.name}
                                fill
                                className="object-contain p-4 transition-transform duration-1000 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                <span className="text-gray-300 font-architects">Pas d'image</span>
                            </div>
                        )}
                    </Link>

                    {/* Magical Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                        <Link
                            href={`/product/${product.id}`}
                            className="bg-white text-[#4a2128] p-3 rounded-full hover:bg-[#4a2128] hover:text-white transition-all shadow-lg border border-gold/30"
                            title="Consulter le grimoire"
                        >
                            <Eye size={18} />
                        </Link>
                        <button
                            onClick={() => product.stock !== 0 && addItem(product)}
                            disabled={product.stock === 0}
                            className={`p-3 rounded-full transition-colors shadow-lg ${product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-[#4a2128] text-[#fdfaf6] hover:bg-[#b38b59]'}`}
                            title={product.stock === 0 ? "Épuisé" : "Ajouter au panier"}
                        >
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <div className="w-full flex flex-col items-center">
                <span className="font-architects text-[#b38b59] text-[11px] uppercase tracking-[0.3em] font-bold mb-3">
                    {product.category}
                </span>
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-cinzel text-2xl lg:text-3xl text-gray-900 mb-3 group-hover:text-[#4a2128] transition-colors uppercase tracking-wide">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-4 mt-2">
                    <div className="h-[1px] w-6 bg-gold/30" />
                    <span className="font-architects font-bold text-xl text-[#b38b59]">
                        {product.price.toFixed(2)} <span className="text-sm">CHF</span>
                    </span>
                    <div className="h-[1px] w-6 bg-gold/30" />
                </div>
            </div>
        </motion.div>
    );
}
