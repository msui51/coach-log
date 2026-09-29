import type { Client, Session } from "@/types";
import { demoClients } from "@/data/demo-clients";
import { createDemoSessions } from "@/data/demo-sessions";

const STORAGE_KEY = "coach-log:clients";
const SESSION_STORAGE_KEY = "coach-log:sessions";
const clientSubscribers = new Set<() => void>();
let cachedClientStorageValue: string | null | undefined;
let cachedClients: Client[] = [];

function notifyClientSubscribers(): void {
  cachedClientStorageValue = undefined;
  clientSubscribers.forEach((subscriber) => subscriber());
}

/** Subscribes to client changes in this tab and other tabs. */
export function subscribeToClients(subscriber: () => void): () => void {
  clientSubscribers.add(subscriber);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      notifyClientSubscribers();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    clientSubscribers.delete(subscriber);
    window.removeEventListener("storage", handleStorage);
  };
}

/** Returns a stable client snapshot for useSyncExternalStore. */
export function getClientsSnapshot(): Client[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedClientStorageValue) {
    cachedClientStorageValue = raw;
    try {
      cachedClients = raw ? (JSON.parse(raw) as Client[]) : demoClients;
    } catch {
      cachedClients = demoClients;
    }
  }

  return cachedClients;
}

/** Returns the server snapshot so client data is read only after hydration. */
export function getServerClientsSnapshot(): null {
  return null;
}

/** Reads the persisted client list from localStorage, falling back to demo data. */
export function loadClients(): Client[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return demoClients;
  }

  try {
    return JSON.parse(raw) as Client[];
  } catch {
    return demoClients;
  }
}

/** Persists the given client list to localStorage. */
export function saveClients(clients: readonly Client[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  notifyClientSubscribers();
}

/** Appends a new client to the persisted list and saves it. */
export function addClient(client: Client): Client[] {
  if (typeof window === "undefined") {
    return [];
  }

  const clients = [client, ...loadClients()];
  saveClients(clients);
  return clients;
}

/** Seeds localStorage with demo client data if none is present yet. */
export function loadDemoData(referenceDate = new Date()): Client[] {
  if (typeof window === "undefined") {
    return demoClients;
  }

  let existingClients: Client[] = [];
  const rawClients = window.localStorage.getItem(STORAGE_KEY);
  if (rawClients) {
    try {
      existingClients = JSON.parse(rawClients) as Client[];
    } catch {
      existingClients = [];
    }
  }

  const demoClientIds = new Set(demoClients.map((client) => client.id));
  const includesDemoClient = existingClients.some((client) =>
    demoClientIds.has(client.id),
  );
  if (existingClients.length > 0 && !includesDemoClient) {
    return existingClients;
  }

  const clients = existingClients.length > 0 ? existingClients : demoClients;
  if (existingClients.length === 0) {
    saveClients(demoClients);
  }

  const demoSessions = createDemoSessions(referenceDate);
  const demoSessionIds = new Set(demoSessions.map((session) => session.id));
  const existingSessions = loadSessions();
  const retainedSessions = existingSessions.filter(
    (session) => !demoSessionIds.has(session.id),
  );
  saveSessions([...demoSessions, ...retainedSessions]);

  return clients;
}

/** Reads the persisted session list from localStorage. */
export function loadSessions(): Session[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Session[];
  } catch {
    return [];
  }
}

/** Persists the given session list to localStorage. */
export function saveSessions(sessions: readonly Session[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
}

/** Appends a new session to the persisted list and saves it. */
export function addSession(session: Session): Session[] {
  if (typeof window === "undefined") {
    return [];
  }

  const sessions = [session, ...loadSessions()];
  saveSessions(sessions);
  return sessions;
}
