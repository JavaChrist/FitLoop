// Remplis avec tes variables d'environnement Firebase
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Variables d'environnement nécessaires :
// VITE_FIREBASE_API_KEY=...
// VITE_FIREBASE_AUTH_DOMAIN=fitloop-xxx.firebaseapp.com
// VITE_FIREBASE_PROJECT_ID=fitloop-xxx
// VITE_FIREBASE_STORAGE_BUCKET=fitloop-xxx.appspot.com
// VITE_FIREBASE_MESSAGING_SENDER_ID=...
// VITE_FIREBASE_APP_ID=...
// VITE_MOLLIE_API_KEY=test_xxx (ou live_xxx en production)
