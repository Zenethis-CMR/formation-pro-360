export type EnrollmentOffer={slug:string;title:string;summary:string;lesson_count:number;module_count:number};
export function validEnrollmentSlug(value:unknown):value is string{return typeof value==="string"&&value.length<=100&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);}
export function availableEnrollmentOffers(raw:unknown):EnrollmentOffer[]{
 if(!raw||typeof raw!=="object"||!("tracks" in raw)||!Array.isArray(raw.tracks))return [];
 const seen=new Set<string>(),out:EnrollmentOffer[]=[];
 for(const t of raw.tracks){
  if(!t||!validEnrollmentSlug(t.slug)||seen.has(t.slug)||t.status!=="published"||t.enrollment!==null||t.enrollment_open!==true||typeof t.title!=="string"||typeof t.summary!=="string"||!Number.isSafeInteger(t.lesson_count)||t.lesson_count<1||!Number.isSafeInteger(t.module_count)||t.module_count<1)continue;
  seen.add(t.slug);out.push({slug:t.slug,title:t.title,summary:t.summary,lesson_count:t.lesson_count,module_count:t.module_count});
 }
 return out;
}
