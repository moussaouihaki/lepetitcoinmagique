'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCartStore } from '@/store/cart';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, Sparkles, Package } from 'lucide-react';

interface Product {
    id: string; name: string; description: string; price: number;
    category: string; image: string; images?: string[]; stock?: number; is_available?: boolean; shippingCost?: number;
}

export default function ProductPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const { addItem } = useCartStore();

    const [product, setProduct] = useState<Product | null>(null);
    const [related, setRelated] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const [activeImage, setActiveImage] = useState<string>('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const snap = await getDoc(doc(db, 'products', id));
                if (!snap.exists()) { setLoading(false); return; }
                const data = snap.data();
                const p: Product = {
                    id: snap.id,
                    name: data.name || '',
                    description: data.description || '',
                    price: data.price || 0,
                    category: data.category || '',
                    image: data.images?.[0] || data.image || '',
                    images: data.images || (data.image ? [data.image] : []),
                    stock: data.stock,
                    is_available: data.is_available,
                    shippingCost: data.shippingCost || 7.5,
                };
                setProduct(p);
                setActiveImage(p.image);

                // Fetch related
                const allSnap = await getDocs(collection(db, 'products'));
                const allProds = allSnap.docs
                    .filter(d => d.id !== id && d.data().category === data.category && d.data().is_available !== false)
                    .slice(0, 4)
                    .map(d => ({
                        id: d.id,
                        name: d.data().name || '',
                        description: d.data().description || '',
                        price: d.data().price || 0,
                        category: d.data().category || '',
                        image: d.data().images?.[0] || d.data().image || '',
                    }));
                setRelated(allProds);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addItem({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, description: product.description || '', shippingCost: product.shippingCost || 7.5 });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const outOfStock = product?.stock !== undefined && product.stock <= 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdfaf6] pt-40 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#b38b59] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="font-cinzel text-4xl text-[#4a2128] mb-4">Artefact Introuvable</h1>
                <p className="font-architects text-xl text-gray-600 mb-8">Cet objet mystique semble avoir disparu de notre grimoire.</p>
                <Link href="/#boutique" className="font-cinzel text-[#b38b59] hover:underline flex items-center gap-2">
                    <ArrowLeft size={20} /> Retour aux Curiosités
                </Link>
            </div>
        );
    }

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
                    {/* Gallery */}
                    <div className="flex flex-col gap-6">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-[#b38b59]/5 blur-3xl rounded-full scale-75 -z-10" />
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-white p-4 border border-[#b38b59]/20 shadow-lg">
                                <div className="relative w-full h-full border border-[#b38b59]/10">
                                    {activeImage ? (
                                        <Image src={activeImage} alt={product.name} fill className="object-contain p-8 transition-opacity duration-500" priority />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package size={64} className="text-gray-200" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-[#b38b59]/40" />
                            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-[#b38b59]/40" />
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex flex-wrap gap-4 mt-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-24 h-24 overflow-hidden border transition-all duration-300 bg-white ${activeImage === img ? 'border-[#b38b59] scale-105 shadow-md' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                                    >
                                        <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover p-1" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
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

                            {/* Stock badge */}
                            {product.stock !== undefined && (
                                <p className={`font-architects text-sm mt-3 ${outOfStock ? 'text-red-500' : product.stock <= 3 ? 'text-orange-500' : 'text-green-600'}`}>
                                    {outOfStock ? '✗ Rupture de stock' : product.stock <= 3 ? `⚠ Plus que ${product.stock} en stock` : `✓ En stock (${product.stock})`}
                                </p>
                            )}
                        </div>

                        <div className="font-architects text-lg lg:text-xl text-gray-600 leading-relaxed mb-12 space-y-6">
                            <p>{product.description}</p>
                            <p>Chaque pièce est unique et imprégnée de l'énergie de notre atelier jurassien. La fabrication artisanale peut entraîner de légères variations de couleur ou de forme, témoignant du caractère authentique de votre artefact.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 mb-16">
                            <button
                                onClick={handleAddToCart}
                                disabled={outOfStock}
                                className={`flex-1 font-cinzel text-xl tracking-widest py-6 px-10 border transition-all duration-500 uppercase flex items-center justify-center gap-4 group ${outOfStock
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : added
                                        ? 'bg-[#b38b59] text-white border-[#b38b59]'
                                        : 'bg-[#4a2128] text-white border-[#4a2128] hover:bg-transparent hover:text-[#4a2128]'
                                    }`}
                            >
                                <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                                {outOfStock ? 'Rupture de stock' : added ? 'Ajouté !' : 'Ajouter au Grimoire'}
                            </button>
                        </div>

                        {/* Reassurance */}
                        <div className="grid grid-cols-3 gap-8 py-10 border-t border-[#b38b59]/20">
                            {[
                                { icon: Sparkles, label: 'Créé à la main' },
                                { icon: Truck, label: 'Envoi Magique' },
                                { icon: ShieldCheck, label: 'Paiement Sécurisé' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex flex-col items-center text-center gap-3">
                                    <Icon className="text-[#b38b59]" size={24} />
                                    <span className="font-cinzel text-xs uppercase tracking-widest text-[#2c2522]">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <div className="mt-40">
                        <div className="flex flex-col items-center text-center mb-20">
                            <span className="font-architects text-[#b38b59] text-xl mb-4">Dans la même collection</span>
                            <h2 className="font-cinzel text-3xl md:text-5xl text-[#4a2128] uppercase tracking-widest">Autres Merveilles</h2>
                            <div className="w-1.5 h-1.5 bg-[#b38b59] rotate-45 mt-8" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-24 gap-x-12">
                            {related.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
