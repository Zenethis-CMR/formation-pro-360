"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DemoProvider } from "@/context/demo-store";

function Navigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const secure = pathname.startsWith("/espace") || pathname.startsWith("/login") || pathname.startsWith("/auth");
  const links = [
    { href: "/", label: "Accueil" },
    { href: "/apprenant", label: "Démo apprenant" },
    { href: "/formateur", label: "Démo formateur" },
    { href: "/espace", label: "Espace sécurisé" }
  ];
  return <div className="app-frame">
    <header className="topbar">
      <Link className="brand" href="/" aria-label="Formation Pro 360 - accueil">
        <span className="brand-mark">F<span>◆</span></span>
        <span>FORMATION <b>360</b></span>
      </Link>
      <nav className="nav" aria-label="Navigation principale">
        {links.map((item) => <Link href={item.href} key={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          className={pathname === item.href || pathname.startsWith(item.href+"/") && item.href !== "/" ? "nav-link active" : "nav-link"}>{item.label}</Link>)}
      </nav>
      <span className="mode">{secure ? "ACCÈS SÉCURISÉ" : "MODE DÉMO"}</span>
    </header>
    {!secure && <div className="demo-notice"><strong>Prototype pédagogique.</strong> Les deux espaces de démo sont publics et les données restent dans ce navigateur. Pour les comptes et données réels, utilise l’espace sécurisé après configuration de Supabase.</div>}
    {children}
    <footer className="site-footer"><span>FORMATION 360 · Apprendre en construisant</span><span>{secure ? "Accès à droits vérifiés côté serveur" : "Prototype pédagogique"}</span></footer>
  </div>;
}
export function AppShell({ children }: { children: React.ReactNode }) {
  return <DemoProvider><Navigation>{children}</Navigation></DemoProvider>;
}
