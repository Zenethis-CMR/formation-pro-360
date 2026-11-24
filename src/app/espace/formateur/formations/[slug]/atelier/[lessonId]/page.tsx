import Link from "next/link";
import {ArrowLeft,LockKeyhole} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {getAiTrainingPlan} from "@/lib/ai-training-plans";
import {pilotCourse} from "@/lib/v2-public-catalog";
import {initialAuthoring,type AuthoringDetail} from "@/lib/curriculum-authoring";
import {CurriculumEditor} from "@/components/curriculum-editor";
import "../../../authoring.css";
export const dynamic="force-dynamic";
export default async function AuthoringPage({params,searchParams}:{params:Promise<{slug:string;lessonId:string}>;searchParams:Promise<{revision?:string}>}){
 await requireRole("trainer");
 const {slug,lessonId}=await params;const query=await searchParams;
 const endpoint="/v1/training/catalog/"+encodeURIComponent(slug)+"/authoring/"+encodeURIComponent(lessonId);
 const response=await backendRequest(endpoint+(query.revision?"?revision="+encodeURIComponent(query.revision):"")).catch(()=>null);
 const detail=response?.ok?await response.json().catch(()=>null) as AuthoringDetail|null:null;
 const base="/espace/formateur/formations?parcours="+encodeURIComponent(slug);
 if(!detail)return <main className="page ca-page"><Link href={base}><ArrowLeft size={16}/> Retour au programme</Link><section className="ca-unavailable"><LockKeyhole size={28}/><h1>Atelier indisponible</h1><p>Le studio de rédaction ne peut pas charger cette activité. Vérifie le parcours et la disponibilité du backend.</p></section></main>;
 const lesson=detail.lesson;
 const mi=slug===pilotCourse.slug?pilotCourse.modules.findIndex(m=>m.slug===lesson.module_slug):Number(/^semaine-(\d+)$/.exec(lesson.module_slug)?.[1])-1;
 const li=slug===pilotCourse.slug?pilotCourse.modules[mi]?.lessons.findIndex(l=>l.slug===lesson.slug):Number(/^s\d+-a(\d+)$/.exec(lesson.slug)?.[1])-1;
 const activity=li!==undefined?getAiTrainingPlan(slug)?.modules[mi]?.activities[li]:undefined;
 return <main className="page ca-page"><CurriculumEditor key={lesson.id+":"+String(query.revision??"latest")} slug={slug} detail={detail} initial={detail.current?.content??initialAuthoring(lesson,activity)} historical={!!query.revision}/></main>;
}
