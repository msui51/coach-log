import type { Session } from "@/types";

type SessionEntryProps = {
  session: Session;
};

const sessionDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function SessionEntry({ session }: SessionEntryProps) {
  return (
    <li className="py-4 first:pt-2">
      <time
        className="text-sm font-semibold text-accent-cyan"
        dateTime={session.date}
      >
        {sessionDateFormatter.format(new Date(`${session.date}T00:00:00Z`))}
      </time>
      <div className="mt-2 grid gap-3">
        {session.exercises.map((exercise, exerciseIndex) => (
          <div key={`${exercise.name}-${exerciseIndex}`}>
            <h3 className="m-0 text-base font-semibold text-foreground">
              {exercise.name}
            </h3>
            {exercise.sets.length > 0 ? (
              <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-1 p-0 text-sm text-muted">
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
        <p className="mb-0 mt-2 text-sm leading-6 text-muted">
          {session.notes}
        </p>
      ) : null}
    </li>
  );
}
