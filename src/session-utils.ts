import type { AttendanceStatus, Client, Session } from "@/types";

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

export function getAttendanceStatus(
  mostRecentSessionDate: string | null,
  referenceDate = new Date(),
): AttendanceStatus {
  if (!mostRecentSessionDate) {
    return "inactive";
  }

  const sessionTime = new Date(`${mostRecentSessionDate}T00:00:00Z`).getTime();
  const todayTime = Date.UTC(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const daysSinceSession = Math.floor((todayTime - sessionTime) / 86_400_000);

  if (daysSinceSession <= 14) {
    return "consistent";
  }
  if (daysSinceSession <= 35) {
    return "needs-attention";
  }
  return "inactive";
}
