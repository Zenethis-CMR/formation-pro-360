// A public course choice is a navigation hint, never an entitlement or redirect URL.
export const publicCourseSlugs=["ingenierie-produit-ia","design-produit-ux-ui-motion","copywriting-communication-contenu-ia","marketing-acquisition-ia","automatisation-integrations-agents-ia","infrastructure-devops-cybersecurite","entrepreneuriat-numerique-monetisation"] as const;
export function publicCourseChoice(value:unknown):string|null{
 return typeof value==="string"&&(publicCourseSlugs as readonly string[]).includes(value)?value:null;
}
export function withCourseChoice(path:string,value:unknown){
 const slug=publicCourseChoice(value);
 return slug?path+(path.includes("?")?"&":"?")+"parcours="+encodeURIComponent(slug):path;
}
export function learnerCourseDestination(value:unknown){
 const slug=publicCourseChoice(value);
 return slug?"/espace/apprenant/formations?choix="+encodeURIComponent(slug)+"#inscriptions":"/espace/apprenant";
}
export const publicChoiceCookie="fp360_course_choice";
