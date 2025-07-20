import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCtGZWcbv7Gq7HTyxgj2CZ8n4tviRNRDbg',
  authDomain: 'greenman-c73b1.firebaseapp.com',
  projectId: 'greenman-c73b1',
  storageBucket: 'greenman-c73b1.firebasestorage.app',
  messagingSenderId: '393050667662',
  appId: '1:393050667662:web:f29add574384c604cb27df',
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { localCache: persistentLocalCache() });

const auth = getAuth(app);

export { db, auth };
