import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
          Orpola
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <Link href="/clubs" className="hover:text-emerald-700 dark:hover:text-emerald-400">
            Clubs
          </Link>
        </nav>
      </div>
    </header>
  );
}
