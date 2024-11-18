import { initializeApp } from '@firebase/app';
import { Database, getDatabase, ref as dbRef, get as dbGet } from '@firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB6tkZjsM5I4OkG8SvCk6v5pyeM6nTzGT4",
  authDomain: "task-manager-87577.firebaseapp.com",
  databaseURL: "https://task-manager-87577-default-rtdb.firebaseio.com",
  projectId: "task-manager-87577",
  storageBucket: "task-manager-87577.firebasestorage.app",
  messagingSenderId: "949071438979",
  appId: "1:949071438979:web:d2a0056c95b9e02e90e7b6",
  measurementId: "G-HMZ54Z29EZ"
};

let database: Database | null = null;

try {
  const app = initializeApp(firebaseConfig);
  database = getDatabase(app);
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { database, dbRef as ref, dbGet as get }; 