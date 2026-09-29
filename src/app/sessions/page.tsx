
export default function Sessions() {
    return (
        <section
            className="mt-7 w-full max-w-2xl min-[400px]:mt-[34px]"
            aria-labelledby="session-log-heading"
        >
            <div>
                <p className="mb-[5px] text-[11px] leading-[1.4] font-extrabold tracking-[0.13em] text-accent">
                    TRAINING HISTORY
                </p>
                <h1
                    id="session-log-heading"
                    className="m-0 text-[30px] leading-[1.15] font-bold text-foreground min-[400px]:text-[34px]"
                >
                    Session Log
                </h1>
            </div>

            <form
                className="mt-6 grid gap-5"
                aria-labelledby="session-log-heading"
            >
                <label
                    className="grid gap-2 text-sm font-semibold text-foreground"
                    htmlFor="session-date"
                >
                    Date
                    <input
                        id="session-date"
                        name="date"
                        type="date"
                        className="h-12 rounded-xl border border-border bg-background px-4 text-base text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                </label>

                <label
                    className="grid gap-2 text-sm font-semibold text-foreground"
                    htmlFor="session-activities"
                >
                    Activities
                    <textarea
                        id="session-activities"
                        name="activities"
                        rows={5}
                        placeholder="List exercises, sets, and repetitions"
                        className="min-h-32 resize-y rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                </label>

                <label
                    className="grid gap-2 text-sm font-semibold text-foreground"
                    htmlFor="session-notes"
                >
                    Notes
                    <textarea
                        id="session-notes"
                        name="notes"
                        rows={4}
                        placeholder="Add observations or follow-up details"
                        className="min-h-28 resize-y rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                </label>
            </form>
        </section>
    );
}