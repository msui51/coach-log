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
  const [isClientFormVisible, setIsClientFormVisible] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientGoal, setClientGoal] = useState("");

  if (clients.length === 0) {
    if (isClientFormVisible) {
      return (
        <div className="mx-auto mt-12 max-w-md rounded-2xl border border-border bg-surface px-6 py-10 shadow-[0_10px_28px_rgb(0_0_0/12%)] min-[400px]:mt-16 min-[400px]:px-9 min-[400px]:py-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div
                className="flex size-12 items-center justify-center rounded-full bg-accent/15 text-2xl font-semibold text-accent"
                aria-hidden="true"
              >
                +
              </div>
              <h2 className="mt-5 text-xl font-bold tracking-[-0.025em] text-foreground min-[400px]:text-2xl">
                Add your first client
              </h2>
              <p className="mt-2 max-w-[34ch] text-sm leading-6 text-muted min-[400px]:text-[15px]">
                Enter the client details below to start logging sessions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsClientFormVisible(false)}
              className="grid size-9 shrink-0 place-items-center rounded-full border border-border/80 bg-background text-lg font-semibold leading-none text-muted transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              aria-label="Close client form"
            >
              X
            </button>
          </div>

          <form className="mt-7 w-full text-left" aria-label="Add a client">
            <div className="grid gap-4">
              <label
                className="grid gap-2 text-sm font-semibold text-foreground"
                htmlFor="client-name"
              >
                Name
                <input
                  id="client-name"
                  name="name"
                  type="text"
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  placeholder="Enter client name"
                  className="h-12 rounded-xl border border-border bg-background px-4 text-base text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label
                className="grid gap-2 text-sm font-semibold text-foreground"
                htmlFor="client-goal"
              >
                Goal
                <textarea
                  id="client-goal"
                  name="goal"
                  rows={4}
                  value={clientGoal}
                  onChange={(event) => setClientGoal(event.target.value)}
                  placeholder="Enter client goal"
                  className="min-h-28 resize-y rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <Button type="submit" fullWidth>
                Add client
              </Button>
            </div>
          </form>
        </div>
      );
    }

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
          <Button fullWidth onClick={() => setIsClientFormVisible(true)}>
            Add your first client
          </Button>
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
