import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyArxOzKTFso83A4x2BofADiMoi5OZp7Gk4',
  authDomain: 'bks2025-1c092.firebaseapp.com',
  projectId: 'bks2025-1c092',
  storageBucket: 'bks2025-1c092.firebasestorage.app',
  messagingSenderId: '147921412931',
  appId: '1:147921412931:web:c990adcabf3770786845f6',
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { localCache: persistentLocalCache() });

const auth = getAuth(app);

export { db, auth };
