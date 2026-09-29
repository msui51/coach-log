import type { Session } from "@/types";

type DemoWorkoutTemplate = {
  activities: string[];
  notes: string;
};

type DemoClientPlan = {
  clientId: string;
  idPrefix: string;
  daysAgo: number[];
  workouts: DemoWorkoutTemplate[];
};

const demoClientPlans: DemoClientPlan[] = [
  {
    clientId: "demo-client-maya-thompson",
    idPrefix: "demo-session-maya",
    daysAgo: [2, 8, 15, 22, 29, 36, 43, 50],
    workouts: [
      {
        activities: ["Goblet squats", "Dumbbell bench press", "Farmer carries"],
        notes: "Focused on tempo and confident setup; all sets stayed controlled.",
      },
      {
        activities: ["Romanian deadlifts", "One-arm rows", "Split squats"],
        notes: "Added load to the hinge while keeping a steady range of motion.",
      },
      {
        activities: ["Trap-bar deadlifts", "Incline dumbbell press", "Sled pushes"],
        notes: "Strong technique through the final working sets.",
      },
    ],
  },
  {
    clientId: "demo-client-daniel-kim",
    idPrefix: "demo-session-daniel",
    daysAgo: [5, 13, 21, 29, 37, 45],
    workouts: [
      {
        activities: ["Hip mobility flow", "Step-ups", "Calf raises"],
        notes: "Kept the session low impact and emphasized ankle range of motion.",
      },
      {
        activities: ["Single-leg deadlifts", "Lateral lunges", "Pallof press"],
        notes: "Balance improved after slowing down the single-leg work.",
      },
      {
        activities: ["Dynamic warm-up", "Rear-foot elevated split squats", "Side planks"],
        notes: "No discomfort; discussed an easy return-to-run session.",
      },
    ],
  },
  {
    clientId: "demo-client-priya-patel",
    idPrefix: "demo-session-priya",
    daysAgo: [18, 27, 36, 45, 54, 63],
    workouts: [
      {
        activities: ["Box squats", "Cable rows", "Dead bugs"],
        notes: "Established comfortable loads and a repeatable routine.",
      },
      {
        activities: ["Kettlebell deadlifts", "Half-kneeling press", "Bird dogs"],
        notes: "Core control stayed steady through the final round.",
      },
      {
        activities: ["Leg press", "Lat pulldowns", "Suitcase carries"],
        notes: "Completed the full session after a busy week.",
      },
    ],
  },
  {
    clientId: "demo-client-marcus-reed",
    idPrefix: "demo-session-marcus",
    daysAgo: [47, 56, 65, 74, 83, 92],
    workouts: [
      {
        activities: ["Barbell bench press", "Inverted rows", "Assisted pull-ups"],
        notes: "Built pulling volume and kept each bench rep controlled.",
      },
      {
        activities: ["Dumbbell shoulder press", "Lat pulldowns", "Push-ups"],
        notes: "Completed consistent sets across the upper-body circuit.",
      },
      {
        activities: ["Close-grip bench press", "Cable rows", "Negative pull-ups"],
        notes: "Focused on a slow lowering phase during pull-up practice.",
      },
    ],
  },
  {
    clientId: "demo-client-elena-morales",
    idPrefix: "demo-session-elena",
    daysAgo: [7, 15, 23, 31, 39, 47],
    workouts: [
      {
        activities: ["Supported reverse lunges", "Cable pull-throughs", "Tandem balance"],
        notes: "Practiced smooth weight shifts and a stable foot position.",
      },
      {
        activities: ["Step-downs", "Kettlebell squats", "Single-leg balance"],
        notes: "Needed less support during balance work than in earlier sessions.",
      },
      {
        activities: ["Walking lunges", "Hip thrusts", "Loaded carries"],
        notes: "Good pacing and control through uneven-position drills.",
      },
    ],
  },
];

function getExerciseProfile(name: string): { weight: number; reps: number } {
  const activity = name.toLowerCase();

  if (/mobility|warm-up|dead bugs|bird dogs|plank|balance|pallof|push-ups|pull-ups/.test(activity)) {
    return { weight: 0, reps: 10 };
  }
  if (/deadlift|hip thrust|pull-through/.test(activity)) {
    return { weight: 60, reps: 8 };
  }
  if (/bench|press/.test(activity)) {
    return { weight: 30, reps: 10 };
  }
  if (/row|pulldown/.test(activity)) {
    return { weight: 35, reps: 10 };
  }
  if (/squat|lunge|step-up|step-down|leg press/.test(activity)) {
    return { weight: 40, reps: 10 };
  }
  if (/carry|carries|sled/.test(activity)) {
    return { weight: 20, reps: 12 };
  }

  return { weight: 20, reps: 10 };
}

function createDemoExercise(name: string, sessionIndex: number) {
  const profile = getExerciseProfile(name);
  const weight = Math.max(0, profile.weight - Math.floor(sessionIndex / 3) * 2.5);

  return {
    name,
    sets: [
      { weight, reps: profile.reps },
      { weight: weight === 0 ? 0 : weight + 2.5, reps: Math.max(6, profile.reps - 2) },
    ],
  };
}

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
  return demoClientPlans.flatMap((plan) =>
    plan.daysAgo.map((daysAgo, sessionIndex) => {
      const workout = plan.workouts[sessionIndex % plan.workouts.length];

      return {
        id: `${plan.idPrefix}-${String(sessionIndex + 1).padStart(2, "0")}`,
        clientId: plan.clientId,
        date: dateFromDaysAgo(referenceDate, daysAgo),
        exercises: workout.activities.map((activity) =>
          createDemoExercise(activity, sessionIndex),
        ),
        notes: workout.notes,
      };
    }),
  );
}
