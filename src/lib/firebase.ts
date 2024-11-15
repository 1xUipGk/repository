import { FirebaseApp, initializeApp } from 'firebase/app';
import { Database, getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app: FirebaseApp | undefined;
let database: Database | null = null;

export function getFirebaseDB(): Database | null {
  if (typeof window === 'undefined') return null;
  
  if (!database) {
    try {
      app = initializeApp(firebaseConfig);
      database = getDatabase(app);
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  }
  
  return database;
} 