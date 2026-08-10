import type { Client, Session } from "@/types";

export function getMostRecentSessionDate(
  clientId: Client["id"],
  sessions: readonly Session[],
): string | null {
  let mostRecentDate: string | null = null;

  for (const session of sessions) {
    if (
      session.clientId === clientId &&
      (mostRecentDate === null || session.date > mostRecentDate)
    ) {
      mostRecentDate = session.date;
    }
  }

  return mostRecentDate;
}
