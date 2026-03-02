'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    images?: string[];
    is_available?: boolean;
    description?: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            const snap = await getDocs(collection(db, 'products'));
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Product[];
            setProducts(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Supprimer "${name}" ?`)) return;
        setDeletingId(id);
        try {
            await deleteDoc(doc(db, 'products', id));
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (e) {
            console.error(e);
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-cinzel text-3xl text-white tracking-widest uppercase">Produits</h1>
                    <p className="text-gray-500 font-architects mt-1">{products.length} produit{products.length !== 1 ? 's' : ''} dans le catalogue</p>
                </div>
                <Link href="/admin/products/new">
                    <button className="flex items-center gap-2 bg-[#b38b59] hover:bg-[#c9a06e] text-white font-cinzel tracking-widest px-6 py-3 rounded-xl transition-all duration-200 uppercase text-sm">
                        <Plus size={18} />
                        Ajouter un produit
                    </button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#b38b59]/50 transition-colors font-architects"
                />
            </div>

            {/* Table */}
            <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="text-left p-5 text-gray-500 font-architects text-sm font-normal">Produit</th>
                            <th className="text-left p-5 text-gray-500 font-architects text-sm font-normal">Catégorie</th>
                            <th className="text-left p-5 text-gray-500 font-architects text-sm font-normal">Prix</th>
                            <th className="text-left p-5 text-gray-500 font-architects text-sm font-normal">Dispo</th>
                            <th className="text-right p-5 text-gray-500 font-architects text-sm font-normal">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <td key={j} className="p-5">
                                            <div className="h-4 bg-white/5 rounded animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center">
                                    <Package size={40} className="text-gray-700 mx-auto mb-3" />
                                    <p className="text-gray-600 font-architects">Aucun produit trouvé</p>
                                </td>
                            </tr>
                        ) : (
                            filtered.map((product) => (
                                <tr key={product.id} className="hover:bg-white/2 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                                {(product.images?.[0] || product.image) ? (
                                                    <Image
                                                        src={product.images?.[0] || product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <Package size={20} className="text-gray-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-white font-architects text-sm">{product.name}</p>
                                                <p className="text-gray-600 text-xs mt-0.5 truncate max-w-[200px]">{product.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="bg-[#b38b59]/10 text-[#b38b59] border border-[#b38b59]/20 px-3 py-1 rounded-full text-xs font-architects">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="p-5 text-white font-architects text-sm font-bold">{product.price?.toFixed(2)} CHF</td>
                                    <td className="p-5">
                                        <span className={`px-2 py-1 rounded-full text-xs border font-architects ${product.is_available !== false
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {product.is_available !== false ? 'Disponible' : 'Masqué'}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/products/${product.id}`}>
                                                <button className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20">
                                                    <Pencil size={15} />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                disabled={deletingId === product.id}
                                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 disabled:opacity-50"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
