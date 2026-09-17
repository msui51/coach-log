import type { Client } from "@/types";

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const avatarGradients = [
  "from-accent-cyan to-[#1c6fd6]",
  "from-[#ff7ab8] to-[#c2367f]",
  "from-[#ffb84d] to-[#e0632c]",
  "from-accent to-[#4f9d1f]",
  "from-[#b18cff] to-[#5b3fc9]",
  "from-[#5eead4] to-[#0f766e]",
  "from-[#fca5a5] to-[#b91c1c]",
  "from-[#fde047] to-[#a16207]",
];

function hashClientId(id: string): number {
  return [...id].reduce(
    (total, char) => (total * 31 + char.charCodeAt(0)) >>> 0,
    0,
  );
}

/** Assigns each client a gradient, resolving hash collisions so clients stay visually distinct. */
export function getAvatarGradients(
  clients: readonly Client[],
): Map<string, string> {
  const sortedClients = [...clients].sort((a, b) => a.id.localeCompare(b.id));
  const usedIndexes = new Set<number>();
  const gradients = new Map<string, string>();

  for (const candidate of sortedClients) {
    let index = hashClientId(candidate.id) % avatarGradients.length;
    while (usedIndexes.has(index) && usedIndexes.size < avatarGradients.length) {
      index = (index + 1) % avatarGradients.length;
    }
    usedIndexes.add(index);
    gradients.set(candidate.id, avatarGradients[index]);
  }

  return gradients;
}
