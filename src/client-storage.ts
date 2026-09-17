import type { Client } from "@/types";
import { demoClients } from "@/data/demo-clients";

const STORAGE_KEY = "coach-log:clients";

/** Reads the persisted client list from localStorage, falling back to demo data. */
export function loadClients(): Client[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Client[];
  } catch {
    return [];
  }
}

/** Persists the given client list to localStorage. */
export function saveClients(clients: readonly Client[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
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
export function loadDemoData(): Client[] {
  if (typeof window === "undefined") {
    return demoClients;
  }

  const existingClients = loadClients();
  if (existingClients.length > 0) {
    return existingClients;
  }

  saveClients(demoClients);
  return demoClients;
}
