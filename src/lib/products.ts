import { collection, getDocs, doc, getDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '@/store/cart';

export async function getProductsFromFirebase(): Promise<Product[]> {
    try {
        const snap = await getDocs(collection(db, 'products'));
        return snap.docs.map(d => {
            const data = d.data();
            return {
                id: d.id,
                name: data.name || '',
                price: data.price || 0,
                description: data.description || '',
                category: data.category || '',
                image: data.images?.[0] || data.image || '',
                images: data.images || (data.image ? [data.image] : []),
                is_available: data.is_available !== false,
            } as Product & { images?: string[]; is_available?: boolean };
        }).filter((p: any) => p.is_available !== false);
    } catch (e) {
        console.error('Firebase fetch error:', e);
        return [];
    }
}

export async function getProductByIdFromFirebase(id: string): Promise<(Product & { images?: string[]; description?: string }) | null> {
    try {
        const snap = await getDoc(doc(db, 'products', id));
        if (!snap.exists()) return null;
        const data = snap.data();
        return {
            id: snap.id,
            name: data.name || '',
            price: data.price || 0,
            description: data.description || '',
            category: data.category || '',
            image: data.images?.[0] || data.image || '',
            images: data.images || (data.image ? [data.image] : []),
        };
    } catch (e) {
        console.error('Firebase fetch error:', e);
        return null;
    }
}

export async function getProductsByCategoryFromFirebase(category: string): Promise<Product[]> {
    try {
        const snap = await getDocs(collection(db, 'products'));
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
        return all
            .filter(p => p.is_available !== false && p.category?.toLowerCase() === category.toLowerCase())
            .map(p => ({
                id: p.id,
                name: p.name || '',
                price: p.price || 0,
                description: p.description || '',
                category: p.category || '',
                image: p.images?.[0] || p.image || '',
            }));
    } catch (e) {
        console.error('Firebase fetch error:', e);
        return [];
    }
}
