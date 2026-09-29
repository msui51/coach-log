import type { Client, Session } from "@/types";

export function getClientSessions(
  clientId: Client["id"],
  sessions: readonly Session[],
): Session[] {
  return sessions
    .filter((session) => session.clientId === clientId)
    .sort((first, second) => second.date.localeCompare(first.date));
}

export function getMostRecentSessionDate(
  clientId: Client["id"],
  sessions: readonly Session[],
): string | null {
  return getClientSessions(clientId, sessions)[0]?.date ?? null;
}
