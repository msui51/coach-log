"use client";

import { useEffect, useState } from "react";
import { loadClients } from "@/client-storage";
import type { Client } from "@/types";

type ClientProfileProps = {
  id: string;
};

export function ClientProfile({ id }: ClientProfileProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [isStorageReady, setIsStorageReady] = useState(false);

  useEffect(() => {
    const clients = loadClients();
    setClient(clients.find((candidate) => candidate.id === id) ?? null);
    setIsStorageReady(true);
  }, [id]);

  if (!isStorageReady) {
    return (
      <main role="status" aria-live="polite">
        <p>Loading client…</p>
      </main>
    );
  }

  if (!client) {
    return (
      <main>
        <h1>Client not found</h1>
        <p>No client matches this ID.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>{client.name}</h1>
      <p>{client.goal}</p>
    </main>
  );
}
