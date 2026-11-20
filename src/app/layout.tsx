import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import "./globals.css";
import "./premium.css";

const jakarta = Plus_Jakarta_Sans({subsets:["latin"],display:"swap",variable:"--font-jakarta"});

export const metadata: Metadata = {
  title: "Formation Pro 360 | Apprendre en construisant",
  description: "Parcours de formation pratique, missions et évaluations gamifiées"
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body className={jakarta.variable}><AppShell>{children}</AppShell></body></html>;
}
