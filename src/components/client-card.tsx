import type { Client } from "@/types";

type ClientCardProps = Pick<Client, "name" | "goal">;

export function ClientCard({ name, goal }: ClientCardProps) {
  return (
    <article className="relative overflow-hidden rounded-[14px] border border-border bg-linear-to-br from-surface-light to-surface px-[18px] pt-[17px] pb-[18px] shadow-[0_10px_28px_rgb(0_0_0/16%)] before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-accent before:content-[''] min-[400px]:rounded-2xl min-[400px]:px-[22px] min-[400px]:pt-5 min-[400px]:pb-[21px]">
      <h2 className="m-0 text-lg leading-[1.3] font-bold tracking-[-0.02em] text-foreground min-[400px]:text-xl">
        {name}
      </h2>
      <p className="mt-[7px] mb-0 text-sm leading-[1.5] text-muted min-[400px]:mt-2 min-[400px]:max-w-[42ch] min-[400px]:text-[15px]">
        {goal}
      </p>
    </article>
  );
}
