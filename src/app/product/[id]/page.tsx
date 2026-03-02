import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import fs from 'fs';
import path from 'path';
import { Product } from '@/store/cart';
import ProductCard from '@/components/ProductCard';

async function getProducts(): Promise<Product[]> {
    try {
        const p = path.join(process.cwd(), 'data', 'products.json');
        return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch {
        return [];
    }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const allProducts = await getProducts();
    const product = allProducts.find((p) => p.id === id);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="font-cinzel text-4xl text-[#4a2128] mb-4">Artefact Introuvable</h1>
                <p className="font-architects text-xl text-gray-600 mb-8">Cet objet mystique semble avoir disparu de notre grimoire.</p>
                <Link href="/curiosites" className="font-cinzel text-[#b38b59] hover:underline flex items-center gap-2">
                    <ArrowLeft size={20} /> Retour aux Curiosités
                </Link>
            </div>
        );
    }

    const relatedProducts = allProducts
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="bg-[#fdfaf6] min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-[1400px]">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm font-architects text-gray-400 mb-12">
                    <Link href="/" className="hover:text-[#b38b59]">Accueil</Link>
                    <span>/</span>
                    <Link href={`/category/${encodeURIComponent(product.category.toLowerCase())}`} className="hover:text-[#b38b59] uppercase tracking-widest">{product.category}</Link>
                    <span>/</span>
                    <span className="text-[#4a2128] font-bold uppercase tracking-widest">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    {/* Image Section */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#b38b59]/5 blur-3xl rounded-full scale-75 -z-10" />
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-white p-4 border border-gold shadow-premium">
                            <div className="relative w-full h-full border border-gold/30">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-8"
                                    priority
                                />
                            </div>
                        </div>
                        {/* Decorative ornaments */}
                        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-gold/40" />
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-gold/40" />
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col">
                        <div className="mb-10">
                            <span className="font-architects text-[#b38b59] text-sm uppercase tracking-[0.4em] font-bold mb-4 block">
                                {product.category}
                            </span>
                            <h1 className="font-cinzel text-4xl lg:text-6xl text-gray-900 mb-6 uppercase leading-tight tracking-wide">
                                {product.name}
                            </h1>
                            <div className="h-px w-24 bg-gradient-to-r from-[#b38b59] to-transparent mb-8" />
                            <p className="font-architects text-3xl text-[#4a2128] font-bold">
                                {product.price.toFixed(2)} <span className="text-xl">CHF</span>
                            </p>
                        </div>

                        <div className="font-architects text-lg lg:text-xl text-gray-600 leading-relaxed mb-12 space-y-6">
                            <p>{product.description}</p>
                            <p>Chaque pièce est unique et imprégnée de l'énergie de notre atelier jurassien. La fabrication artisanale peut entraîner de légères variations de couleur ou de forme, témoignant du caractère authentique de votre artefact.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 mb-16">
                            {/* Add to Cart logic would need client component, keeping it simple for now or using a wrapper */}
                            <button className="flex-1 bg-[#4a2128] text-white font-cinzel text-xl tracking-widest py-6 px-10 border border-[#4a2128] hover:bg-transparent hover:text-[#4a2128] transition-all duration-500 uppercase flex items-center justify-center gap-4 group">
                                <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                                Ajouter au Grimoire
                            </button>
                        </div>

                        {/* Reassurance */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-t border-gold/20">
                            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
                                <Sparkles className="text-[#b38b59]" size={24} />
                                <span className="font-cinzel text-xs uppercase tracking-widest text-[#2c2522]">Créé à la main</span>
                            </div>
                            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
                                <Truck className="text-[#b38b59]" size={24} />
                                <span className="font-cinzel text-xs uppercase tracking-widest text-[#2c2522]">Envoi Magique</span>
                            </div>
                            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
                                <ShieldCheck className="text-[#b38b59]" size={24} />
                                <span className="font-cinzel text-xs uppercase tracking-widest text-[#2c2522]">Paiement Sécurisé</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-40">
                        <div className="flex flex-col items-center text-center mb-20">
                            <span className="font-architects text-[#b38b59] text-xl mb-4">Dans la même collection</span>
                            <h2 className="font-cinzel text-3xl md:text-5xl text-[#4a2128] uppercase tracking-widest">Autres Merveilles</h2>
                            <div className="w-1.5 h-1.5 bg-[#b38b59] rotate-45 mt-8" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-24 gap-x-12">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
