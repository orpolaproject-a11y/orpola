"use client";

import dynamic from "next/dynamic";
import type { Club } from "@/types/database";

const ClubsMap = dynamic(() => import("@/components/ClubsMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] animate-pulse items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
      Loading map…
    </div>
  ),
});

export function ClubsMapLoader({ clubs }: { clubs: Club[] }) {
  return <ClubsMap clubs={clubs} />;
}
