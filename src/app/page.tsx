
import { ClientList } from "@/components/client-list";

export default function Home() {
  return (
    <section
      className="mt-7 w-full min-[400px]:mt-[34px]"
      aria-labelledby="clients-heading"
    >
      <div>
        <p className="mb-[5px] text-[11px] leading-[1.4] font-extrabold tracking-[0.13em] text-accent">
          YOUR ROSTER
        </p>
        <h1
          id="clients-heading"
          className="m-0 text-[30px] leading-[1.15] font-bold tracking-[-0.035em] text-foreground min-[400px]:text-[34px]"
        >
          Clients
        </h1>
      </div>

      <ClientList />
    </section>
  );
}
