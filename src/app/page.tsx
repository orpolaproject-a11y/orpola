import Link from "next/link";
import { ClubsMapLoader } from "@/components/ClubsMapLoader";
import { getClubsAroundTelAviv } from "@/lib/clubs";

export default async function HomePage() {
  const clubs = await getClubsAroundTelAviv();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Tel Aviv area
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
          Find running & cycling clubs near you
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Each pin marks where a club usually meets for group runs and rides. Tap a pin for details.
        </p>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">Club map</h2>
            <p className="text-sm text-zinc-500">
              {clubs.length} club{clubs.length === 1 ? "" : "s"} around Tel Aviv
            </p>
          </div>
          <Link
            href="/clubs"
            className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
          >
            View all clubs →
          </Link>
        </div>
        <ClubsMapLoader clubs={clubs} />
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { title: "Meeting points", text: "See where each group starts before you join." },
          { title: "Schedules & prices", text: "Compare when clubs meet and what they charge." },
          { title: "Reviews", text: "Read feedback from runners and cyclists." },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
