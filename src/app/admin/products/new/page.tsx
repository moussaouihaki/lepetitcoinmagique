'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Upload, X, Loader2, Package } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '', description: '', price: '', category: '', is_available: true, stock: '1',
    });
    const [existingCategories, setExistingCategories] = useState<string[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        getDocs(collection(db, 'products')).then(snap => {
            const cats = [...new Set(snap.docs.map(d => (d.data().category || '').toUpperCase()).filter(Boolean))];
            setExistingCategories(cats);
        });
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + images.length > 5) { setError('Maximum 5 images'); return; }
        setImages(prev => [...prev, ...files]);
        setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removeImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
        setPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const uploadImage = async (file: File): Promise<string> => {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        const task = uploadBytesResumable(storageRef, file);
        return new Promise((resolve, reject) => {
            task.on('state_changed', s => setUploadProgress((s.bytesTransferred / s.totalBytes) * 100), reject,
                async () => resolve(await getDownloadURL(task.snapshot.ref)));
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.price) { setError('Nom et prix requis'); return; }
        setUploading(true); setError('');
        try {
            const imageUrls: string[] = [];
            for (const img of images) imageUrls.push(await uploadImage(img));
            const stockNum = parseInt(form.stock) || 0;
            await addDoc(collection(db, 'products'), {
                name: form.name, description: form.description,
                price: parseFloat(form.price),
                category: form.category.toUpperCase(),
                is_available: form.is_available && stockNum > 0,
                stock: stockNum,
                images: imageUrls, image: imageUrls[0] || '',
                createdAt: serverTimestamp(),
            });
            router.push('/admin/products');
        } catch (e: any) { setError(e.message || 'Erreur'); }
        finally { setUploading(false); }
    };

    const stockNum = parseInt(form.stock) || 0;

    return (
        <div className="p-8 max-w-3xl">
            <Link href="/admin/products" className="flex items-center gap-2 text-gray-500 hover:text-[#4a2128] transition-colors mb-8 font-architects text-sm">
                <ArrowLeft size={16} /> Retour aux produits
            </Link>
            <h1 className="font-cinzel text-3xl text-[#4a2128] tracking-widest uppercase mb-8">Nouveau Produit</h1>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 font-architects text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Images */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <h2 className="font-cinzel text-[#4a2128] text-lg mb-2">Photos du produit</h2>
                    <p className="text-gray-400 text-sm font-architects mb-4">Jusqu'à 5 photos. La première sera l'image principale.</p>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                        {previews.map((preview, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group">
                                <Image src={preview} alt="" fill className="object-cover" />
                                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                                {idx === 0 && <span className="absolute bottom-1 left-1 bg-[#b38b59] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Principal</span>}
                            </div>
                        ))}
                        {previews.length < 5 && (
                            <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-[#b38b59]/50 flex flex-col items-center justify-center cursor-pointer transition-colors group bg-gray-50">
                                <Upload size={20} className="text-gray-400 group-hover:text-[#b38b59] transition-colors" />
                                <span className="text-gray-400 text-xs mt-1 group-hover:text-[#b38b59]">Ajouter</span>
                                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                            </label>
                        )}
                    </div>
                    {uploading && <div className="bg-gray-100 rounded-xl overflow-hidden"><div className="h-1.5 bg-[#b38b59]" style={{ width: `${uploadProgress}%`, transition: 'width 0.3s' }} /></div>}
                </div>

                {/* Infos */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
                    <h2 className="font-cinzel text-[#4a2128] text-lg">Informations</h2>
                    <div>
                        <label className="block text-gray-600 text-sm font-architects mb-2">Nom du produit *</label>
                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Le Chaudron de Merlin" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b38b59]/60 font-architects" />
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm font-architects mb-2">Description</label>
                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Décrivez votre création artisanale..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b38b59]/60 font-architects resize-none" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-600 text-sm font-architects mb-2">Prix (CHF) *</label>
                            <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b38b59]/60 font-architects" />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-architects mb-2 flex items-center gap-1"><Package size={14} /> Stock *</label>
                            <input type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-800 focus:outline-none font-architects ${stockNum === 0 ? 'border-red-300' : 'border-gray-200 focus:border-[#b38b59]/60'}`} />
                            {stockNum === 0 && <p className="text-red-500 text-xs mt-1 font-architects">→ Rupture de stock</p>}
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm font-architects mb-2">
                                Catégorie <span className="text-[#b38b59] text-xs">(ou nouvelle)</span>
                            </label>
                            <input
                                type="text"
                                list="categories-list"
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value.toUpperCase() })}
                                placeholder="Ex: BIJOUX"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 uppercase focus:outline-none focus:border-[#b38b59]/60 font-architects"
                            />
                            <datalist id="categories-list">
                                {existingCategories.map(c => <option key={c} value={c} />)}
                            </datalist>
                            <p className="text-gray-400 text-xs mt-1 font-architects">Tape un nom pour créer une nouvelle catégorie</p>
                        </div>
                    </div>

                    {/* Stock status preview */}
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                        <span className="font-architects text-gray-600 text-sm">Statut en boutique :</span>
                        {stockNum > 0
                            ? <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-architects font-medium">✓ En stock ({stockNum})</span>
                            : <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-architects font-medium">✗ Rupture de stock</span>
                        }
                    </div>

                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="available" checked={form.is_available} onChange={e => setForm({ ...form, is_available: e.target.checked })} className="w-4 h-4 rounded accent-[#b38b59]" />
                        <label htmlFor="available" className="text-gray-600 font-architects text-sm cursor-pointer">Produit visible dans la boutique (si stock &gt; 0)</label>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Link href="/admin/products" className="flex-1">
                        <button type="button" className="w-full bg-gray-100 border border-gray-200 text-gray-600 hover:text-[#4a2128] font-cinzel tracking-widest py-4 rounded-xl transition-all">Annuler</button>
                    </Link>
                    <button type="submit" disabled={uploading} className="flex-1 bg-[#4a2128] hover:bg-[#b38b59] text-white font-cinzel tracking-widest py-4 rounded-xl transition-all uppercase flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm">
                        {uploading ? <><Loader2 size={18} className="animate-spin" /> Création...</> : 'Créer le produit'}
                    </button>
                </div>
            </form>
        </div>
    );
}
