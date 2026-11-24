export function workspaceDestination(pathname:string,tab:string,trainer:boolean,projectBase:string|null){
 const base=trainer?"/espace/formateur":"/espace/apprenant";
 const project=projectBase?projectBase+"/projet":"/espace/projet";
 const portfolio=projectBase?projectBase+"/portfolio":"/espace/portfolio";
 if(pathname===base&&tab==="dashboard")return "home";
 if(trainer){
  if(pathname.startsWith(base+"/corrections"))return "corrections";
  if(pathname===base+"/suivi"||pathname===base+"/bilan")return "learners";
  if(pathname===base+"/seances")return "sessions";
  return "more";
 }
 if(pathname===portfolio||pathname.startsWith(portfolio+"/")||pathname.endsWith("/portfolio"))return "more";
 if(pathname===project||pathname.startsWith(project+"/")||pathname.endsWith("/projet")||pathname.startsWith("/espace/projet/"))return "project";
 if(pathname===base+"/bilan")return "report";
 if(pathname.startsWith("/espace/parcours/")||pathname===base+"/formations"||pathname.startsWith(base+"/formations/"))return "courses";
 return "more";
}
export function prefersWorkspaceFocus(pathname:string,tab:string,trainer:boolean){
 if(trainer)return false;
 return pathname!=="/espace/apprenant"||tab!=="dashboard";
}
