import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Orpola — Running & cycling clubs in Israel",
    template: "%s | Orpola",
  },
  description:
    "Discover running and cycling clubs near you in Israel. Compare schedules, prices, and reviews.",
  metadataBase: new URL("https://www.orpola.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
          © {new Date().getFullYear()} Orpola · orpola.com
        </footer>
      </body>
    </html>
  );
}
