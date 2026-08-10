"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClientCard } from "@/components/client-card";
import { getMostRecentSessionDate } from "@/session-utils";
import type { Client, Session } from "@/types";

type ClientListProps = {
  demoClients: readonly Client[];
  demoSessions: readonly Session[];
};

export function ClientList({ demoClients, demoSessions }: ClientListProps) {
  const [clients, setClients] = useState<Client[]>([]);

  if (clients.length === 0) {
    return (
      <div className="mx-auto mt-12 flex max-w-md flex-col items-center rounded-2xl border border-border bg-surface px-6 py-10 text-center shadow-[0_10px_28px_rgb(0_0_0/12%)] min-[400px]:mt-16 min-[400px]:px-9 min-[400px]:py-12">
        <div
          className="flex size-12 items-center justify-center rounded-full bg-accent/15 text-2xl font-semibold text-accent"
          aria-hidden="true"
        >
          +
        </div>
        <h2 className="mt-5 text-xl font-bold tracking-[-0.025em] text-foreground min-[400px]:text-2xl">
          Your client list is empty
        </h2>
        <p className="mt-2 max-w-[34ch] text-sm leading-6 text-muted min-[400px]:text-[15px]">
          Add a client to start logging sessions, or explore CoachLog with
          fictional demo data.
        </p>
        <div className="mt-7 flex w-full flex-col gap-3 min-[400px]:w-auto min-[400px]:min-w-64">
          <Button fullWidth>Add your first client</Button>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => setClients([...demoClients])}
          >
            Load fictional demo data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-3 min-[400px]:mt-6 min-[400px]:gap-[14px]">
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          name={client.name}
          goal={client.goal}
          mostRecentSessionDate={getMostRecentSessionDate(
            client.id,
            demoSessions,
          )}
        />
      ))}
    </div>
  );
}
