import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAmPzXjDB2_Mghg8fpoOaTokQSeyvQnbz8",
    authDomain: "lepetitcoinmagique-3cab8.firebaseapp.com",
    projectId: "lepetitcoinmagique-3cab8",
    storageBucket: "lepetitcoinmagique-3cab8.firebasestorage.app",
    messagingSenderId: "588757720945",
    appId: "1:588757720945:web:2ca62deb422fdbaa44a0d0",
    measurementId: "G-BS4SYP3H2K"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
