'use client';

import Image from 'next/image';
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
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-1000 group-hover:scale-105"
                    />
                    {/* Magical Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                        <button
                            onClick={() => addItem(product)}
                            className="bg-[#4a2128] text-[#fdfaf6] p-3 rounded-full hover:bg-[#b38b59] transition-colors shadow-lg"
                            title="Ajouter au grimoire"
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
                <h3 className="font-cinzel text-2xl lg:text-3xl text-gray-900 mb-3 group-hover:text-[#4a2128] transition-colors">
                    {product.name}
                </h3>

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
