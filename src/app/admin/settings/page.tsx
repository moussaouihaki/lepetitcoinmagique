'use client';

import { useEffect, useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Settings, Image as ImageIcon, Plus, Trash2, Loader2, UploadCloud, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface GalleryItem {
    id: string;
    url: string;
    storagePath?: string;
}

export default function AdminSettingsPage() {
    // Settings state
    const [shippingCost, setShippingCost] = useState('11');
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [savingSettings, setSavingSettings] = useState(false);
    const [savedSettings, setSavedSettings] = useState(false);

    // Gallery state
    const [images, setImages] = useState<GalleryItem[]>([]);
    const [loadingGallery, setLoadingGallery] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        // Fetch Settings
        getDoc(doc(db, 'settings', 'shop')).then(snap => {
            if (snap.exists()) setShippingCost((snap.data().shippingCost ?? 11).toString());
        }).catch(console.error).finally(() => setLoadingSettings(false));

        // Fetch Gallery
        const fetchImages = async () => {
            try {
                const snap = await getDocs(collection(db, 'gallery'));
                setImages(snap.docs.map(d => ({ id: d.id, ...d.data() })) as GalleryItem[]);
            } catch (e) { console.error(e); }
            finally { setLoadingGallery(false); }
        };
        fetchImages();
    }, []);

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingSettings(true); setSavedSettings(false);
        try {
            await setDoc(doc(db, 'settings', 'shop'), {
                shippingCost: parseFloat(shippingCost) || 0,
            }, { merge: true });
            setSavedSettings(true);
            setTimeout(() => setSavedSettings(false), 3000);
        } catch (e) { console.error(e); }
        finally { setSavingSettings(false); }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const storagePath = `gallery/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, storagePath);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            const docRef = await addDoc(collection(db, 'gallery'), {
                url,
                storagePath,
                createdAt: new Date()
            });

            setImages([{ id: docRef.id, url, storagePath }, ...images]);
        } catch (e) {
            console.error(e);
            alert("Erreur lors de l'upload. Vérifiez la taille du fichier.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (img: GalleryItem) => {
        if (!confirm("Supprimer cette image de l'échoppe ?")) return;

        try {
            // Delete from Firestore
            await deleteDoc(doc(db, 'gallery', img.id));

            // Delete from Storage if path exists
            if (img.storagePath) {
                const fileRef = ref(storage, img.storagePath);
                await deleteObject(fileRef).catch(err => console.warn("Storage delete failed", err));
            }

            setImages(images.filter(i => i.id !== img.id));
        } catch (e) { console.error(e); }
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto md:mx-0 min-h-screen">
            <h1 className="font-cinzel text-3xl text-[#4a2128] tracking-widest uppercase mb-2 text-center md:text-left">Paramètres</h1>
            <p className="font-architects text-gray-500 mb-12 text-center md:text-left italic">Personnalisez votre coin magique</p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* SETTINGS COLUMN */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-[#b38b59]/10 rounded-xl">
                                <Settings size={22} className="text-[#b38b59]" />
                            </div>
                            <h2 className="font-cinzel text-[#4a2128] text-xl tracking-wider">Boutique</h2>
                        </div>

                        <form onSubmit={handleSaveSettings} className="space-y-6">
                            <div>
                                <label className="block font-architects text-sm text-gray-500 mb-2 px-1">Coût de livraison par défaut (CHF)</label>
                                <input
                                    type="number" step="0.05"
                                    value={shippingCost}
                                    onChange={e => setShippingCost(e.target.value)}
                                    className="w-full bg-[#fdfaf6] border border-gray-100 rounded-2xl px-5 py-4 font-cinzel text-[#4a2128] focus:outline-none focus:ring-2 focus:ring-[#b38b59]/20 transition-all"
                                />
                            </div>

                            <button
                                disabled={savingSettings}
                                className={`w-full py-4 rounded-2xl font-cinzel tracking-widest uppercase text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#4a2128]/10 ${savedSettings ? 'bg-green-600 text-white' : 'bg-[#4a2128] text-white hover:bg-[#b38b59]'}`}
                            >
                                {savingSettings ? <Loader2 size={18} className="animate-spin" /> : (savedSettings ? <CheckCircle size={18} /> : 'Enregistrer')}
                                {savedSettings ? 'Sauvegardé !' : ''}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-50">
                            <p className="font-architects text-gray-400 text-xs leading-relaxed italic">
                                * Note : Le coût de livraison individuel d'un produit prime sur ce réglage général s'il est défini.
                            </p>
                        </div>
                    </div>
                </div>

                {/* GALLERY COLUMN */}
                <div className="lg:col-span-8">
                    <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#4a2128]/5 rounded-xl text-[#4a2128]">
                                    <ImageIcon size={22} />
                                </div>
                                <div>
                                    <h2 className="font-cinzel text-[#4a2128] text-xl tracking-wider">Galerie Photo</h2>
                                    <p className="font-architects text-gray-400 text-xs mt-1 italic">Images visibles sur la page contact</p>
                                </div>
                            </div>

                            <label className={`cursor-pointer flex items-center gap-3 px-6 py-3 rounded-2xl font-cinzel text-xs tracking-widest uppercase transition-all shadow-md group ${uploading ? 'bg-gray-100 text-gray-400' : 'bg-[#4a2128] text-white hover:bg-[#b38b59] hover:translate-y-[-2px]'}`}>
                                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                                {uploading ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16} className="group-hover:animate-bounce" />}
                                {uploading ? 'Upload...' : 'Nouvelle Photo'}
                            </label>
                        </div>

                        {loadingGallery ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[4/5] bg-gray-50 rounded-2xl animate-pulse" />)}
                            </div>
                        ) : images.length === 0 ? (
                            <div className="py-24 text-center border-2 border-dashed border-gray-50 rounded-3xl">
                                <ImageIcon size={48} className="mx-auto mb-4 text-[#b38b59]/20" />
                                <p className="font-architects text-gray-400 italic">L'échoppe est encore vide d'images...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {images.map((img) => (
                                    <div key={img.id} className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-50 shadow-sm border-4 border-white hover:shadow-xl transition-all duration-500">
                                        <Image src={img.url} alt="Boutique" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                            <button
                                                onClick={() => handleDeleteImage(img)}
                                                className="p-3 bg-red-500 text-white rounded-2xl hover:bg-black transition-colors shadow-lg hover:scale-110 active:scale-95 duration-200"
                                                title="Supprimer l'image"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
