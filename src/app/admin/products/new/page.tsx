'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
    'Les Petits Chaudrons', 'Poterie', 'Forge', 'Pyrogravure',
    'Gravure sur Verre', 'Bijoux', 'Les Poilus', 'Curiosité'
];

export default function NewProductPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '', description: '', price: '', category: CATEGORIES[0], is_available: true,
    });
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + images.length > 5) {
            setError('Maximum 5 images');
            return;
        }
        setImages(prev => [...prev, ...files]);
        const newPreviews = files.map(f => URL.createObjectURL(f));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
        setPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const uploadImage = async (file: File): Promise<string> => {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                },
                reject,
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(url);
                }
            );
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.price) { setError('Nom et prix requis'); return; }
        setUploading(true);
        setError('');
        try {
            let imageUrls: string[] = [];
            for (let i = 0; i < images.length; i++) {
                const url = await uploadImage(images[i]);
                imageUrls.push(url);
            }
            await addDoc(collection(db, 'products'), {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                category: form.category,
                is_available: form.is_available,
                images: imageUrls,
                image: imageUrls[0] || '',
                createdAt: serverTimestamp(),
            });
            router.push('/admin/products');
        } catch (e: any) {
            setError(e.message || 'Erreur lors de la création');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-8 max-w-3xl">
            {/* Back */}
            <Link href="/admin/products" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 font-architects text-sm">
                <ArrowLeft size={16} /> Retour aux produits
            </Link>

            <h1 className="font-cinzel text-3xl text-white tracking-widest uppercase mb-8">Nouveau Produit</h1>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6 font-architects text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Images Upload */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                    <h2 className="font-cinzel text-white text-lg mb-4">Photos du produit</h2>
                    <p className="text-gray-500 text-sm font-architects mb-4">Jusqu'à 5 photos. La première sera l'image principale.</p>

                    <div className="grid grid-cols-5 gap-3 mb-4">
                        {previews.map((preview, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-white/5 group">
                                <Image src={preview} alt="" fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                                {idx === 0 && (
                                    <span className="absolute bottom-1 left-1 bg-[#b38b59] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Principal</span>
                                )}
                            </div>
                        ))}
                        {previews.length < 5 && (
                            <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-[#b38b59]/50 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                                <Upload size={20} className="text-gray-600 group-hover:text-[#b38b59] transition-colors" />
                                <span className="text-gray-700 text-xs mt-1 group-hover:text-[#b38b59]">Ajouter</span>
                                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                            </label>
                        )}
                    </div>

                    {uploading && (
                        <div className="bg-white/5 rounded-xl overflow-hidden">
                            <div className="h-1.5 bg-[#b38b59]" style={{ width: `${uploadProgress}%`, transition: 'width 0.3s' }} />
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-6 space-y-5">
                    <h2 className="font-cinzel text-white text-lg">Informations</h2>

                    <div>
                        <label className="block text-gray-400 text-sm font-architects mb-2">Nom du produit *</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="Ex: Le Chaudron de Merlin"
                            required
                            className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#b38b59]/50 font-architects"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-architects mb-2">Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            rows={4}
                            placeholder="Décrivez votre création artisanale..."
                            className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#b38b59]/50 font-architects resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-architects mb-2">Prix (CHF) *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                placeholder="0.00"
                                required
                                className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#b38b59]/50 font-architects"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-architects mb-2">Catégorie</label>
                            <select
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b38b59]/50 font-architects"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="available"
                            checked={form.is_available}
                            onChange={e => setForm({ ...form, is_available: e.target.checked })}
                            className="w-4 h-4 rounded accent-[#b38b59]"
                        />
                        <label htmlFor="available" className="text-gray-400 font-architects text-sm cursor-pointer">
                            Produit visible dans la boutique
                        </label>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Link href="/admin/products" className="flex-1">
                        <button type="button" className="w-full bg-white/5 border border-white/10 text-gray-400 hover:text-white font-cinzel tracking-widest py-4 rounded-xl transition-all">
                            Annuler
                        </button>
                    </Link>
                    <button
                        type="submit"
                        disabled={uploading}
                        className="flex-1 bg-[#b38b59] hover:bg-[#c9a06e] text-white font-cinzel tracking-widest py-4 rounded-xl transition-all uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {uploading ? <><Loader2 size={18} className="animate-spin" /> Création en cours...</> : 'Créer le produit'}
                    </button>
                </div>
            </form>
        </div>
    );
}
