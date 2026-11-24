import type {ProductDossier,ProductProject} from "./learner-product-project";
import {projectSections} from "./learner-product-project";
import type {ProductBacklog,ProductTask} from "./product-backlog";
export const reviewSections=[...projectSections.map(s=>({id:s.id,label:s.title,description:s.description})),{id:"backlog" as const,label:"Backlog produit",description:"Tâches, priorités et critères de vérification déclarés."},{id:"evidence" as const,label:"Preuves officielles",description:"Ateliers approuvés avec XP vérifiés."}];
export type ReviewSection=(typeof reviewSections)[number]["id"];
export type ReviewProof={id:string;lesson_slug:string;lesson_title:string;url:string;score:number;xp:number;reviewed_at:string};
export type ReviewSnapshot=Partial<Record<Exclude<ReviewSection,"backlog"|"evidence">,Partial<ProductDossier>>>&{backlog?:ProductTask[];evidence?:ReviewProof[]};
export type ReviewComment={id:string;section:ReviewSection;kind:"observation"|"recommendation";body:string;learner_response:string|null;responded_at:string|null;created_at:string};
export type ReviewSummary={id:string;label:string;question:string;sections:ReviewSection[];project_revision:number;backlog_revision:number|null;revision:number;created_at:string;updated_at:string;revoked_at:string|null;editable:boolean;learner_id?:string;learner_name?:string|null;comment_count:number;pending_count:number};
export type ReviewDetail=ReviewSummary&{snapshot:ReviewSnapshot;comments:ReviewComment[]};
export type ReviewList={reviews:ReviewSummary[];selected:ReviewDetail|null;page:number;has_next:boolean;can_share:boolean};
export type ShareSources={project:ProductProject|null;backlog:ProductBacklog|null;proofs:ReviewProof[]|null};
export type ReviewAction=
 |{intent:"share";label:string;question:string;sections:ReviewSection[];project_revision:number;backlog_revision:number|null;evidence_ids:string[];consent:true}
 |{intent:"revoke";id:string;revision:number}
 |{intent:"comment";id:string;revision:number;section:ReviewSection;kind:"observation"|"recommendation";body:string}
 |{intent:"respond";id:string;revision:number;comment_id:string;body:string};
export function previewSnapshot(sources:ShareSources,sections:ReviewSection[],proofIds:string[]):ReviewSnapshot{
 const snapshot:ReviewSnapshot={};
 for(const s of projectSections)if(sections.includes(s.id)&&sources.project)snapshot[s.id]=Object.fromEntries(s.fields.map(f=>[f.key,sources.project!.dossier[f.key]]));
 if(sections.includes("backlog")&&sources.backlog)snapshot.backlog=sources.backlog.tasks;
 if(sections.includes("evidence")&&sources.proofs)snapshot.evidence=sources.proofs.filter(p=>proofIds.includes(p.id));
 return snapshot;
}
export function shareReady(s:ShareSources,sections:ReviewSection[],proofIds:string[],label:string,consent:boolean){
 return !!s.project&&label.trim().length>=3&&sections.length>0&&consent&&(!sections.includes("backlog")||!!s.backlog)&&(!sections.includes("evidence")||!!s.proofs&&proofIds.length>0&&proofIds.every(id=>s.proofs!.some(p=>p.id===id)));
}
export function reviewDate(d:string){return new Intl.DateTimeFormat("fr-FR",{dateStyle:"medium",timeStyle:"short",timeZone:"Africa/Douala"}).format(new Date(d));}
