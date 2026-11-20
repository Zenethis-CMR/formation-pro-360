"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DemoProvider } from "@/context/demo-store";

function Navigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Accueil" },
    { href: "/apprenant", label: "Espace apprenant" },
    { href: "/formateur", label: "Espace formateur" }
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
          className={pathname === item.href ? "nav-link active" : "nav-link"}>{item.label}</Link>)}
      </nav>
      <span className="mode">MODE DÉMO</span>
    </header>
    <div className="demo-notice"><strong>Prototype pédagogique.</strong> Les deux espaces sont publics dans cette démonstration. Les données sont conservées uniquement dans ce navigateur ; ne saisis aucune information personnelle.</div>
    {children}
    <footer className="site-footer"><span>FORMATION 360 · Apprendre en construisant</span><span>Prototype V1 · Sans comptes réels</span></footer>
  </div>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return <DemoProvider><Navigation>{children}</Navigation></DemoProvider>;
}
