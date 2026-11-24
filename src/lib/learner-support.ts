export const supportCategories={product:"Produit et stratégie",ux:"Design UX/UI",technical:"Développement technique",quality:"Tests et qualité",business:"Business et acquisition",organization:"Organisation du travail",other:"Autre difficulté"} as const;
export const supportStatuses={waiting_trainer:"En attente du formateur",waiting_learner:"Retour à vérifier",resolved:"Résolu"} as const;
export type SupportCategory=keyof typeof supportCategories;
export type SupportStatus=keyof typeof supportStatuses;
export type SupportFields={title:string;category:SupportCategory;urgency:"normal"|"blocking";workshop_slug:string|null;context:string;attempted:string;expected:string};
export type SupportMessage={id:string;author_role:"learner"|"trainer";kind:"reply"|"resolved"|"reopened";body:string;created_at:string};
export type SupportThread=SupportFields&{id:string;learner_id?:string;learner_name?:string|null;editable?:boolean;status:SupportStatus;revision:number;created_at:string;updated_at:string;messages:SupportMessage[]};
export type SupportList={threads:SupportThread[];page:number;has_next:boolean};
export type SupportAction=({intent:"create"}&SupportFields)|{intent:"reply"|"resolve"|"reopen";id:string;revision:number;body:string};
export const emptySupport=():SupportFields=>({title:"",category:"technical",urgency:"normal",workshop_slug:null,context:"",attempted:"",expected:""});
export const supportReady=(f:SupportFields)=>[f.title,f.context,f.attempted,f.expected].every(v=>v.trim().length>=3);
export function supportOrder(t:SupportThread,trainer:boolean){return (t.status===(trainer?"waiting_trainer":"waiting_learner")?0:t.status==="resolved"?4:2)+(t.urgency==="blocking"?0:1);}
export const supportTimestamp=(value:string)=>new Intl.DateTimeFormat("fr-FR",{dateStyle:"medium",timeStyle:"short",timeZone:"Africa/Douala"}).format(new Date(value));
