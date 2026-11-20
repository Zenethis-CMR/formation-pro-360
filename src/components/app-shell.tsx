"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DemoProvider, useDemo } from "@/context/demo-store";
import { missionState } from "@/lib/mission-engine";

type IconName = "grid" | "book" | "check" | "chart" | "spark" | "arrow" | "settings" | "calendar" | "bell" | "logout";

function UIIcon({name, size=20}:{name:IconName;size?:number}) {
  const shared={width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round" as const,strokeLinejoin:"round" as const, "aria-hidden":true as const};
  switch(name) {
    case "grid": return <svg {...shared}><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>;
    case "book": return <svg {...shared}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 5.5V20a2 2 0 0 0 2 2h14M8 8h8M8 12h6"/></svg>;
    case "check": return <svg {...shared}><rect x="3" y="3" width="18" height="18" rx="5"/><path d="m8 12 3 3 5-6"/></svg>;
    case "chart": return <svg {...shared}><path d="M4 20V10m5 10V4m5 16v-7m5 7V8"/><path d="M2 21h20"/></svg>;
    case "spark": return <svg {...shared}><path d="m12 2 2.1 6.4L20.5 10l-6.4 2.1L12 18.5l-2.1-6.4L3.5 10l6.4-1.6L12 2zM19 18l.7 1.5L21.2 20l-1.5.5L19 22l-.7-1.5-1.5-.5 1.5-.5z"/></svg>;
    case "arrow": return <svg {...shared}><path d="M5 12h14m-6-6 6 6-6 6"/></svg>;
    case "settings": return <svg {...shared}><circle cx="12" cy="12" r="3"/><path d="M19 15.5 21 17l-2 3-2.4-1a8 8 0 0 1-2 .8L14 22h-4l-.6-2.2a8 8 0 0 1-2-.8L5 20l-2-3 2-1.5a8 8 0 0 1 0-3L3 11l2-3 2.4 1a8 8 0 0 1 2-.8L10 6h4l.6 2.2a8 8 0 0 1 2 .8L19 8l2 3-2 1.5a8 8 0 0 1 0 3z" transform="translate(0 -2) scale(1 .94)"/></svg>;
    case "calendar": return <svg {...shared}><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18"/></svg>;
    case "bell": return <svg {...shared}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9zM10 21h4"/></svg>;
    case "logout": return <svg {...shared}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
  }
}

function CircleStat({label,value,percent,color}:{label:string;value:string;percent:number;color:string}) {
  return <div className="profile-mini-stat"><div className="mini-circle"><svg viewBox="0 0 42 42" width="54" height="54" aria-hidden="true"><circle cx="21" cy="21" r="16" fill="none" stroke="#eef1f6" strokeWidth="3.5"/><circle cx="21" cy="21" r="16" fill="none" stroke={color} strokeWidth="3.5" pathLength={100} strokeDasharray={Math.min(100,Math.max(0,percent))+" 100"} strokeLinecap="round" transform="rotate(-90 21 21)"/></svg><b>{value}</b></div><span>{label}</span></div>;
}

function DashboardSidebar() {
  const pathname=usePathname();
  const {submissions}=useDemo();
  const pending=submissions.filter(item=>item.status==="pending").length;
  const links:[string,string,IconName][]=[
    ["/","Tableau de bord","grid"],
    ["/apprenant","Mes missions","book"],
    ["/formateur","Évaluations","check"]
  ];
  return <aside className="academy-sidebar">
    <Link href="/" className="academy-brand"><span className="brand-flower">✳</span><span>Forma<span>360</span></span></Link>
    <div className="sidebar-category">ESPACE DE FORMATION</div>
    <nav aria-label="Navigation principale" className="sidebar-navigation">
      {links.map(([href,label,icon])=><Link href={href} key={href} className={"sidebar-link"+(pathname===href?" is-active":"")} aria-current={pathname===href?"page":undefined}><UIIcon name={icon} size={19}/><span>{label}</span>{href==="/formateur" && pending>0&&<b>{pending}</b>}</Link>)}
    </nav>
    <div className="sidebar-divider"/>
    <div className="sidebar-category">MON PARCOURS</div>
    <nav aria-label="Raccourcis du parcours" className="sidebar-navigation">
      <Link href="/apprenant#progression" className="sidebar-link"><UIIcon name="chart" size={19}/><span>Ma progression</span></Link>
      <Link href="/apprenant#missions" className="sidebar-link"><UIIcon name="calendar" size={19}/><span>Programme</span></Link>
    </nav>
    <div className="sidebar-spacer"/>
    <div className="sidebar-ad">
      <div className="sidebar-ad-icon"><UIIcon name="spark" size={20}/></div>
      <b>Chaque projet compte.</b>
      <p>Progresse en développant de vraies compétences.</p>
      <Link href="/apprenant">Découvrir les missions <span aria-hidden="true">↗</span></Link>
    </div>
    <div className="sidebar-footer">© Formation Pro 360<br/><small>Prototype pédagogique</small></div>
  </aside>;
}
function DashboardRail() {
  const {missions,submissions,xp,level,approvedCount}=useDemo();
  const percent=missions.length?Math.round(100*approvedCount/missions.length):0;
  const pending=submissions.filter(s=>s.status==="pending").length;
  const next=missions.find(m=>missionState(m,submissions)==="available")||missions.find(m=>missionState(m,submissions)==="changes_requested");
  return <aside className="academy-rail" aria-label="Profil et progression">
    <div className="rail-heading"><span>Mon profil</span><span className="rail-heading-icon"><UIIcon name="bell" size={18}/></span></div>
    <div className="profile-card">
      <div className="profile-avatar" aria-hidden="true"><div className="avatar-hair"/><div className="avatar-face"/><div className="avatar-body"/><span>✦</span></div>
      <h3>Mon parcours</h3>
      <p>Apprenant · Mode démonstration</p>
      <div className="profile-mini-grid">
        <CircleStat label="Validées" value={String(approvedCount)} percent={percent} color="#48c995"/>
        <CircleStat label="XP" value={String(xp)} percent={(xp%300)/300*100} color="#4387f5"/>
        <CircleStat label="En attente" value={String(pending)} percent={Math.min(100,pending*25)} color="#ffa56e"/>
      </div>
    </div>
    <div className="rail-widget">
      <div className="rail-widget-heading"><h3>À poursuivre</h3><span>01</span></div>
      <div className="rail-next-icon"><UIIcon name="book" size={20}/></div>
      <strong>{next?.title || "Toutes les missions terminées"}</strong>
      <p>{next?"La prochaine étape de ton parcours t'attend.":"Un excellent parcours de démonstration !"}</p>
      <Link href="/apprenant" className="rail-cta">Voir la mission <UIIcon name="arrow" size={16}/></Link>
    </div>
    <div className="rail-widget rail-coach">
      <span className="rail-coach-label"><UIIcon name="spark" size={15}/> CONSEIL DU COACH</span>
      <p>Une compétence n'est acquise que lorsque tu peux expliquer et refaire ton travail.</p>
      <span>Pratique · Autonomie · Qualité</span>
    </div>
  </aside>;
}

function AcademyLayout({children}:{children:React.ReactNode}) {
  const pathname=usePathname();
  return <div className="academy-viewport"><div className="academy-frame">
    <DashboardSidebar/>
    <section className="academy-content" aria-label="Contenu principal">
      <div className="academy-mobile-brand"><Link href="/" className="academy-brand"><span className="brand-flower">✳</span><span>Forma<span>360</span></span></Link></div>
      {children}
    </section>
    <DashboardRail/>
  </div>
  <div className="academy-mobile-bottom" aria-label="Navigation mobile"><Link className={pathname==="/"?"on":""} href="/"><UIIcon name="grid" size={20}/>Accueil</Link><Link className={pathname==="/apprenant"?"on":""} href="/apprenant"><UIIcon name="book" size={20}/>Missions</Link><Link className={pathname==="/formateur"?"on":""} href="/formateur"><UIIcon name="check" size={20}/>Évaluations</Link></div>
  </div>;
}

export function AppShell({children}:{children:React.ReactNode}) {
  return <DemoProvider><AcademyLayout>{children}</AcademyLayout></DemoProvider>;
}
