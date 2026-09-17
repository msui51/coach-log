import Link from "next/link";
import type { Client } from "@/types";

type ClientCardProps = Pick<Client, "id" | "name" | "goal"> & {
  mostRecentSessionDate: string | null;
};

const sessionDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function ClientCard({
  id,
  name,
  goal,
  mostRecentSessionDate,
}: ClientCardProps) {
  const sessionDate = mostRecentSessionDate
    ? sessionDateFormatter.format(new Date(`${mostRecentSessionDate}T00:00:00Z`))
    : null;

  return (
    <Link
      href={`/clients/${id}`}
      className="relative block overflow-hidden rounded-[14px] border border-border bg-linear-to-br from-surface-light to-surface px-[18px] pt-[17px] pb-[18px] shadow-[0_10px_28px_rgb(0_0_0/16%)] transition hover:border-accent/40 before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-accent before:content-[''] min-[400px]:rounded-2xl min-[400px]:px-[22px] min-[400px]:pt-5 min-[400px]:pb-[21px]"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="m-0 text-lg leading-[1.3] font-bold tracking-[-0.02em] text-foreground min-[400px]:text-xl">
          {name}
        </h2>
        <span className="shrink-0 rounded-full border border-border/70 bg-surface/80 px-2.5 py-1 text-[10px] leading-none font-bold uppercase tracking-[0.18em] text-muted min-[400px]:text-[11px]">
          Status
        </span>
      </div>
      <p className="mt-[7px] mb-0 text-sm leading-[1.5] text-muted min-[400px]:mt-2 min-[400px]:max-w-[42ch] min-[400px]:text-[15px]">
        {goal}
      </p>
      <p className="mt-3 mb-0 text-xs leading-[1.4] font-semibold text-foreground/75 min-[400px]:text-[13px]">
        {sessionDate ? `Last session: ${sessionDate}` : "No sessions yet"}
      </p>
    </Link>
  );
}
