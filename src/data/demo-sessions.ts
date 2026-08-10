import type { Session } from "@/types";

type DemoSessionTemplate = Omit<Session, "date"> & {
  daysAgo: number;
};

const demoSessionTemplates: DemoSessionTemplate[] = [
  {
    id: "demo-session-maya-01",
    clientId: "demo-client-maya-thompson",
    daysAgo: 16,
    activities: ["Goblet squats", "Dumbbell bench press", "Farmer carries"],
    notes: "Focused on a steady tempo and confident setup with each exercise.",
  },
  {
    id: "demo-session-maya-02",
    clientId: "demo-client-maya-thompson",
    daysAgo: 9,
    activities: ["Romanian deadlifts", "One-arm rows", "Split squats"],
    notes: "Added a small amount of weight while maintaining good control.",
  },
  {
    id: "demo-session-maya-03",
    clientId: "demo-client-maya-thompson",
    daysAgo: 2,
    activities: ["Trap-bar deadlifts", "Incline dumbbell press", "Sled pushes"],
    notes: "Moved well and finished all working sets with strong technique.",
  },
  {
    id: "demo-session-daniel-01",
    clientId: "demo-client-daniel-kim",
    daysAgo: 26,
    activities: ["Hip mobility flow", "Step-ups", "Calf raises"],
    notes: "Kept the session low impact and emphasized ankle range of motion.",
  },
  {
    id: "demo-session-daniel-02",
    clientId: "demo-client-daniel-kim",
    daysAgo: 19,
    activities: ["Single-leg deadlifts", "Lateral lunges", "Pallof press"],
    notes: "Balance improved after slowing down the single-leg work.",
  },
  {
    id: "demo-session-daniel-03",
    clientId: "demo-client-daniel-kim",
    daysAgo: 12,
    activities: ["Dynamic warm-up", "Rear-foot elevated split squats", "Side planks"],
    notes: "No discomfort during training; discussed an easy return-to-run session.",
  },
  {
    id: "demo-session-priya-01",
    clientId: "demo-client-priya-patel",
    daysAgo: 58,
    activities: ["Box squats", "Cable rows", "Dead bugs"],
    notes: "Established comfortable starting loads and a repeatable routine.",
  },
  {
    id: "demo-session-priya-02",
    clientId: "demo-client-priya-patel",
    daysAgo: 44,
    activities: ["Kettlebell deadlifts", "Half-kneeling press", "Bird dogs"],
    notes: "Core control was noticeably better during the final round.",
  },
  {
    id: "demo-session-priya-03",
    clientId: "demo-client-priya-patel",
    daysAgo: 30,
    activities: ["Leg press", "Lat pulldowns", "Suitcase carries"],
    notes: "Completed the full session after a busy week; follow-up is overdue.",
  },
  {
    id: "demo-session-elena-01",
    clientId: "demo-client-elena-morales",
    daysAgo: 23,
    activities: ["Supported reverse lunges", "Cable pull-throughs", "Tandem balance"],
    notes: "Worked on smooth weight shifts and a stable foot position.",
  },
  {
    id: "demo-session-elena-02",
    clientId: "demo-client-elena-morales",
    daysAgo: 14,
    activities: ["Step-downs", "Kettlebell squats", "Single-leg balance"],
    notes: "Needed less support during balance work than in the previous session.",
  },
  {
    id: "demo-session-elena-03",
    clientId: "demo-client-elena-morales",
    daysAgo: 5,
    activities: ["Walking lunges", "Hip thrusts", "Loaded carries"],
    notes: "Good pacing throughout and strong control on uneven-position drills.",
  },
];

function dateFromDaysAgo(referenceDate: Date, daysAgo: number): string {
  const date = new Date(referenceDate);
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function createDemoSessions(referenceDate = new Date()): Session[] {
  return demoSessionTemplates.map(({ daysAgo, ...session }) => ({
    ...session,
    date: dateFromDaysAgo(referenceDate, daysAgo),
  }));
}
