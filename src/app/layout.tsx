import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";
import "./premium.css";

export const metadata: Metadata = {
  title: "Formation Pro 360 — Apprendre en construisant",
  description: "Parcours de formation pratique, missions et évaluations gamifiées"
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><AppShell>{children}</AppShell></body></html>;
}
