
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    addSession,
    getClientsSnapshot,
    getServerClientsSnapshot,
    subscribeToClients,
} from "@/client-storage";

function getToday(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function Sessions() {
    const router = useRouter();
    const saveDialogRef = useRef<HTMLDialogElement>(null);
    const clients = useSyncExternalStore(
        subscribeToClients,
        getClientsSnapshot,
        getServerClientsSnapshot,
    );
    const [today] = useState(getToday);
    const [date, setDate] = useState(today);
    const [clientId, setClientId] = useState("");
    const [exercises, setExercises] = useState([
        { name: "", sets: [{ weight: "", reps: "" }] },
    ]);
    const [notes, setNotes] = useState("");
    const [errors, setErrors] = useState({
        client: "",
        date: "",
        exercises: [{ name: "", sets: [{ weight: "", reps: "" }] }],
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [savedClient, setSavedClient] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        const dialog = saveDialogRef.current;
        if (!savedClient || !dialog) {
            return;
        }

        dialog.showModal();
        const timeoutId = window.setTimeout(() => {
            dialog.close();
            router.push(`/clients/${encodeURIComponent(savedClient.id)}`);
        }, 1200);

        return () => {
            window.clearTimeout(timeoutId);
            if (dialog.open) {
                dialog.close();
            }
        };
    }, [router, savedClient]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const nextErrors = {
            client: clients?.some((client) => client.id === clientId)
                ? ""
                : "Select a client.",
            date: !date
                ? "Date is required."
                : date > today
                  ? "Date cannot be in the future."
                  : "",
            exercises: exercises.map((exercise) => ({
                name: exercise.name.trim() ? "" : "Exercise name is required.",
                sets: exercise.sets.map((set) => ({
                    weight: !set.weight.trim()
                        ? "Weight is required."
                        : Number.isFinite(Number(set.weight)) && Number(set.weight) >= 0
                          ? ""
                          : "Weight must be 0 or more.",
                    reps: !set.reps.trim()
                        ? "Reps are required."
                        : Number.isInteger(Number(set.reps)) && Number(set.reps) > 0
                          ? ""
                          : "Reps must be a whole number greater than 0.",
                })),
            })),
        };

        setErrors(nextErrors);
        setSuccessMessage("");

        if (
            nextErrors.client ||
            nextErrors.date ||
            nextErrors.exercises.some(
                (exercise) =>
                    exercise.name ||
                    exercise.sets.some((set) => set.weight || set.reps),
            )
        ) {
            return;
        }

        const selectedClient = clients?.find((client) => client.id === clientId);
        if (!selectedClient) {
            return;
        }

        addSession({
            id: `session-${crypto.randomUUID()}`,
            clientId,
            date,
            exercises: exercises.map((exercise) => ({
                name: exercise.name.trim(),
                sets: exercise.sets.map((set) => ({
                    weight: Number(set.weight),
                    reps: Number(set.reps),
                })),
            })),
            notes: notes.trim(),
        });
        setExercises([{ name: "", sets: [{ weight: "", reps: "" }] }]);
        setNotes("");
        setErrors({
            client: "",
            date: "",
            exercises: [{ name: "", sets: [{ weight: "", reps: "" }] }],
        });
        setSavedClient({ id: clientId, name: selectedClient.name });
    }

    if (clients === null) {
        return (
            <section className="mt-7 w-full max-w-2xl min-[400px]:mt-[34px]" role="status">
                <p className="text-sm font-semibold text-muted">Loading clients…</p>
            </section>
        );
    }

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
                noValidate
                onSubmit={handleSubmit}
            >
                <label
                    className="grid gap-2 text-sm font-semibold text-foreground"
                    htmlFor="session-client"
                >
                    Client
                    <select
                        id="session-client"
                        name="clientId"
                        required
                        value={clientId}
                        aria-invalid={errors.client ? "true" : undefined}
                        aria-describedby={errors.client ? "session-client-error" : undefined}
                        onChange={(event) => {
                            setClientId(event.target.value);
                            setErrors((currentErrors) => ({ ...currentErrors, client: "" }));
                            setSuccessMessage("");
                        }}
                        className="h-12 rounded-xl border border-border bg-background px-4 text-base text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    >
                        <option value="">Select a client</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                    {errors.client ? (
                        <span id="session-client-error" className="text-sm font-medium text-rose-300">
                            {errors.client}
                        </span>
                    ) : null}
                    {clients.length === 0 ? (
                        <span className="text-sm font-medium text-muted">
                            Add a client before logging a session. <Link href="/clients" className="text-accent-cyan underline">Go to clients</Link>
                        </span>
                    ) : null}
                </label>

                <label
                    className="grid gap-2 text-sm font-semibold text-foreground"
                    htmlFor="session-date"
                >
                    Date
                    <input
                        id="session-date"
                        name="date"
                        type="date"
                        required
                        value={date}
                        max={today}
                        aria-invalid={errors.date ? "true" : undefined}
                        aria-describedby={errors.date ? "session-date-error" : undefined}
                        onChange={(event) => {
                            const nextDate = event.target.value;
                            setDate(nextDate);
                            setErrors((currentErrors) => ({
                                ...currentErrors,
                                date: !nextDate
                                    ? "Date is required."
                                    : nextDate > today
                                      ? "Date cannot be in the future."
                                      : "",
                            }));
                            setSuccessMessage("");
                        }}
                        className="h-12 rounded-xl border border-border bg-background px-4 text-base text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                    {errors.date ? (
                        <span id="session-date-error" className="text-sm font-medium text-rose-300">
                            {errors.date}
                        </span>
                    ) : null}
                </label>

                <div className="grid gap-6">
                    {exercises.map((exercise, exerciseIndex) => (
                        <fieldset key={exerciseIndex} className="grid gap-4 border-0 border-b border-border p-0 pb-6">
                            <legend className="mb-3 text-sm font-bold text-foreground">
                                Exercise {exerciseIndex + 1}
                            </legend>
                            <label
                                className="grid gap-2 text-sm font-semibold text-foreground"
                                htmlFor={`exercise-${exerciseIndex + 1}-name`}
                            >
                                Exercise name
                                <input
                                    id={`exercise-${exerciseIndex + 1}-name`}
                                    name={`exercises[${exerciseIndex}][name]`}
                                    type="text"
                                    required
                                    value={exercise.name}
                                    aria-invalid={errors.exercises[exerciseIndex]?.name ? "true" : undefined}
                                    aria-describedby={errors.exercises[exerciseIndex]?.name ? `exercise-${exerciseIndex + 1}-error` : undefined}
                                    onChange={(event) => {
                                        const name = event.target.value;
                                        setExercises((currentExercises) => currentExercises.map((currentExercise, index) =>
                                            index === exerciseIndex ? { ...currentExercise, name } : currentExercise,
                                        ));
                                        setErrors((currentErrors) => ({
                                            ...currentErrors,
                                            exercises: currentErrors.exercises.map((exerciseError, index) =>
                                                index === exerciseIndex
                                                    ? { ...exerciseError, name: name.trim() ? "" : exerciseError.name ? "Exercise name is required." : "" }
                                                    : exerciseError,
                                            ),
                                        }));
                                        setSuccessMessage("");
                                    }}
                                    placeholder="e.g. Barbell squat"
                                    className="h-12 rounded-xl border border-border bg-background px-4 text-base text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                                />
                                {errors.exercises[exerciseIndex]?.name ? (
                                    <span id={`exercise-${exerciseIndex + 1}-error`} className="text-sm font-medium text-rose-300">
                                        {errors.exercises[exerciseIndex].name}
                                    </span>
                                ) : null}
                            </label>

                            <fieldset className="grid gap-4 border-0 p-0">
                                <legend className="text-sm font-semibold text-foreground">Sets</legend>
                                {exercise.sets.map((set, setIndex) => (
                                    <div key={setIndex} className="grid gap-3 border-b border-border/70 py-3 last:border-0">
                                        <h2 className="m-0 text-sm font-bold text-foreground">Set {setIndex + 1}</h2>
                                        <div className="grid grid-cols-2 gap-3">
                                            <label
                                                className="grid gap-2 text-sm font-semibold text-foreground"
                                                htmlFor={`exercise-${exerciseIndex + 1}-set-${setIndex + 1}-weight`}
                                            >
                                                Weight used
                                                <input
                                                    id={`exercise-${exerciseIndex + 1}-set-${setIndex + 1}-weight`}
                                                    name={`exercises[${exerciseIndex}][sets][${setIndex}][weight]`}
                                                    type="number"
                                                    min="0"
                                                    step="any"
                                                    required
                                                    value={set.weight}
                                                    aria-invalid={errors.exercises[exerciseIndex]?.sets[setIndex]?.weight ? "true" : undefined}
                                                    aria-describedby={errors.exercises[exerciseIndex]?.sets[setIndex]?.weight ? `exercise-${exerciseIndex + 1}-set-${setIndex + 1}-weight-error` : undefined}
                                                    onChange={(event) => {
                                                        const weight = event.target.value;
                                                        setExercises((currentExercises) => currentExercises.map((currentExercise, index) => index === exerciseIndex
                                                            ? { ...currentExercise, sets: currentExercise.sets.map((currentSet, rowIndex) => rowIndex === setIndex ? { ...currentSet, weight } : currentSet) }
                                                            : currentExercise,
                                                        ));
                                                        setErrors((currentErrors) => ({
                                                            ...currentErrors,
                                                            exercises: currentErrors.exercises.map((exerciseError, index) => index === exerciseIndex
                                                                ? { ...exerciseError, sets: exerciseError.sets.map((setError, rowIndex) => rowIndex === setIndex
                                                                    ? { ...setError, weight: !weight.trim() ? setError.weight ? "Weight is required." : "" : Number.isFinite(Number(weight)) && Number(weight) >= 0 ? "" : "Weight must be 0 or more." }
                                                                    : setError) }
                                                                : exerciseError,
                                                            ),
                                                        }));
                                                        setSuccessMessage("");
                                                    }}
                                                    placeholder="Weight"
                                                    className="h-12 min-w-0 rounded-xl border border-border bg-background px-3 text-base text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                                                />
                                                {errors.exercises[exerciseIndex]?.sets[setIndex]?.weight ? (
                                                    <span id={`exercise-${exerciseIndex + 1}-set-${setIndex + 1}-weight-error`} className="text-sm font-medium text-rose-300">
                                                        {errors.exercises[exerciseIndex].sets[setIndex].weight}
                                                    </span>
                                                ) : null}
                                            </label>
                                            <label
                                                className="grid gap-2 text-sm font-semibold text-foreground"
                                                htmlFor={`exercise-${exerciseIndex + 1}-set-${setIndex + 1}-reps`}
                                            >
                                                Reps
                                                <input
                                                    id={`exercise-${exerciseIndex + 1}-set-${setIndex + 1}-reps`}
                                                    name={`exercises[${exerciseIndex}][sets][${setIndex}][reps]`}
                                                    type="number"
                                                    min="1"
                                                    step="1"
                                                    required
                                                    value={set.reps}
                                                    aria-invalid={errors.exercises[exerciseIndex]?.sets[setIndex]?.reps ? "true" : undefined}
                                                    aria-describedby={errors.exercises[exerciseIndex]?.sets[setIndex]?.reps ? `exercise-${exerciseIndex + 1}-set-${setIndex + 1}-reps-error` : undefined}
                                                    onChange={(event) => {
                                                        const reps = event.target.value;
                                                        setExercises((currentExercises) => currentExercises.map((currentExercise, index) => index === exerciseIndex
                                                            ? { ...currentExercise, sets: currentExercise.sets.map((currentSet, rowIndex) => rowIndex === setIndex ? { ...currentSet, reps } : currentSet) }
                                                            : currentExercise,
                                                        ));
                                                        setErrors((currentErrors) => ({
                                                            ...currentErrors,
                                                            exercises: currentErrors.exercises.map((exerciseError, index) => index === exerciseIndex
                                                                ? { ...exerciseError, sets: exerciseError.sets.map((setError, rowIndex) => rowIndex === setIndex
                                                                    ? { ...setError, reps: !reps.trim() ? setError.reps ? "Reps are required." : "" : Number.isInteger(Number(reps)) && Number(reps) > 0 ? "" : "Reps must be a whole number greater than 0." }
                                                                    : setError) }
                                                                : exerciseError,
                                                            ),
                                                        }));
                                                        setSuccessMessage("");
                                                    }}
                                                    placeholder="Reps"
                                                    className="h-12 min-w-0 rounded-xl border border-border bg-background px-3 text-base text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                                                />
                                                {errors.exercises[exerciseIndex]?.sets[setIndex]?.reps ? (
                                                    <span id={`exercise-${exerciseIndex + 1}-set-${setIndex + 1}-reps-error`} className="text-sm font-medium text-rose-300">
                                                        {errors.exercises[exerciseIndex].sets[setIndex].reps}
                                                    </span>
                                                ) : null}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="secondary"
                                    aria-label={`Add set to exercise ${exerciseIndex + 1}`}
                                    onClick={() => {
                                        setExercises((currentExercises) => currentExercises.map((currentExercise, index) => index === exerciseIndex
                                            ? { ...currentExercise, sets: [...currentExercise.sets, { weight: "", reps: "" }] }
                                            : currentExercise,
                                        ));
                                        setErrors((currentErrors) => ({
                                            ...currentErrors,
                                            exercises: currentErrors.exercises.map((exerciseError, index) => index === exerciseIndex
                                                ? { ...exerciseError, sets: [...exerciseError.sets, { weight: "", reps: "" }] }
                                                : exerciseError,
                                            ),
                                        }));
                                        setSuccessMessage("");
                                    }}
                                >
                                    Add set
                                </Button>
                            </fieldset>
                        </fieldset>
                    ))}
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            setExercises((currentExercises) => [...currentExercises, { name: "", sets: [{ weight: "", reps: "" }] }]);
                            setErrors((currentErrors) => ({
                                ...currentErrors,
                                exercises: [...currentErrors.exercises, { name: "", sets: [{ weight: "", reps: "" }] }],
                            }));
                            setSuccessMessage("");
                        }}
                    >
                        Add exercise
                    </Button>
                </div>

                <label
                    className="grid gap-2 text-sm font-semibold text-foreground"
                    htmlFor="session-notes"
                >
                    Notes
                    <textarea
                        id="session-notes"
                        name="notes"
                        rows={4}
                        value={notes}
                        onChange={(event) => {
                            setNotes(event.target.value);
                            setSuccessMessage("");
                        }}
                        placeholder="Add observations or follow-up details"
                        className="min-h-28 resize-y rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                </label>

                <Button type="submit" fullWidth>
                    Save session
                </Button>
                {successMessage ? (
                    <p className="m-0 text-sm font-medium text-accent" role="status">
                        {successMessage}
                    </p>
                ) : null}
            </form>
            <dialog
                ref={saveDialogRef}
                aria-labelledby="session-saved-heading"
                aria-describedby="session-saved-description"
                className="m-auto w-[min(100%-2rem,28rem)] rounded-lg border border-border bg-surface p-6 text-foreground shadow-2xl backdrop:bg-black/65"
            >
                <h2 id="session-saved-heading" className="m-0 text-lg font-bold">
                    Session saved
                </h2>
                <p id="session-saved-description" className="mb-0 mt-2 text-sm text-muted">
                    Returning to {savedClient?.name}&apos;s profile.
                </p>
            </dialog>
        </section>
    );
}