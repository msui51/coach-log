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
  exercises: Exercise[];
  notes: string;
}

export interface Exercise {
  name: string;
  sets: SessionSet[];
}

export interface SessionSet {
  weight: number;
  reps: number;
}
