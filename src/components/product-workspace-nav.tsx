/* eslint-disable @next/next/no-html-link-for-pages -- full navigation triggers the native unsaved draft guard */
import {FolderKanban,Columns3,GraduationCap,MessageSquare,BriefcaseBusiness} from "lucide-react";
const items=[
 {id:"dossier",href:"/espace/projet",label:"Dossier produit",icon:FolderKanban},
 {id:"backlog",href:"/espace/projet/backlog",label:"Backlog",icon:Columns3},
 {id:"accompagnement",href:"/espace/projet/accompagnement",label:"Préparer ma séance",icon:GraduationCap},
 {id:"revues",href:"/espace/projet/revues",label:"Revues",icon:MessageSquare},
 {id:"portfolio",href:"/espace/portfolio",label:"Portfolio",icon:BriefcaseBusiness}
] as const;
export type ProductDestination=(typeof items)[number]["id"];
export function ProductWorkspaceNav({active,trackSlug="ingenierie-produit-ia"}:{active:ProductDestination;trackSlug?:string}){
 const pilot=trackSlug==="ingenierie-produit-ia",base="/espace/apprenant/formations/"+encodeURIComponent(trackSlug);
 const destination=(id:ProductDestination,href:string)=>pilot?href:id==="dossier"?base+"/projet":id==="portfolio"?base+"/portfolio":href+"?parcours="+encodeURIComponent(trackSlug);
 // Full document navigation deliberately preserves the editors' existing beforeunload protection.
 return <nav className="pw-nav" aria-label="Navigation du Product Workspace">
  <span className="pw-nav-label">{pilot?"MON PRODUIT":"MON PROJET"}</span>
  <div className="pw-nav-links">{items.map(({id,href,label,icon:Icon})=><a key={id} href={destination(id,href)} aria-current={active===id?"page":undefined} className={active===id?"active":""}><Icon size={17} strokeWidth={1.8}/><span>{!pilot&&id==="dossier"?"Dossier projet":label}</span></a>)}</div>
 </nav>;
}
