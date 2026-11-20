import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Formation Pro 360", description: "Plateforme de formation gamifiée" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
