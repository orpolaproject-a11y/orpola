"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Club } from "@/types/database";
import { TEL_AVIV_MAP_CENTER } from "@/lib/constants";
import "leaflet/dist/leaflet.css";

const sportLabel: Record<string, string> = {
  running: "Running",
  cycling: "Cycling",
  both: "Running & cycling",
};

function createClubIcon(sport: string) {
  const color = sport === "cycling" ? "#2563eb" : sport === "both" ? "#7c3aed" : "#059669";
  return L.divIcon({
    className: "orpola-marker",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function FitBounds({ clubs }: { clubs: Club[] }) {
  const map = useMap();
  const points = useMemo(
    () =>
      clubs
        .filter((c) => c.latitude != null && c.longitude != null)
        .map((c) => [c.latitude!, c.longitude!] as [number, number]),
    [clubs],
  );

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 13 });
  }, [map, points]);

  return null;
}

type Props = {
  clubs: Club[];
};

export default function ClubsMap({ clubs }: Props) {
  const mappable = clubs.filter((c) => c.latitude != null && c.longitude != null);

  if (mappable.length === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
        No clubs with locations around Tel Aviv yet.
      </div>
    );
  }

  return (
    <MapContainer
      center={[TEL_AVIV_MAP_CENTER.lat, TEL_AVIV_MAP_CENTER.lng]}
      zoom={12}
      scrollWheelZoom
      className="z-0 h-[420px] w-full rounded-2xl border border-zinc-200 dark:border-zinc-800"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds clubs={mappable} />
      {mappable.map((club) => (
        <Marker
          key={club.id}
          position={[club.latitude!, club.longitude!]}
          icon={createClubIcon(club.sport_type)}
        >
          <Popup>
            <div className="min-w-[160px]">
              <p className="font-semibold text-zinc-900">{club.name}</p>
              <p className="mt-1 text-xs text-zinc-600">{sportLabel[club.sport_type] ?? club.sport_type}</p>
              {club.address && <p className="mt-1 text-xs text-zinc-500">Start: {club.address}</p>}
              {club.schedule && <p className="mt-1 text-xs text-zinc-500">{club.schedule}</p>}
              <Link
                href={`/clubs/${club.slug}`}
                className="mt-2 inline-block text-xs font-medium text-emerald-700 hover:underline"
              >
                View club →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
