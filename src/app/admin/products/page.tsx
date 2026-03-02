'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Pencil, Trash2, Package, ChevronDown, DownloadCloud } from 'lucide-react';
import { addDoc } from 'firebase/firestore';

interface Product {
    id: string; name: string; description: string; price: number;
    category: string; image: string; is_available: boolean; stock?: number;
}

const CATEGORIES = [
    'Toutes les catégories',
    'LES PETITS CHAUDRONS', 'POTERIE', 'FORGE', 'PYROGRAVURE',
    'GRAVURE SUR VERRE', 'BIJOUX', 'LES POILUS', 'CURIOSITÉS',
];

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('Toutes les catégories');
    const [deleting, setDeleting] = useState<string | null>(null);
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const snap = await getDocs(collection(db, 'products'));
                const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Product[];
                setProducts(data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer ce produit définitivement ?')) return;
        setDeleting(id);
        try {
            await deleteDoc(doc(db, 'products', id));
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (e) { console.error(e); }
        finally { setDeleting(null); }
    };

    const handleImport = async () => {
        if (!confirm("Voulez-vous importer tous les anciens produits depuis le site original ? Cela rajoutera les produits manquants.")) return;
        setImporting(true);
        try {
            const res = await fetch('/data/products_full.json');
            const newProducts = await res.json();

            let count = 0;
            for (const p of newProducts) {
                // Check if product with exact same name already exists to avoid duplicates
                const exists = products.some(existing => existing.name.trim().toLowerCase() === p.name.trim().toLowerCase());
                if (!exists) {
                    await addDoc(collection(db, 'products'), {
                        name: p.name,
                        description: p.description || '',
                        price: p.price || 0,
                        category: p.category || 'DIVERS',
                        stock: p.stock || 1,
                        image: p.image || '',
                        is_available: p.is_available !== false,
                        shippingCost: p.shippingCost || 7.5,
                        createdAt: new Date().toISOString()
                    });
                    count++;
                }
            }
            alert(`Importation réussie ! ${count} nouveaux produits ajoutés (les doublons ont été ignorés). Rechargez la page.`);
            window.location.reload();
        } catch (e: any) {
            console.error(e);
            alert("Erreur lors de l'import: " + e.message);
        } finally {
            setImporting(false);
        }
    };

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCategory === 'Toutes les catégories' ||
            p.category.toUpperCase() === filterCategory.toUpperCase();
        return matchSearch && matchCat;
    }).sort((a, b) => {
        // First sort by category
        const catCompare = a.category.localeCompare(b.category);
        if (catCompare !== 0) return catCompare;
        // Then sort by name
        return a.name.localeCompare(b.name);
    });

    // Unique categories from real data
    const realCategories = ['Toutes les catégories', ...Array.from(new Set(products.map(p => p.category.toUpperCase())))];

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="font-cinzel text-3xl text-[#4a2128] tracking-widest uppercase">Produits</h1>
                    <p className="text-gray-500 font-architects mt-1">
                        {products.length} produit{products.length !== 1 ? 's' : ''} dans le catalogue
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleImport}
                        disabled={importing}
                        className="flex items-center gap-2 bg-white text-[#4a2128] border border-[#b38b59]/20 hover:bg-[#fdfaf6] font-cinzel tracking-widest py-3 px-6 rounded-xl transition-all duration-300 uppercase text-sm shadow-sm disabled:opacity-50"
                    >
                        <DownloadCloud size={18} /> {importing ? 'Importation en cours...' : 'Importer anciens produits'}
                    </button>
                    <Link href="/admin/products/new">
                        <button className="flex items-center gap-2 bg-[#4a2128] hover:bg-[#b38b59] text-white font-cinzel tracking-widest py-3 px-6 rounded-xl transition-all duration-300 uppercase text-sm shadow-sm">
                            <Plus size={18} /> Ajouter un produit
                        </button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b38b59]/60 font-architects shadow-sm"
                    />
                </div>
                <div className="relative">
                    <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-gray-700 focus:outline-none focus:border-[#b38b59]/60 font-architects shadow-sm cursor-pointer min-w-[200px]"
                    >
                        {realCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left p-5 text-gray-500 font-architects text-xs font-semibold uppercase tracking-wider">Produit</th>
                                <th className="text-left p-5 text-gray-500 font-architects text-xs font-semibold uppercase tracking-wider">Catégorie</th>
                                <th className="text-left p-5 text-gray-500 font-architects text-xs font-semibold uppercase tracking-wider">Prix</th>
                                <th className="text-left p-5 text-gray-500 font-architects text-xs font-semibold uppercase tracking-wider">Stock</th>
                                <th className="text-left p-5 text-gray-500 font-architects text-xs font-semibold uppercase tracking-wider">Statut</th>
                                <th className="text-right p-5 text-gray-500 font-architects text-xs font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="p-5"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-gray-100 rounded-xl animate-pulse" /><div className="h-4 w-32 bg-gray-100 rounded animate-pulse" /></div></td>
                                        <td className="p-5"><div className="h-4 w-24 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="p-5"><div className="h-4 w-16 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="p-5"><div className="h-4 w-16 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="p-5"><div className="h-4 w-20 bg-gray-100 rounded animate-pulse ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-16 text-center">
                                        <Package size={40} className="text-gray-200 mx-auto mb-3" />
                                        <p className="text-gray-400 font-architects">Aucun produit trouvé</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                                    {product.image ? (
                                                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-gray-300" /></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-architects text-gray-800 text-sm font-medium">{product.name}</p>
                                                    <p className="text-gray-400 text-xs mt-0.5 truncate max-w-[200px]">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="bg-[#4a2128]/5 text-[#4a2128] border border-[#4a2128]/10 px-2.5 py-1 rounded-full text-xs font-architects font-medium whitespace-nowrap">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className="font-architects font-bold text-gray-800 text-sm">{(product.price || 0).toFixed(2)} CHF</span>
                                        </td>
                                        <td className="p-5">
                                            {product.stock !== undefined ? (
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-architects font-medium whitespace-nowrap ${product.stock === 0 ? 'bg-red-100 text-red-600' :
                                                    product.stock <= 3 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {product.stock === 0 ? 'Rupture' : `${product.stock}`}
                                                </span>
                                            ) : <span className="text-gray-400 text-xs">—</span>}
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-architects font-medium whitespace-nowrap ${(product.stock !== undefined && product.stock === 0) ? 'bg-red-100 text-red-600' :
                                                product.is_available !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {(product.stock !== undefined && product.stock === 0) ? 'Rupture' : product.is_available !== false ? 'En ligne' : 'Masqué'}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Link href={`/admin/products/${product.id}`}>
                                                    <button className="p-2 text-gray-400 hover:text-[#4a2128] hover:bg-gray-100 rounded-lg transition-colors">
                                                        <Pencil size={16} />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={deleting === product.id}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 size={16} />
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

            {filtered.length > 0 && (
                <p className="text-gray-400 font-architects text-sm mt-4 text-center">
                    {filtered.length} produit{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}
                    {filterCategory !== 'Toutes les catégories' ? ` dans "${filterCategory}"` : ''}
                </p>
            )}
        </div>
    );
}
