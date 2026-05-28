import { ClubCard } from "@/components/ClubCard";
import { getClubs } from "@/lib/clubs";

export const metadata = {
  title: "Clubs",
  description: "Running and cycling clubs across Israel",
};

export default async function ClubsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  const clubs = await getClubs(city);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Clubs</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        {clubs.length} club{clubs.length === 1 ? "" : "s"}
        {city ? ` in ${city}` : " in Israel"}
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
      {clubs.length === 0 && (
        <p className="mt-8 text-zinc-500">No clubs found. Try another city or check back soon.</p>
      )}
    </div>
  );
}
