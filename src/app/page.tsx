import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 px-8 py-16 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-100">Israel</p>
        <h1 className="mt-2 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
          Find your running & cycling community
        </h1>
        <p className="mt-4 max-w-xl text-lg text-emerald-50">
          Discover clubs near you. Compare schedules, prices, and reviews — all in one place.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/clubs"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-800 shadow hover:bg-emerald-50"
          >
            Browse clubs
          </Link>
        </div>
      </section>
      <section className="mt-16 grid gap-8 md:grid-cols-3">
        {[
          { title: "Map & search", text: "Filter by city, sport, and price." },
          { title: "Reviews", text: "Real feedback from runners and cyclists." },
          { title: "Coaches", text: "Find trainers for groups and personal coaching." },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
