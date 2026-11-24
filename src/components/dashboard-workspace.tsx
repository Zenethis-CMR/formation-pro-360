import Link from "next/link";
import {ArrowRight,CalendarDays,ClipboardCheck,FolderKanban,MessageCircle,BarChart3,BriefcaseBusiness,Users,BookOpen,ChevronDown,Settings2,GraduationCap} from "lucide-react";
import type {ReactNode} from "react";
export function DashboardHeader({trainer,name}:{trainer:boolean;name?:string|null}){
 return <header className="dash-header"><div><span className="dash-kicker"><GraduationCap size={16}/> {trainer?"STUDIO PÉDAGOGIQUE":"MON ESPACE DE FORMATION"}</span><h1>{trainer?"Pilotage de la formation":"Mon apprentissage"}<span>.</span></h1><p>{trainer?"Organise tes séances, accompagne les projets et suis les réalisations.":name?"Bienvenue, "+name+". Reprends ton travail et avance avec ton formateur.":"Reprends ton travail et avance avec ton formateur, une réalisation à la fois."}</p></div><Link className="dash-account" href="/espace/compte" aria-label="Mon compte"><Settings2 size={17}/> <span>Mon compte</span></Link></header>;
}
const learnerLinks=[
 {title:"Mon projet",desc:"Dossier produit, backlog et revues",href:"/espace/projet",icon:FolderKanban},
 {title:"Mes séances",desc:"Préparer le travail avec mon formateur",href:"/espace/apprenant/seances",icon:CalendarDays},
 {title:"Mes défis",desc:"Exercices personnalisés et corrections",href:"/espace/apprenant/defis",icon:ClipboardCheck},
 {title:"Besoin d’aide",desc:"Signaler un blocage et suivre les échanges",href:"/espace/apprenant/aide",icon:MessageCircle},
 {title:"Mon bilan",desc:"Résultats et compétences abordées",href:"/espace/apprenant/bilan",icon:BarChart3},
 {title:"Mon portfolio",desc:"Présenter mes réalisations vérifiées",href:"/espace/portfolio",icon:BriefcaseBusiness},
];
const trainerLinks=[
 {title:"Suivi des apprenants",desc:"Matrice et bilans individuels",href:"/espace/formateur/suivi",icon:Users},
 {title:"Mes séances",desc:"Planifier et préparer les démonstrations",href:"/espace/formateur/seances",icon:CalendarDays},
 {title:"Consignes et défis",desc:"Attribuer et corriger les travaux",href:"/espace/formateur/defis",icon:ClipboardCheck},
 {title:"Suivi des blocages",desc:"Répondre aux difficultés signalées",href:"/espace/formateur/aide",icon:MessageCircle},
 {title:"Revues de projets",desc:"Examiner les versions partagées",href:"/espace/formateur/revues",icon:FolderKanban},
 {title:"Programme",desc:"Organiser les ateliers et ressources",href:"/espace/formateur?onglet=programme",icon:BookOpen},
];
export function DashboardQuickLinks({trainer,enrolled=true,trackSlug}:{trainer:boolean;enrolled?:boolean;trackSlug?:string}){
 const projectBase=trackSlug&&trackSlug!=="ingenierie-produit-ia"?"/espace/apprenant/formations/"+encodeURIComponent(trackSlug):null;
 const links=trainer?trainerLinks:enrolled?learnerLinks.map(l=>!projectBase?l:l.title==="Mon projet"?{...l,href:projectBase+"/projet"}:l.title==="Mon portfolio"?{...l,href:projectBase+"/portfolio"}:l.title==="Mon bilan"?{...l,title:"Ma progression",href:"/espace/apprenant/formations?parcours="+encodeURIComponent(trackSlug!)}:{...l,href:l.href+"?parcours="+encodeURIComponent(trackSlug!)}):learnerLinks.filter(l=>l.title==="Mon portfolio");
 if(!trainer)return <nav className="dash-learner-shortcuts" aria-label="Raccourcis de mon espace de travail"><div className="dash-shortcuts-heading"><h2>Mon espace de travail</h2><span>Accès rapide</span></div><div className="dash-shortcuts-grid">{links.map(({title,href,icon:Icon},index)=><Link key={href} href={href} className="dash-shortcut" data-tone={["blue","violet","amber","teal","blue","violet"][index]}><span className="dash-shortcut-icon"><Icon size={20} strokeWidth={1.8}/></span><strong>{title}</strong><ArrowRight size={14} className="dash-shortcut-arrow"/></Link>)}</div></nav>;
 return <section className="dash-actions" aria-labelledby="dash-actions-title"><div className="dash-section-head"><div><span className="dash-kicker">ACCÈS DIRECT</span><h2 id="dash-actions-title">{trainer?"Mes outils pédagogiques":"Mon espace de travail"}</h2><p>{trainer?"Retrouve tes outils d'encadrement au même endroit.":"Tous les outils pour faire avancer ton produit."}</p></div></div><div className="dash-action-grid">{links.map(({title,desc,href,icon:Icon},index)=><Link className="dash-action-card" data-tone={["blue","violet","amber","teal","blue","violet"][index]} key={href} href={href}><span className="dash-action-icon"><Icon size={21} strokeWidth={1.8}/></span><span className="dash-action-copy"><strong>{title}</strong><small>{desc}</small></span><ArrowRight className="dash-action-arrow" size={17}/></Link>)}</div>{!trainer&&!enrolled&&<p className="dash-note">Les outils du parcours deviennent accessibles selon ton inscription. Retrouve également toutes les rubriques dans la navigation.</p>}</section>;
}
export function DashboardDisclosure({title,description,children,initiallyOpen=false}:{title:string;description:string;children:ReactNode;initiallyOpen?:boolean}){
 return <details className="dash-disclosure" open={initiallyOpen}><summary><div><strong>{title}</strong><small>{description}</small></div><ChevronDown size={18}/></summary><div className="dash-disclosure-body">{children}</div></details>;
}
