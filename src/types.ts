export type AttendanceStatus = "consistent" | "needs-attention" | "inactive";

export interface Client {
  id: string;
  name: string;
  goal: string;
  createdAt: string;
}

export interface Session {
  id: string;
  clientId: string;
  date: string;
  activities: string[];
  notes: string;
}
