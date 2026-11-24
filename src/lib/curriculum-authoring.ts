export type CurriculumContent={title:string;objective:string;minutes:number;demonstration:string;guided_work:string;independent_work:string;ai_context:string;ai_procedure:string;ai_verification:string;resources:string;evidence:string;rubric:{label:string;descriptor:string}[]};
export type AuthoringRevision={revision:number;state:"draft"|"ready";content:CurriculumContent;created_at:string};
export type AuthoringHistory=Omit<AuthoringRevision,"content">;
export type AuthoringSource={id:string;slug:string;version:number;status:string;title:string;objective:string;guided_work:string;independent_work:string;evidence_required:string;rubric:unknown[];module_title:string;module_slug:string;track_status:string};
export type AuthoringDetail={lesson:AuthoringSource;current:AuthoringRevision|null;history:AuthoringHistory[];latest_revision:number};
export function missingAuthoring(c:CurriculumContent){
 const fields=["title","objective","demonstration","guided_work","independent_work","ai_context","ai_procedure","ai_verification","evidence"] as const;
 return [...fields.filter(k=>c[k].trim().length<(k==="title"?3:20)),...(c.rubric.length!==4||c.rubric.some(r=>r.label.trim().length<3||r.descriptor.trim().length<20)||new Set(c.rubric.map(r=>r.label.trim().toLocaleLowerCase("fr"))).size!==4?["rubric"]:[])];
}
export function initialAuthoring(source:AuthoringSource,activity?:{hours:number;procedure:string}):CurriculumContent{
 const labels=(Array.isArray(source.rubric)?source.rubric:[]).map(c=>typeof c==="string"?c:c&&typeof c==="object"&&"label" in c&&typeof c.label==="string"?c.label:"");
 return {title:source.title,objective:source.objective,minutes:activity?activity.hours*60:60,demonstration:"",guided_work:source.guided_work,independent_work:source.independent_work,ai_context:"",ai_procedure:activity?.procedure??"",ai_verification:"",resources:"",evidence:source.evidence_required,rubric:Array.from({length:4},(_,i)=>({label:labels[i]??"",descriptor:""}))};
}
