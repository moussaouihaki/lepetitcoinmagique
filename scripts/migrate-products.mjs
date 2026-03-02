/**
 * Script de migration COMPLET :
 * 1. Télécharge chaque image depuis l'URL externe
 * 2. L'uploade dans Firebase Storage (tes serveurs)
 * 3. Enregistre le produit dans Firestore avec la nouvelle URL Firebase
 *
 * Exécuter avec : node scripts/migrate-products.mjs
 * (Nécessite d'être connecté : renseignez ADMIN_EMAIL et ADMIN_PASSWORD en bas du fichier)
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const firebaseConfig = {
    apiKey: "AIzaSyAmPzXjDB2_Mghg8fpoOaTokQSeyvQnbz8",
    authDomain: "lepetitcoinmagique-3cab8.firebaseapp.com",
    projectId: "lepetitcoinmagique-3cab8",
    storageBucket: "lepetitcoinmagique-3cab8.firebasestorage.app",
    messagingSenderId: "588757720945",
    appId: "1:588757720945:web:2ca62deb422fdbaa44a0d0",
};

// ===== IDENTIFIANTS ADMIN FIREBASE =====
const ADMIN_EMAIL = 'admin@lepetitcoinmagique.com';
const ADMIN_PASSWORD = 'Test123';
// ========================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const products = JSON.parse(readFileSync(join(__dirname, '../data/products.json'), 'utf8'));

async function downloadImage(url) {
    const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!response.ok) throw new Error(`Failed to download: ${url} (${response.status})`);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
}

async function uploadToFirebase(imageBuffer, filename, mimeType = 'image/jpeg') {
    const storageRef = ref(storage, `products/${filename}`);
    const snapshot = await uploadBytes(storageRef, imageBuffer, { contentType: mimeType });
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
}

function getFilename(url, id) {
    try {
        const parts = new URL(url).pathname.split('/');
        const original = parts[parts.length - 1];
        return `product_${id}_${original}`;
    } catch {
        return `product_${id}.jpg`;
    }
}

async function migrate() {
    console.log('\n🔐 Connexion à Firebase...');
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Connecté !\n');

    // Supprimer les anciens produits
    const existing = await getDocs(collection(db, 'products'));
    if (existing.size > 0) {
        console.log(`⚠️  Suppression de ${existing.size} produits existants...`);
        await Promise.all(existing.docs.map(d => deleteDoc(d.ref)));
        console.log('✅ Supprimés.\n');
    }

    console.log(`📦 Migration de ${products.length} produits...\n`);

    let count = 0;
    let errors = 0;

    for (const product of products) {
        try {
            let firebaseImageUrl = '';

            if (product.image) {
                process.stdout.write(`  ⬇️  Téléchargement image ${count + 1}/${products.length}...`);
                const imageBuffer = await downloadImage(product.image);
                const filename = getFilename(product.image, product.id);
                firebaseImageUrl = await uploadToFirebase(imageBuffer, filename);
                process.stdout.write(` ✅ Uploadée\n`);
            }

            await addDoc(collection(db, 'products'), {
                name: product.name,
                description: product.description || '',
                price: product.price,
                category: product.category,
                image: firebaseImageUrl,
                images: firebaseImageUrl ? [firebaseImageUrl] : [],
                is_available: true,
                createdAt: new Date(),
            });

            count++;
            console.log(`  ✓ ${count}/${products.length} - "${product.name}" → Firebase ✨`);
        } catch (e) {
            errors++;
            console.error(`  ❌ Erreur pour "${product.name}": ${e.message}`);
        }
    }

    console.log(`\n🎉 Migration terminée !`);
    console.log(`   ✅ ${count} produits importés avec images Firebase`);
    if (errors > 0) console.log(`   ⚠️  ${errors} erreurs (produits sans image)`);
    console.log('');
    process.exit(0);
}

migrate().catch(e => {
    console.error('\n❌ Erreur fatale :', e.message);
    process.exit(1);
});
