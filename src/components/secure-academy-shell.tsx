"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowRight, BarChart3, BookOpen, CalendarDays, ClipboardCheck, GraduationCap, LayoutDashboard, LogOut, Settings2, Sparkles, Users } from "lucide-react";
import { signOut } from "@/app/auth/actions";

export type SecureWorkspaceStats={
  role:"learner"|"trainer";
  displayName:string|null;
  missionCount:number;
  approvedCount:number;
  xp:number;
  pending:number;
  learners:number;
  nextTitle:string|null;
  nextHref:string|null;
};
function CircleStat({label,value,percent,color}:{label:string;value:string;percent:number;color:string}) {
  return <div className="profile-mini-stat"><div className="mini-circle">
    <svg viewBox="0 0 42 42" width="54" height="54" aria-hidden="true">
      <circle cx="21" cy="21" r="16" fill="none" stroke="#eef1f6" strokeWidth="3.5"/>
      <circle cx="21" cy="21" r="16" fill="none" stroke={color} strokeWidth="3.5" pathLength={100}
        strokeDasharray={Math.max(0,Math.min(100,percent))+" 100"}
        strokeLinecap="round" transform="rotate(-90 21 21)"/>
    </svg><b>{value}</b></div><span>{label}</span></div>;
}
export function SecureAcademyShell({children,stats}:{children:React.ReactNode;stats:SecureWorkspaceStats}) {
  const pathname=usePathname();
  const currentTab=useSearchParams().get("onglet")||"dashboard";
  const trainer=stats.role==="trainer";
  const base=trainer?"/espace/formateur":"/espace/apprenant";
  const detail=pathname.startsWith("/espace/atelier/")||pathname.includes("/atelier/")||
    pathname.startsWith("/espace/compte")||pathname.startsWith("/espace/bienvenue");
  const links=trainer?[
    {href:base,label:"Tableau de bord",icon:LayoutDashboard},
    {href:base+"?onglet=evaluations",label:"Évaluations",icon:ClipboardCheck},
    {href:base+"?onglet=apprenants",label:"Mes apprenants",icon:Users},
    {href:base+"?onglet=programme",label:"Programme",icon:CalendarDays}
  ]:[
    {href:base,label:"Tableau de bord",icon:LayoutDashboard},
    {href:base+"?onglet=missions",label:"Mes missions",icon:BookOpen},
    {href:base+"?onglet=progression",label:"Ma progression",icon:BarChart3},
    {href:base+"?onglet=programme",label:"Programme",icon:CalendarDays},
    {href:"/catalogue",label:"Catalogue V2",icon:Sparkles}
  ];
  const learningPercent=stats.missionCount?Math.round(stats.approvedCount/stats.missionCount*100):0;
  const profileName=stats.displayName|| (trainer?"Espace formateur":"Mon parcours");
  const isActive=(href:string)=>{
    const [path,query]=href.split("?");
    if(path!==pathname)return false;
    const tab=new URLSearchParams(query||"").get("onglet")||"dashboard";
    return tab===currentTab;
  };
  return <div className="academy-viewport secure-academy-viewport"><div className={"academy-frame secure-academy-frame"+(detail?" secure-academy-detail":"")}>
    <aside className="academy-sidebar">
      <Link href={base} className="academy-brand"><span className="brand-flower"><GraduationCap size={23} strokeWidth={2.1}/></span><span>Formation <span>Pro 360</span></span></Link>
      <div className="sidebar-category">ESPACE {trainer?"FORMATEUR":"DE FORMATION"}</div>
      <nav aria-label="Navigation de l'espace personnel" className="sidebar-navigation">
        {links.map(({href,label,icon:Icon})=><Link key={href} href={href} className={"sidebar-link"+(isActive(href)?" is-active":"")} aria-current={isActive(href)?"page":undefined}>
          <Icon size={18} strokeWidth={1.8}/><span>{label}</span>{label==="Évaluations"&&stats.pending>0&&<b>{stats.pending}</b>}
        </Link>)}
      </nav>
      <div className="sidebar-divider"/>
      <div className="sidebar-category">MON ESPACE</div>
      <nav className="sidebar-navigation" aria-label="Réglages et raccourcis">
        {!trainer&&<Link href="/espace/bienvenue" className={"sidebar-link"+(pathname==="/espace/bienvenue"?" is-active":"")}><Sparkles size={18}/><span>Mes objectifs</span></Link>}
        <Link href="/espace/compte" className={"sidebar-link"+(pathname==="/espace/compte"?" is-active":"")}><Settings2 size={18}/><span>Mon compte</span></Link>
      </nav>
      <div className="sidebar-spacer"/>
      <div className="sidebar-ad"><div className="sidebar-ad-icon"><Sparkles size={21}/></div>
        <b>{trainer?"Chaque correction compte.":"Chaque projet compte."}</b>
        <p>{trainer?"Un retour précis aide chaque apprenant à progresser.":"Apprends en réalisant de vrais projets."}</p>
        <Link href={trainer?base+"?onglet=evaluations":base+"?onglet=missions"}>{trainer?"Voir les évaluations":"Découvrir les missions"} <ArrowRight size={16}/></Link>
      </div>
      <form action={signOut} className="secure-sidebar-signout"><button type="submit"><LogOut size={16}/> Se déconnecter</button></form>
      <div className="sidebar-footer">© Formation Pro 360<br/><small>Espace personnel sécurisé</small></div>
    </aside>
    <section className="academy-content secure-academy-content" aria-label="Contenu personnel">
      <div className="academy-mobile-brand"><Link href={base} className="academy-brand">
        <span className="brand-flower"><GraduationCap size={23}/></span><span>Formation <span>Pro 360</span></span></Link>
        <Link className="secure-mobile-account" href="/espace/compte" aria-label="Mon compte"><Settings2 size={19}/></Link>
      </div>
      {children}
    </section>
    {!detail&&<aside className="academy-rail secure-academy-rail" aria-label="Profil et progression réelle">
      <div className="rail-heading"><span>Mon profil</span><Link href="/espace/compte" className="rail-heading-icon" aria-label="Gérer mon profil"><Settings2 size={18}/></Link></div>
      <div className="profile-card">
        <div className="profile-avatar profile-avatar-pro" aria-hidden="true"><GraduationCap size={37} strokeWidth={1.8}/></div>
        <h3>{profileName}</h3><p>{trainer?"Formateur":"Apprenant"} · Compte sécurisé</p>
        <div className="profile-mini-grid">
          {trainer?<><CircleStat label="Apprenants" value={String(stats.learners)} percent={Math.min(100,stats.learners*10)} color="#48c995"/>
            <CircleStat label="À corriger" value={String(stats.pending)} percent={Math.min(100,stats.pending*25)} color="#4387f5"/>
            <CircleStat label="Missions" value={String(stats.missionCount)} percent={Math.min(100,stats.missionCount/16*100)} color="#ffa56e"/></>
          :<><CircleStat label="Validées" value={String(stats.approvedCount)} percent={learningPercent} color="#48c995"/>
            <CircleStat label="XP" value={String(stats.xp)} percent={(stats.xp%300)/300*100} color="#4387f5"/>
            <CircleStat label="En attente" value={String(stats.pending)} percent={Math.min(100,stats.pending*25)} color="#ffa56e"/></>}
        </div>
      </div>
      <div className="rail-widget">
        <div className="rail-widget-heading"><h3>{trainer?"À traiter":"À poursuivre"}</h3><span>{stats.pending>0?String(stats.pending).padStart(2,"0"):"01"}</span></div>
        <div className="rail-next-icon">{trainer?<ClipboardCheck size={20}/>:<BookOpen size={20}/>}</div>
        <strong>{stats.nextTitle|| (trainer?"Corrections à venir":"Parcours à jour")}</strong>
        <p>{trainer?stats.pending?"Des livrables attendent une correction.":"Les nouvelles soumissions apparaîtront ici.":stats.nextTitle?"Une étape concrète pour avancer dans ton parcours.":"Consulte tes missions et les retours de ton formateur."}</p>
        <Link className="rail-cta" href={stats.nextHref||base}>{trainer?"Voir les corrections":"Voir la mission"} <ArrowRight size={16}/></Link>
      </div>
      <div className="rail-widget rail-coach"><span className="rail-coach-label"><Sparkles size={15}/> CONSEIL DU COACH</span>
        <p>{trainer?"Un retour utile est précis, bienveillant et directement applicable.":"Une compétence s'acquiert quand tu sais expliquer et refaire ton travail."}</p>
        <span>Pratique · Autonomie · Qualité</span>
      </div>
      <Link className="secure-rail-account" href="/espace/compte"><Settings2 size={15}/> Gérer mon compte <ArrowRight size={14}/></Link>
    </aside>}
  </div>
  <nav className="academy-mobile-bottom secure-academy-mobile-nav" aria-label="Navigation mobile de l'espace personnel">
    <Link href={base} className={pathname===base&&currentTab==="dashboard"?"on":""}><LayoutDashboard size={19}/>Accueil</Link>
    {trainer?<>
      <Link href={base+"?onglet=evaluations"} className={pathname===base&&currentTab==="evaluations"?"on":""}><ClipboardCheck size={19}/>Corrections</Link>
      <Link href={base+"?onglet=apprenants"} className={pathname===base&&currentTab==="apprenants"?"on":""}><Users size={19}/>Apprenants</Link>
    </>:<>
      <Link href={base+"?onglet=missions"} className={pathname===base&&currentTab==="missions"?"on":""}><BookOpen size={19}/>Missions</Link>
      <Link href={base+"?onglet=progression"} className={pathname===base&&currentTab==="progression"?"on":""}><BarChart3 size={19}/>Progrès</Link>
    </>}
    <Link href={base+"?onglet=programme"} className={pathname===base&&currentTab==="programme"?"on":""}><CalendarDays size={19}/>Programme</Link>
    <Link href="/espace/compte" className={pathname==="/espace/compte"?"on":""}><Settings2 size={19}/>Compte</Link>
  </nav>
  </div>;
}
