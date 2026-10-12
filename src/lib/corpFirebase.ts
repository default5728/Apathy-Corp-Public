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
  image: string;
  desc: string;
}

interface RawFleetDoc {
  modelName?: unknown;
  plate?: unknown;
  status?: unknown;
  rankRequired?: unknown;
  slot?: unknown;
  trunkKg?: unknown;
  publicVisible?: unknown;
  publicImage?: unknown;
  publicDesc?: unknown;
}

function mapFleetDoc(id: string, data: RawFleetDoc): PublicFleetItem | null {
  const modelName = String(data.modelName || '');
  if (!modelName || data.publicVisible === false) return null;
  return {
    id,
    modelName,
    plate: String(data.plate || ''),
    status: String(data.status || ''),
    rankRequired: String(data.rankRequired || ''),
    slot: String(data.slot || ''),
    trunkKg: Number(data.trunkKg) || 0,
    image: String(data.publicImage || ''),
    desc: String(data.publicDesc || ''),
  };
}

// Правила корпоративной базы пропускают list только при условии trunkKg >= 0 —
// запрос обязан повторять его, иначе Firestore отклоняет выборку целиком.
const publicFleetQuery = () =>
  query(collection(corpDb, 'fleet'), where('trunkKg', '>=', 0));

/** Разовое чтение публичного автопарка (машины с publicVisible !== false). */
export async function fetchPublicFleet(): Promise<PublicFleetItem[]> {
  const snap = await getDocs(publicFleetQuery());
  return snap.docs
    .map((d) => mapFleetDoc(d.id, d.data() as RawFleetDoc))
    .filter((v): v is PublicFleetItem => v !== null);
}

/**
 * Живая подписка на автопарк: новые машины из корпоративного портала
 * появляются на сайте сами, без перезагрузки страницы.
 */
export function subscribePublicFleet(cb: (items: PublicFleetItem[]) => void): () => void {
  return onSnapshot(
    publicFleetQuery(),
    (snap) => {
      cb(
        snap.docs
          .map((d) => mapFleetDoc(d.id, d.data() as RawFleetDoc))
          .filter((v): v is PublicFleetItem => v !== null)
      );
    },
    () => cb([])
  );
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
 * Считаем живыми биконы младше пяти минут (TTL портала, запас под троттлинг фоновых вкладок).
 * Запрос тянет все биконы (правилами поле не ограничено), свежесть пересчитываем на клиенте
 * по таймеру — счётчик и растёт, и затухает, пока вкладка открыта.
 */
const PRESENCE_TTL_MS = 300_000;

export function subscribeOnlineCount(cb: (count: number) => void): () => void {
  let latest: string[] = [];
  const compute = () => {
    const cutoff = Date.now() - PRESENCE_TTL_MS;
    cb(latest.filter((at) => Date.parse(at) >= cutoff).length);
  };
  const unsub = onSnapshot(
    query(collection(corpDb, 'public_presence'), where('at', '>', new Date(0).toISOString())),
    (snap) => {
      latest = snap.docs.map((d) => String((d.data() as { at?: unknown }).at || ''));
      compute();
    },
    () => {
      latest = [];
      compute();
    }
  );
  const timer = setInterval(compute, 30_000);
  return () => {
    unsub();
    clearInterval(timer);
  };
}
