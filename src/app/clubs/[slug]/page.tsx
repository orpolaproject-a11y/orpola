import Link from "next/link";
import { notFound } from "next/navigation";
import { getClubBySlug } from "@/lib/clubs";

const sportLabel: Record<string, string> = {
  running: "Running",
  cycling: "Cycling",
  both: "Running & cycling",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) return { title: "Club not found" };
  return { title: club.name, description: club.description ?? undefined };
}

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) notFound();

  const mapsUrl =
    club.latitude && club.longitude
      ? `https://www.google.com/maps?q=${club.latitude},${club.longitude}`
      : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/clubs" className="text-sm text-emerald-700 hover:underline dark:text-emerald-400">
        ← All clubs
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <h1 className="text-3xl font-bold">{club.name}</h1>
        {club.verified && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">Verified</span>
        )}
      </div>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        {club.city} · {sportLabel[club.sport_type]}
      </p>
      {club.description && <p className="mt-6 leading-relaxed text-zinc-700 dark:text-zinc-300">{club.description}</p>}
      <dl className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {club.schedule && (
          <div>
            <dt className="text-xs font-medium uppercase text-zinc-500">Schedule</dt>
            <dd className="mt-1">{club.schedule}</dd>
          </div>
        )}
        {club.price_range && (
          <div>
            <dt className="text-xs font-medium uppercase text-zinc-500">Price</dt>
            <dd className="mt-1 font-medium text-emerald-700 dark:text-emerald-400">{club.price_range}</dd>
          </div>
        )}
        {club.address && (
          <div>
            <dt className="text-xs font-medium uppercase text-zinc-500">Meeting point</dt>
            <dd className="mt-1">{club.address}</dd>
          </div>
        )}
        {mapsUrl && (
          <div>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400">
              Open in Google Maps
            </a>
          </div>
        )}
      </dl>
    </div>
  );
}
