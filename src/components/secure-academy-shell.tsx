"use client";
import Link from "next/link";
import {WorkspaceLinkPending} from "@/components/workspace-feedback";
import { createContext, useContext, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowRight, BadgeCheck, BarChart3, BookOpen, BriefcaseBusiness, CalendarDays, ChevronDown, ClipboardCheck, FolderKanban, GraduationCap, LayoutDashboard, LogOut, MessageCircle, Settings2, Sparkles, Users } from "lucide-react";
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
function ProfileStat({label,value}:{label:string;value:string}){
 return <div className="profile-mini-stat workspace-profile-stat"><b>{value}</b><span>{label}</span></div>;
}
const WorkspaceStatsContext=createContext<SecureWorkspaceStats|null>(null);
function LearnerProfileWidgets({stats}:{stats:SecureWorkspaceStats}){
 return <>
  <div className="rail-heading"><span>Mon profil</span><Link href="/espace/compte" className="rail-heading-icon" aria-label="Gérer mon profil"><Settings2 size={18}/></Link></div>
  <div className="profile-card">
   <div className="profile-avatar profile-avatar-pro" aria-hidden="true"><GraduationCap size={37} strokeWidth={1.8}/></div>
   <h3>{stats.displayName||"Mon parcours"}</h3><p>Apprenant · Compte sécurisé</p>
   <div className="workspace-rail-label">Autres réalisations</div>
   <div className="profile-mini-grid">
    <ProfileStat label="Validées" value={String(stats.approvedCount)}/>
    <ProfileStat label="XP autres" value={String(stats.xp)}/>
    <ProfileStat label="En attente" value={String(stats.pending)}/>
   </div>
  </div>
  <div className="rail-widget">
   <div className="rail-widget-heading"><h3>Mon parcours</h3><span>16 ateliers</span></div>
   <div className="rail-next-icon"><Sparkles size={20}/></div>
   <strong>Ingénierie produit et IA</strong>
   <p>Retrouve le programme, tes ateliers et ton inscription.</p>
   <Link className="rail-cta" href="/espace/parcours/ingenierie-produit-ia">Ouvrir mon parcours <ArrowRight size={16}/></Link>
  </div>
  <div className="rail-widget rail-coach"><span className="rail-coach-label"><Sparkles size={15}/> CONSEIL PÉDAGOGIQUE</span>
   <p>Une compétence s'acquiert quand tu sais expliquer et refaire ton travail.</p><span>Pratique · Autonomie · Qualité</span>
  </div>
  <Link className="secure-rail-account" href="/espace/compte"><Settings2 size={15}/> Gérer mon compte <ArrowRight size={14}/></Link>
 </>;
}
export function LearnerCompactProfile(){
 const stats=useContext(WorkspaceStatsContext);
 if(!stats||stats.role!=="learner")return null;
 return <details className="workspace-compact-profile"><summary><span className="workspace-profile-mini-avatar"><GraduationCap size={22}/></span><span><strong>{stats.displayName||"Mon profil"}</strong><small>Mon parcours et mes autres réalisations</small></span><ChevronDown size={18}/></summary><div className="workspace-profile-body"><LearnerProfileWidgets stats={stats}/></div></details>;
}
export function SecureAcademyShell({children,stats}:{children:React.ReactNode;stats:SecureWorkspaceStats}) {
  const pathname=usePathname();
  const currentTab=useSearchParams().get("onglet")||"dashboard";
  const mobileMore=useRef<HTMLDetailsElement>(null);
  const desktopMore=useRef<HTMLDetailsElement>(null);
  useEffect(()=>{if(mobileMore.current)mobileMore.current.open=false;},[pathname,currentTab]);
  const trainer=stats.role==="trainer";
  const base=trainer?"/espace/formateur":"/espace/apprenant";
  const dashboard=pathname===base&&currentTab==="dashboard";
  const learnerDashboard=!trainer&&dashboard;
  const detail=trainer&&(dashboard||pathname.startsWith("/espace/atelier/")||pathname.includes("/atelier/")||
    pathname.startsWith("/espace/compte")||pathname.startsWith("/espace/bienvenue")||pathname.startsWith("/espace/projet")||pathname.endsWith("/seances")||pathname.endsWith("/defis")||pathname.endsWith("/aide")||pathname.endsWith("/revues")||pathname.endsWith("/bilan"));
  const links=trainer?[
    {href:base,label:"Tableau de bord",icon:LayoutDashboard},
    {href:base+"?onglet=evaluations",label:"Évaluations",icon:ClipboardCheck},
    {href:"/espace/formateur/corrections",label:"Corriger les ateliers",icon:BadgeCheck},
    {href:base+"/suivi",label:"Suivi des apprenants",icon:Users},
    {href:base+"?onglet=apprenants",label:"Autres apprenants",icon:Users},
    {href:base+"/seances",label:"Mes séances",icon:CalendarDays},
    {href:base+"/defis",label:"Consignes et défis",icon:ClipboardCheck},
    {href:base+"/aide",label:"Suivi des blocages",icon:MessageCircle},
    {href:base+"/revues",label:"Revues de projets",icon:FolderKanban},
    {href:base+"?onglet=programme",label:"Programme",icon:CalendarDays},
    {href:"/catalogue",label:"Catalogue",icon:Sparkles}
  ]:[
    {href:base,label:"Tableau de bord",icon:LayoutDashboard},
    {href:"/espace/parcours/ingenierie-produit-ia",label:"Mon parcours",icon:Sparkles},
    {href:"/espace/projet",label:"Mon projet",icon:FolderKanban},
    {href:base+"/seances",label:"Mes séances",icon:CalendarDays},
    {href:base+"/defis",label:"Mes défis",icon:ClipboardCheck},
    {href:base+"/aide",label:"Besoin d’aide",icon:MessageCircle},
    {href:base+"/bilan",label:"Mon bilan",icon:BarChart3},
    {href:"/espace/portfolio",label:"Mon portfolio",icon:BriefcaseBusiness},
    {href:base+"?onglet=missions",label:"Mes réalisations",icon:BookOpen},
    {href:base+"?onglet=progression",label:"Ma progression",icon:BarChart3},
    {href:base+"?onglet=programme",label:"Mes ressources",icon:CalendarDays},
    {href:"/catalogue",label:"Catalogue",icon:Sparkles}
  ];
  const groups=trainer?[
    {label:"PILOTAGE",items:[links[0],links[2],links[3]]},
    {label:"ACCOMPAGNEMENT",items:links.slice(5,9)},
    {label:"FORMATION",items:links.slice(9)},
    {label:"AUTRES RÉALISATIONS",items:[links[1],links[4]]}
  ]:[
    {label:"APPRENDRE",items:links.slice(0,3)},
    {label:"AVEC MON FORMATEUR",items:links.slice(3,6)}
  ];
  const profileName=stats.displayName|| (trainer?"Espace formateur":"Mon parcours");
  const isActive=(href:string)=>{
    const [path,query]=href.split("?");
    if(!trainer&&path==="/espace/projet"&&(pathname===path||pathname.startsWith(path+"/")))return true;
    if(!trainer&&path==="/espace/parcours/ingenierie-produit-ia"&&
      pathname.startsWith(path))return true;
    if(trainer&&path===base+"/suivi"&&pathname===base+"/bilan")return true;
    if(path!==pathname)return false;
    const tab=new URLSearchParams(query||"").get("onglet")||"dashboard";
    return tab===currentTab;
  };
  const secondary=[...links.slice(6),{href:"/espace/bienvenue",label:"Mes objectifs",icon:Sparkles},{href:"/espace/compte",label:"Mon compte",icon:Settings2}];
  const secondaryActive=!trainer&&secondary.some(l=>isActive(l.href));
  useEffect(()=>{if(desktopMore.current)desktopMore.current.open=secondaryActive;},[pathname,currentTab,secondaryActive]);
  return <WorkspaceStatsContext.Provider value={stats}><div className="academy-viewport secure-academy-viewport"><div className={"academy-frame secure-academy-frame"+(detail?" secure-academy-detail":"")+(learnerDashboard?" workspace-learner-dashboard":"")+(!trainer?" workspace-learner-shell":"")}>
    <aside className="academy-sidebar">
      <a className="ux-skip-link" href="#workspace-content">Aller au contenu principal</a>
      <Link href={base} className="academy-brand"><span className="brand-flower"><GraduationCap size={23} strokeWidth={2.1}/></span><span>Formation <span>Pro 360</span></span></Link>
      <nav aria-label="Navigation de l'espace personnel" className="sidebar-navigation dash-nav">
        {groups.map(g=><div className="dash-nav-group" key={g.label}><div className="sidebar-category">{g.label}</div>{g.items.map(({href,label,icon:Icon})=><Link key={href} href={href} className={"sidebar-link"+(isActive(href)?" is-active":"")} aria-current={isActive(href)?"page":undefined}><Icon size={18} strokeWidth={1.8}/><span>{label}</span>{label==="Évaluations"&&stats.pending>0&&<b>{stats.pending}</b>}<WorkspaceLinkPending/></Link>)}</div>)}
      </nav>
      {!trainer?<details ref={desktopMore} className="workspace-desktop-more" open={secondaryActive} onKeyDown={e=>{if(e.key==="Escape"&&desktopMore.current?.open){e.preventDefault();desktopMore.current.open=false;desktopMore.current.querySelector("summary")?.focus();}}}><summary className={"sidebar-link"+(secondaryActive?" is-active":"")}><Settings2 size={18}/><span>Plus</span><ChevronDown size={15} className="workspace-more-chevron"/></summary><nav aria-label="Autres rubriques de mon espace" className="workspace-more-links">{secondary.map(({href,label,icon:Icon})=><Link key={href} href={href} className={"sidebar-link"+(isActive(href)?" is-active":"")} aria-current={isActive(href)?"page":undefined}><Icon size={16}/><span>{label}</span><WorkspaceLinkPending/></Link>)}</nav></details>:<><div className="sidebar-divider"/>
      <div className="sidebar-category">MON ESPACE</div>
      <nav className="sidebar-navigation" aria-label="Réglages et raccourcis">
        <Link href="/espace/compte" className={"sidebar-link"+(pathname==="/espace/compte"?" is-active":"")}><Settings2 size={18}/><span>Mon compte</span></Link>
      </nav></>}
      <div className="sidebar-spacer"/>
      <div className="sidebar-ad dash-secondary-promo"><div className="sidebar-ad-icon"><Sparkles size={21}/></div>
        <b>{trainer?"Chaque correction compte.":"Chaque projet compte."}</b>
        <p>{trainer?"Un retour précis aide chaque apprenant à progresser.":"Apprends en réalisant de vrais projets."}</p>
        <Link href={trainer?base+"?onglet=evaluations":"/espace/parcours/ingenierie-produit-ia"}>{trainer?"Voir les évaluations":"Ouvrir mon parcours"} <ArrowRight size={16}/></Link>
      </div>
      <form action={signOut} className="secure-sidebar-signout"><button type="submit"><LogOut size={16}/> Se déconnecter</button></form>
      <div className="sidebar-footer">© Formation Pro 360<br/><small>Espace personnel sécurisé</small></div>
    </aside>
    <section id="workspace-content" tabIndex={-1} className="academy-content secure-academy-content" aria-label="Contenu personnel">
      <div className="academy-mobile-brand"><Link href={base} className="academy-brand">
        <span className="brand-flower"><GraduationCap size={23}/></span><span>Formation <span>Pro 360</span></span></Link>
        <Link className="secure-mobile-account" href="/espace/compte" aria-label="Mon compte"><Settings2 size={19}/></Link>
      </div>
      {children}
      {!trainer&&!learnerDashboard&&<div className="workspace-profile-bottom"><LearnerCompactProfile/></div>}
    </section>
    {!trainer?<aside className="academy-rail secure-academy-rail workspace-learner-rail" aria-label="Profil et contexte personnel"><LearnerProfileWidgets stats={stats}/></aside>:!detail&&<aside className="academy-rail secure-academy-rail" aria-label="Profil et progression réelle">
      <div className="rail-heading"><span>Mon profil</span><Link href="/espace/compte" className="rail-heading-icon" aria-label="Gérer mon profil"><Settings2 size={18}/></Link></div>
      <div className="profile-card">
        <div className="profile-avatar profile-avatar-pro" aria-hidden="true"><GraduationCap size={37} strokeWidth={1.8}/></div>
        <h3>{profileName}</h3><p>{trainer?"Formateur":"Apprenant"} · Compte sécurisé</p>
        <div className="profile-mini-grid">
          {trainer?<><ProfileStat label="Apprenants" value={String(stats.learners)}/>
            <ProfileStat label="Autres à corriger" value={String(stats.pending)}/>
            <ProfileStat label="Autres missions" value={String(stats.missionCount)}/></>
          :<><ProfileStat label="Autres missions" value={String(stats.approvedCount)}/>
            <ProfileStat label="XP autres" value={String(stats.xp)}/>
            <ProfileStat label="Autres en attente" value={String(stats.pending)}/></>}
        </div>
      </div>
      <div className="rail-widget">
        <div className="rail-widget-heading"><h3>{trainer?"Autres corrections":"Mon parcours"}</h3><span>{trainer?(String(stats.pending).padStart(2,"0")):"16"}</span></div>
        <div className="rail-next-icon">{trainer?<ClipboardCheck size={20}/>:<Sparkles size={20}/>}</div>
        <strong>{trainer?(stats.nextTitle||"Corrections à venir"):"Ingénierie produit et IA"}</strong>
        <p>{trainer?(stats.pending?"Des livrables attendent une correction.":"Les nouvelles soumissions apparaîtront ici."):"Ouvre les 16 ateliers, vérifie ton inscription et avance jusqu'au MVP avec ton formateur."}</p>
        <Link className="rail-cta" href={trainer?(stats.nextHref||base):"/espace/parcours/ingenierie-produit-ia"}>{trainer?"Voir les corrections":"Ouvrir mon parcours"} <ArrowRight size={16}/></Link>
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
      <Link href={base+"/corrections"} className={pathname.startsWith(base+"/corrections")?"on":""}><ClipboardCheck size={19}/>Corrections</Link>
      <Link href={base+"/suivi"} className={pathname===base+"/suivi"||pathname===base+"/bilan"?"on":""}><Users size={19}/>Apprenants</Link>
    </>:<>
      <Link href="/espace/projet" className={pathname.startsWith("/espace/projet")?"on":""}><FolderKanban size={19}/>Projet</Link>
      <Link href={base+"/bilan"} className={pathname===base+"/bilan"?"on":""}><BarChart3 size={19}/>Bilan</Link>
    </>}
    <Link href={trainer?base+"/seances":"/espace/parcours/ingenierie-produit-ia"} className={(trainer?pathname===base+"/seances":pathname.startsWith("/espace/parcours/ingenierie-produit-ia"))?"on":""}><CalendarDays size={19}/>{trainer?"Séances":"Parcours"}</Link>
    {trainer?<details ref={mobileMore} className="academy-mobile-more"><summary aria-label="Autres rubriques formateur" className={pathname==="/espace/compte"||pathname===base+"/defis"||pathname===base+"/aide"||pathname===base+"/revues"||(pathname===base&&currentTab!=="dashboard")?"on":""}><Settings2 size={19}/>Plus</summary><nav className="academy-mobile-more-menu" aria-label="Autres rubriques formateur"><Link href="/catalogue"><BookOpen size={16}/> Catalogue des formations</Link><Link href={base+"?onglet=evaluations"}><ClipboardCheck size={16}/> Autres évaluations</Link><Link href={base+"?onglet=apprenants"}><Users size={16}/> Autres apprenants</Link><Link href={base+"/revues"}><FolderKanban size={16}/> Revues de projets</Link><Link href={base+"/aide"}><MessageCircle size={16}/> Suivi des blocages</Link><Link href={base+"/defis"}><ClipboardCheck size={16}/> Consignes et défis</Link><Link href={base+"?onglet=programme"}><CalendarDays size={16}/> Programme</Link><Link href="/espace/compte"><Settings2 size={16}/> Mon compte</Link></nav></details>:
      <details ref={mobileMore} className="academy-mobile-more">
        <summary aria-label="Afficher les autres rubriques de mon espace" className={
          (pathname===base+"/seances"||pathname===base+"/defis"||pathname===base+"/aide"||pathname==="/espace/portfolio"||pathname==="/espace/bienvenue"||pathname==="/espace/compte"||(pathname===base&&currentTab!=="dashboard"))?"on":""
        }><Settings2 size={19}/>Plus</summary>
        <nav className="academy-mobile-more-menu" aria-label="Autres rubriques apprenant">
          <Link href={base+"/seances"}><CalendarDays size={16}/> Mes séances</Link>
          <Link href={base+"/defis"}><ClipboardCheck size={16}/> Mes défis</Link>
          <Link href={base+"/aide"}><MessageCircle size={16}/> Besoin d’aide</Link>
          <Link href={base+"?onglet=missions"}><BookOpen size={16}/> Mes réalisations</Link>
          <Link href={base+"?onglet=progression"}><BarChart3 size={16}/> Ma progression</Link>
          <Link href="/espace/portfolio"><BriefcaseBusiness size={16}/> Mon portfolio</Link>
          <Link href={base+"?onglet=programme"}><CalendarDays size={16}/> Mes ressources</Link>
          <Link href="/espace/bienvenue"><Sparkles size={16}/> Mes objectifs</Link>
          <Link href="/espace/compte"><Settings2 size={16}/> Mon compte</Link>
          <Link href="/catalogue"><BookOpen size={16}/> Catalogue des formations</Link>
        </nav>
      </details>}
  </nav>
  </div></WorkspaceStatsContext.Provider>;
}
