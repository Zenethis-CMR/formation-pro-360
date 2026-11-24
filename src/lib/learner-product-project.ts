export const projectSections=[
 {id:"vision",title:"Vision et identité",description:"Définis le produit, le besoin et la valeur apportée.",fields:[
  {key:"name",label:"Nom du produit",max:100},{key:"pitch",label:"Pitch en une phrase",max:400},
  {key:"problem",label:"Problème utilisateur",max:2000},{key:"audience",label:"Cible principale",max:1200},
  {key:"value_proposition",label:"Proposition de valeur",max:1500}]},
 {id:"discovery",title:"Recherche utilisateur",description:"Documente des observations réelles, sans données personnelles inutiles.",fields:[
  {key:"research",label:"Entretiens, enseignements et hypothèses à vérifier",max:2000}]},
 {id:"design",title:"Conception produit et UX",description:"Relie la valeur au périmètre et au scénario principal.",fields:[
  {key:"scope",label:"Périmètre du MVP et fonctionnalités prioritaires",max:2000},
  {key:"user_flow",label:"Parcours utilisateur et cas d'erreur",max:2000},
  {key:"prd_url",label:"Lien PRD",max:800,link:true},{key:"design_url",label:"Lien prototype / maquettes",max:800,link:true}]},
 {id:"engineering",title:"Ingénierie et sécurité",description:"Explique tes choix et la protection des données.",fields:[
  {key:"architecture",label:"Architecture, stack et intégrations",max:2500},
  {key:"data_security",label:"Modèle de données, accès et risques de sécurité",max:2000},
  {key:"repo_url",label:"Lien du dépôt GitHub",max:800,link:true}]},
 {id:"delivery",title:"Qualité et livraison",description:"Prépare la démonstration, les tests et les procédures.",fields:[
  {key:"test_plan",label:"Scénarios de test et résultats observés",max:2000},
  {key:"release_notes",label:"Versions, documentation et retours de terrain",max:2000},
  {key:"deploy_url",label:"Lien du produit déployé",max:800,link:true},{key:"demo_url",label:"Lien de démonstration",max:800,link:true}]},
 {id:"business",title:"Business et acquisition",description:"Documente les expériences, pas des revenus supposés.",fields:[
  {key:"business_model",label:"Offre, prix et modèle économique",max:2000},
  {key:"acquisition",label:"Canaux, prospects et expériences d'acquisition",max:2000},
  {key:"metrics",label:"Indicateurs réels et apprentissages commerciaux",max:2000},
  {key:"analytics_url",label:"Lien des indicateurs (facultatif)",max:800,link:true}]},
 {id:"pilotage",title:"Pilotage et prochaine action",description:"Transforme les difficultés en actions concrètes.",fields:[
  {key:"risks",label:"Risques, blocages et décisions",max:2000},
  {key:"next_action",label:"Prochaine action concrète",max:1000}]}
] as const;
export type ProjectKey=(typeof projectSections)[number]["fields"][number]["key"];
export type ProductDossier=Record<ProjectKey,string>;
export type ProductProject={dossier:ProductDossier;revision:number;updated_at:string};
export const emptyDossier=()=>Object.fromEntries(projectSections.flatMap(section=>section.fields.map(field=>[field.key,""]))) as ProductDossier;
export type VerifiedEvidence={id:string;lesson_slug:string;lesson_title:string;week:number;url:string;score:number;xp:number;reviewed_at:string};
export type ProjectReview={id:string;lesson_slug?:string;status:"approved"|"pending"|"changes_requested";feedback:string|null;score:number|null;created_at:string;reviewed_at:string|null};
export const projectMilestones=[
 {day:14,title:"Premier scénario fonctionnel",description:"Problème, PRD, architecture et premier flux déployé.",lessons:["valider-probleme","prd-prototype","architecture-repo","flux-deploye"]},
 {day:30,title:"MVP utilisable",description:"Les huit premiers ateliers couvrent la conception, les tests et le MVP éprouvé.",lessons:["valider-probleme","prd-prototype","architecture-repo","flux-deploye","crud-permissions","tests-accessibilite","livraison-observable","retours-utilisateurs"]},
 {day:56,title:"Offre et produit 360",description:"Acquisition, essais de vente, exploitation et présentation finale.",lessons:["valider-probleme","prd-prototype","architecture-repo","flux-deploye","crud-permissions","tests-accessibilite","livraison-observable","retours-utilisateurs","offre-marche","landing-analytics","canal-acquisition","crm-suivi","prix-facturation","essais-vente","fiabilite-runbook","jury-portfolio"]}
] as const;
export function milestoneProgress(evidence:VerifiedEvidence[]|null){
 const verified=new Set((evidence||[]).filter(e=>e.xp===100&&e.score>=80).map(e=>e.lesson_slug));
 return projectMilestones.map(m=>{
  const count=m.lessons.filter(slug=>verified.has(slug)).length;
  return {...m,count,available:evidence!==null,complete:evidence!==null&&count===m.lessons.length};
 });
}
export function safeProjectLink(value:string){
 try{const url=new URL(value);return url.protocol==="https:"&&!url.username&&!url.password?url.href:null;}catch{return null;}
}
