import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection } from 'firebase/firestore';

console.log(import.meta.env);

const firebaseConfig = {
  apiKey: import.meta.env.RENDERER_VITE_FIREBASE_CONFIG_API_KEY,
  authDomain: import.meta.env.RENDERER_VITE_FIREBASE_CONFIG_AUTH_DOMAIN,
  projectId: import.meta.env.RENDERER_VITE_FIREBASE_CONFIG_PROJECT_ID,
  storageBucket: import.meta.env.RENDERER_VITE_FIREBASE_CONFIG_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.RENDERER_VITE_FIREBASE_CONFIG_MESSAGING_SENDER_ID,
  appId: import.meta.env.RENDERER_VITE_FIREBASE_CONFIG_APP_ID,
  measurementId: import.meta.env.RENDERER_VITE_FIREBASE_CONFIG_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const db = getFirestore(firebaseApp);

export { firebaseApp, db, analytics };
