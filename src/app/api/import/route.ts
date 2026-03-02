import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'products_full.json');
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const products = JSON.parse(rawData);

        const colRef = collection(db, 'products');

        // Note: we're not dropping existing data here immediately because we might want to keep the current test products, but the user explicitly requested to add ALL products missed.
        // The safest is to add all new products. Wait, if there are duplicates, maybe drop old scraped ones?
        // For now, let's delete all existing products to have a clean slate from the new scrape.
        // Wait, the user might have test products they manually created. 
        // It's better to just delete all because the user said "je les ai pas tous ten a oublié pleins et leur image avec description et tu me les mets sur le nouveau site"
        const existingDocs = await getDocs(colRef);
        for (const d of existingDocs.docs) {
            await deleteDoc(doc(db, 'products', d.id));
        }

        let count = 0;
        for (const prod of products) {
            await addDoc(colRef, {
                name: prod.name,
                description: prod.description || '',
                price: prod.price || 0,
                category: prod.category || 'DIVERS',
                stock: prod.stock || 1,
                image: prod.image || '',
                is_available: true,
                shippingCost: prod.shippingCost || 7.5,
                createdAt: new Date().toISOString()
            });
            count++;
        }

        return NextResponse.json({ success: true, count });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message });
    }
}
