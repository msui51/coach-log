"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadClients, loadSessions } from "@/client-storage";
import { avatarGradients, getAvatarGradients, getInitials } from "@/avatar-utils";
import { getClientSessions } from "@/session-utils";
import type { Client, Session } from "@/types";

const sessionDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

type ClientProfileProps = {
  id: string;
};

export function ClientProfile({ id }: ClientProfileProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [avatarGradient, setAvatarGradient] = useState(avatarGradients[0]);
  const [isStorageReady, setIsStorageReady] = useState(false);

  useEffect(() => {
    const clients = loadClients();
    const matchedClient = clients.find((candidate) => candidate.id === id) ?? null;

    setClient(matchedClient);
    setSessions(getClientSessions(id, loadSessions()));
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
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-[30px] leading-[1.15] font-bold tracking-[-0.035em] text-foreground min-[400px]:text-[34px]">
              {client.name}
            </h1>
            <span className="shrink-0 rounded-full border border-border/70 bg-surface/80 px-2.5 py-1 text-[10px] leading-none font-bold uppercase tracking-[0.18em] text-muted min-[400px]:text-[11px]">
              Status
            </span>
          </div>
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

      <section className="mt-10 border-t border-border pt-7" aria-labelledby="session-history-heading">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="session-history-heading" className="m-0 text-xl font-bold text-foreground">
            Session history
          </h2>
          <span className="text-sm text-muted">
            {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
          </span>
        </div>

        {sessions.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No sessions logged yet.</p>
        ) : (
          <ol className="mt-3 divide-y divide-border">
            {sessions.map((session) => (
              <li key={session.id} className="py-5 first:pt-2">
                <time
                  className="text-sm font-semibold text-accent-cyan"
                  dateTime={session.date}
                >
                  {sessionDateFormatter.format(new Date(`${session.date}T00:00:00Z`))}
                </time>
                <div className="mt-3 grid gap-4">
                  {session.exercises.map((exercise, exerciseIndex) => (
                    <div key={`${exercise.name}-${exerciseIndex}`}>
                      <h3 className="m-0 text-base font-semibold text-foreground">
                        {exercise.name}
                      </h3>
                      {exercise.sets.length > 0 ? (
                        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 p-0 text-sm text-muted">
                          {exercise.sets.map((set, setIndex) => (
                            <li key={setIndex} className="list-none">
                              Set {setIndex + 1}: {set.weight} x {set.reps} reps
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
                {session.notes ? (
                  <p className="mb-0 mt-3 text-sm leading-6 text-muted">
                    {session.notes}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </section>
    </section>
  );
}
