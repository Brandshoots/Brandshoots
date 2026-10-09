import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCENlBE_JcwqlhafEM8sh_L35MXMOKyRgM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "brandshoots-admin.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "brandshoots-admin",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "brandshoots-admin.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "896330956887",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:896330956887:web:c09e3e9157f5e3874f2312",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-76QE1H52KW",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://brandshoots-admin-default-rtdb.firebaseio.com",
};

// Initialize or reuse Firebase App singleton
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth with local persistence
export const firebaseAuth = getAuth(firebaseApp);
try {
  setPersistence(firebaseAuth, browserLocalPersistence).catch(() => {
    // Ignore persistence errors in private browsing / memory environments
  });
} catch {
  // Ignore in SSR
}

// Initialize Realtime Database
export const firebaseDb = getDatabase(firebaseApp, firebaseConfig.databaseURL);
