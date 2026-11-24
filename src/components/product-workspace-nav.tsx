import {FolderKanban,Columns3,GraduationCap,MessageSquare,BriefcaseBusiness} from "lucide-react";
const items=[
 {id:"dossier",href:"/espace/projet",label:"Dossier produit",icon:FolderKanban},
 {id:"backlog",href:"/espace/projet/backlog",label:"Backlog",icon:Columns3},
 {id:"accompagnement",href:"/espace/projet/accompagnement",label:"Préparer ma séance",icon:GraduationCap},
 {id:"revues",href:"/espace/projet/revues",label:"Revues",icon:MessageSquare},
 {id:"portfolio",href:"/espace/portfolio",label:"Portfolio",icon:BriefcaseBusiness}
] as const;
export type ProductDestination=(typeof items)[number]["id"];
export function ProductWorkspaceNav({active}:{active:ProductDestination}){
 // Full document navigation deliberately preserves the editors' existing beforeunload protection.
 return <nav className="pw-nav" aria-label="Navigation du Product Workspace">
  <span className="pw-nav-label">MON PRODUIT</span>
  <div className="pw-nav-links">{items.map(({id,href,label,icon:Icon})=><a key={id} href={href} aria-current={active===id?"page":undefined} className={active===id?"active":""}><Icon size={17} strokeWidth={1.8}/><span>{label}</span></a>)}</div>
 </nav>;
}
