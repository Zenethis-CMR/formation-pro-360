"use client";
import Link from "next/link";
import { LayoutDashboard, BookOpen, ClipboardCheck, BarChart3, Sparkles, ArrowRight, Settings2, CalendarDays, Bell, LogOut, GraduationCap } from "lucide-react";
import { usePathname } from "next/navigation";
import { DemoProvider, useDemo } from "@/context/demo-store";
import { missionState } from "@/lib/mission-engine";

const icons = {
  grid: LayoutDashboard, book: BookOpen, check: ClipboardCheck,
  chart: BarChart3, spark: Sparkles, arrow: ArrowRight,
  settings: Settings2, calendar: CalendarDays, bell: Bell, logout: LogOut
};
type IconName = keyof typeof icons;
function UIIcon({name, size = 20}:{name:IconName;size?:number}) {
  const Icon = icons[name];
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true"/>;
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
    <Link href="/" className="academy-brand"><span className="brand-flower"><GraduationCap size={23} strokeWidth={2.1}/></span><span>Formation <span>Pro 360</span></span></Link>
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
      <div className="profile-avatar" aria-hidden="true"><div className="avatar-hair"/><div className="avatar-face"/><div className="avatar-body"/><span><Sparkles size={14}/></span></div>
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
      <div className="academy-mobile-brand"><Link href="/" className="academy-brand"><span className="brand-flower"><GraduationCap size={23} strokeWidth={2.1}/></span><span>Formation <span>Pro 360</span></span></Link></div>
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
