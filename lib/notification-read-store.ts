/**
 * Shared "which notifications are read" store.
 *
 * Why this exists: every page mounts its own <NotificationBell />, so keeping
 * the read ids in component state means they reset on every navigation.
 * This module keeps them in one place (module scope) and persists them to
 * localStorage, so all bells stay in sync and the state survives a refresh.
 *
 * Intended location: src/lib/notification-read-store.ts
 */

const STORAGE_KEY = "notifications:readIds";

const EMPTY: ReadonlySet<number> = new Set<number>();

let readIds: ReadonlySet<number> = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function readFromStorage(): ReadonlySet<number> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return new Set(parsed.filter((v): v is number => typeof v === "number"));
  } catch {
    return EMPTY;
  }
}

function writeToStorage(ids: ReadonlySet<number>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // Storage can be unavailable (private mode / quota). Memory state still works.
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  readIds = readFromStorage();
}

function emit() {
  listeners.forEach((listener) => listener());
}

/* ---- API for useSyncExternalStore ---- */

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  // Keep multiple tabs in sync as well.
  function onStorage(event: StorageEvent) {
    if (event.key !== STORAGE_KEY) return;
    readIds = readFromStorage();
    emit();
  }
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): ReadonlySet<number> {
  ensureLoaded();
  return readIds;
}

// Server (and the first hydration render) has no localStorage.
export function getServerSnapshot(): ReadonlySet<number> {
  return EMPTY;
}

/* ---- Actions ---- */

export function markNotificationsRead(ids: number[]) {
  ensureLoaded();
  const next = new Set(readIds);
  let changed = false;
  for (const id of ids) {
    if (!next.has(id)) {
      next.add(id);
      changed = true;
    }
  }
  if (!changed) return;
  readIds = next;
  writeToStorage(next);
  emit();
}