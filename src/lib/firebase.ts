import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const firebaseConfig = {
  projectId: 'beaming-diode-mt86m',
  appId: '1:155394340941:web:8cef373425531d94d94404',
  apiKey: 'AIzaSyBuV07oaN7QC4Bcpot0rw0SmSE-9ODjCxw',
  authDomain: 'beaming-diode-mt86m.firebaseapp.com',
  firestoreDatabaseId: 'ai-studio-apathyrp-6543ed3f-c237-4750-b01f-22ee13c30d2a',
  storageBucket: 'beaming-diode-mt86m.firebasestorage.app',
  messagingSenderId: '155394340941',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export async function submitApplicationToFirestore(data: {
  nick: string;
  cid: string;
  phone: string;
  discord: string;
  docs: string;
}) {
  try {
    const colRef = collection(db, 'applications');
    const docRef = await addDoc(colRef, {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
      source: 'public_ac2_site',
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    console.warn('Firestore write notice (falling back to REST API server):', err);
    return { success: false, error: err };
  }
}
