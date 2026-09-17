"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadClients } from "@/client-storage";
import type { Client } from "@/types";

type ClientProfileProps = {
  id: string;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const avatarGradients = [
  "from-accent-cyan to-[#1c6fd6]",
  "from-[#ff7ab8] to-[#c2367f]",
  "from-[#ffb84d] to-[#e0632c]",
  "from-accent to-[#4f9d1f]",
  "from-[#b18cff] to-[#5b3fc9]",
  "from-[#5eead4] to-[#0f766e]",
  "from-[#fca5a5] to-[#b91c1c]",
  "from-[#fde047] to-[#a16207]",
];

function hashClientId(id: string): number {
  return [...id].reduce(
    (total, char) => (total * 31 + char.charCodeAt(0)) >>> 0,
    0,
  );
}

/** Assigns each client a gradient, resolving hash collisions so clients stay visually distinct. */
function getAvatarGradients(clients: readonly Client[]): Map<string, string> {
  const sortedClients = [...clients].sort((a, b) => a.id.localeCompare(b.id));
  const usedIndexes = new Set<number>();
  const gradients = new Map<string, string>();

  for (const candidate of sortedClients) {
    let index = hashClientId(candidate.id) % avatarGradients.length;
    while (usedIndexes.has(index) && usedIndexes.size < avatarGradients.length) {
      index = (index + 1) % avatarGradients.length;
    }
    usedIndexes.add(index);
    gradients.set(candidate.id, avatarGradients[index]);
  }

  return gradients;
}

export function ClientProfile({ id }: ClientProfileProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [avatarGradient, setAvatarGradient] = useState(avatarGradients[0]);
  const [isStorageReady, setIsStorageReady] = useState(false);

  useEffect(() => {
    const clients = loadClients();
    const matchedClient = clients.find((candidate) => candidate.id === id) ?? null;

    setClient(matchedClient);
    if (matchedClient) {
      setAvatarGradient(getAvatarGradients(clients).get(matchedClient.id) ?? avatarGradients[0]);
    }
    setIsStorageReady(true);
  }, [id]);

  if (!isStorageReady) {
    return (
      <section
        className="mt-7 w-full min-[400px]:mt-[34px]"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-semibold text-muted">Loading client…</p>
      </section>
    );
  }

  if (!client) {
    return (
      <section className="mt-7 w-full min-[400px]:mt-[34px]">
        <Link
          href="/clients"
          className="inline-flex items-center gap-2 text-sm font-bold text-accent-cyan transition hover:opacity-80"
        >
          <span aria-hidden="true">←</span> All clients
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-[-0.025em] text-foreground">
          Client not found
        </h1>
        <p className="mt-2 text-sm text-muted">No client matches this ID.</p>
      </section>
    );
  }

  return (
    <section className="mt-7 w-full min-[400px]:mt-[34px]">
      <Link
        href="/clients"
        className="inline-flex items-center gap-2 text-sm font-bold text-accent-cyan transition hover:opacity-80"
      >
        <span aria-hidden="true">←</span> All clients
      </Link>

      <div className="mt-8 flex items-start gap-5">
        <div
          className={`flex size-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${avatarGradient} text-xl font-bold text-white min-[400px]:size-20 min-[400px]:text-2xl`}
          aria-hidden="true"
        >
          {getInitials(client.name)}
        </div>

        <div>
          <p className="m-0 text-[11px] leading-[1.4] font-extrabold tracking-[0.13em] text-accent-cyan">
            CLIENT PROFILE
          </p>
          <h1 className="mt-1 text-[30px] leading-[1.15] font-bold tracking-[-0.035em] text-foreground min-[400px]:text-[34px]">
            {client.name}
          </h1>
          <p className="mt-3 mb-0 flex items-center gap-2 text-base leading-[1.5] text-muted">
            <span
              className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-muted/60"
              aria-hidden="true"
            >
              <span className="size-2 rounded-full bg-muted/60" />
            </span>
            {client.goal}
          </p>
        </div>
      </div>
    </section>
  );
}
