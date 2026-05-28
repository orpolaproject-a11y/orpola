import Link from "next/link";
import type { Club } from "@/types/database";

const sportLabel: Record<string, string> = {
  running: "Running",
  cycling: "Cycling",
  both: "Running & cycling",
};

export function ClubCard({ club }: { club: Club }) {
  return (
    <Link
      href={`/clubs/${club.slug}`}
      className="block rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{club.name}</h2>
        {club.verified && (
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
            Verified
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {club.city} · {sportLabel[club.sport_type] ?? club.sport_type}
      </p>
      {club.description && (
        <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">{club.description}</p>
      )}
      {club.price_range && (
        <p className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">{club.price_range}</p>
      )}
    </Link>
  );
}
