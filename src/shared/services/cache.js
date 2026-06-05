import { openDB } from "idb";

const DB_NAME = "weatheriq-db";
const DB_VERSION = 1;
const STORE = "weather-cache";
const TTL = 5 * 60 * 1000; // 5 minutes

let _db = null;

async function getDb() {
  if (!_db) {
    _db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: "key" });
        }
      },
    });
  }
  return _db;
}

export async function cacheSet(key, data, ttl = TTL) {
  try {
    const db = await getDb();
    await db.put(STORE, { key, data, expiresAt: Date.now() + ttl });
  } catch (e) {
    // Fallback to localStorage
    try {
      localStorage.setItem(
        key,
        JSON.stringify({ data, expiresAt: Date.now() + ttl }),
      );
    } catch {}
  }
}

export async function cacheGet(key) {
  try {
    const db = await getDb();
    const record = await db.get(STORE, key);
    if (!record) return null;
    if (Date.now() > record.expiresAt) {
      await db.delete(STORE, key);
      return null;
    }
    return record.data;
  } catch {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() > parsed.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch {
      return null;
    }
  }
}

export async function cacheClear() {
  try {
    const db = await getDb();
    await db.clear(STORE);
  } catch {}
}
