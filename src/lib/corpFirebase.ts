import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
  type Firestore,
} from 'firebase/firestore';

// Read-only access to the STAFF portal's database (project beaming-diode-mt86m, named db).
// Public rules allow reading only: fleet (публикуемые машины), public_stats и public_presence.
export const corpFirebaseConfig = {
  projectId: 'beaming-diode-mt86m',
  appId: '1:155394340941:web:8cef373425531d94d94404',
  apiKey: 'AIzaSyBuV07oaN7QC4Bcpot0rw0SmSE-9ODjCxw',
  authDomain: 'beaming-diode-mt86m.firebaseapp.com',
  firestoreDatabaseId: 'ai-studio-apathyrp-6543ed3f-c237-4750-b01f-22ee13c30d2a',
  storageBucket: 'beaming-diode-mt86m.firebasestorage.app',
  messagingSenderId: '155394340941',
};

const corpApp: FirebaseApp =
  getApps().find((a) => a.name === 'corp') || initializeApp(corpFirebaseConfig, 'corp');
export const corpDb: Firestore = getFirestore(corpApp, corpFirebaseConfig.firestoreDatabaseId);

export interface PublicFleetItem {
  id: string;
  modelName: string;
  plate: string;
  status: string;
  rankRequired: string;
  slot: string;
  trunkKg: number;
  fuelPercent: number;
  image: string;
  desc: string;
}

/** Публичный автопарк: только машины с publicVisible !== false. */
export async function fetchPublicFleet(): Promise<PublicFleetItem[]> {
  const snap = await getDocs(collection(corpDb, 'fleet'));
  return snap.docs
    .filter((d) => d.data().publicVisible !== false)
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        modelName: String(data.modelName || ''),
        plate: String(data.plate || ''),
        status: String(data.status || ''),
        rankRequired: String(data.rankRequired || ''),
        slot: String(data.slot || ''),
        trunkKg: Number(data.trunkKg) || 0,
        fuelPercent: Math.max(0, Math.min(100, Number(data.fuelPercent) || 0)),
        image: String(data.publicImage || ''),
        desc: String(data.publicDesc || ''),
      };
    })
    .filter((v) => v.modelName.length > 0);
}

export interface CorpPublicStats {
  treasuryBalance: number;
  totalMinedItems: number;
  staffTotal: number;
}

/** Зеркало корпоративных цифр — портал пишет его в public_stats/main. */
export function subscribePublicStats(cb: (stats: CorpPublicStats) => void): () => void {
  return onSnapshot(
    doc(corpDb, 'public_stats', 'main'),
    (snap) => {
      const d = snap.data();
      cb({
        treasuryBalance: Number(d?.treasuryBalance) || 0,
        totalMinedItems: Number(d?.totalMinedItems) || 0,
        staffTotal: Number(d?.staffTotal) || 0,
      });
    },
    () => {}
  );
}

/**
 * Онлайн-счётчик: портал раз в 30 секунд пишет бикон {at: ISO} в public_presence/{profileId}.
 * Считаем живыми те биконы, которым меньше двух минут (TTL портала).
 */
export function subscribeOnlineCount(cb: (count: number) => void): () => void {
  const cutoffIso = new Date(Date.now() - 120_000).toISOString();
  return onSnapshot(
    query(collection(corpDb, 'public_presence'), where('at', '>=', cutoffIso)),
    (snap) => cb(snap.size),
    () => cb(0)
  );
}
