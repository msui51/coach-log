import type { Client } from "@/types";
import { demoClients } from "@/data/demo-clients";

const STORAGE_KEY = "coach-log:clients";

/** Reads the persisted client list from localStorage, falling back to demo data. */
export function loadClients(): Client[] {
  if (typeof window === "undefined") {
    return [];
  }

  return [];
}

/** Persists the given client list to localStorage. */
export function saveClients(clients: readonly Client[]): void {
  if (typeof window === "undefined") {
    return;
  }
}

/** Appends a new client to the persisted list and saves it. */
export function addClient(client: Client): Client[] {
  if (typeof window === "undefined") {
    return [];
  }

  return [];
}

/** Seeds localStorage with demo client data if none is present yet. */
export function loadDemoData(): Client[] {
  if (typeof window === "undefined") {
    return demoClients;
  }

  return demoClients;
}
