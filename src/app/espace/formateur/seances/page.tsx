import "./sessions.css";
import Link from "next/link";
import {ArrowLeft,CalendarDays} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {pedagogicalContext} from "@/lib/pedagogical-context";
import {PedagogicalTrackSelector} from "@/components/pedagogical-track-selector";
import {backendRequest} from "@/lib/auth/backend";
import {PracticalSessionAgenda} from "@/components/practical-session-agenda";
import type {SessionAgenda,Participant} from "@/lib/practical-sessions";
export const dynamic="force-dynamic";
export default async function TrainerSessionsPage({searchParams}:{searchParams:Promise<{page?:string;parcours?:string|string[]}>}){
 await requireRole("trainer");
 const params=await searchParams;const parsed=Number(params.page);
 const page=Number.isInteger(parsed)&&parsed>=1&&parsed<=1000?parsed:1;
 const context=await pedagogicalContext("trainer",params.parcours);
 const api=context.api,slug=context.selected?.slug??"";
 const [a,p]=await Promise.all([((api?backendRequest(api+"/sessions?page="+page).catch(()=>null):Promise.resolve(null))),((api?backendRequest(api+"/session-participants").catch(()=>null):Promise.resolve(null)))]);
 const agenda=a?.ok?await a.json().catch(()=>null) as (SessionAgenda&{course_slug?:string})|null:null;
 const roster=p?.ok?await p.json().catch(()=>null) as {participants:Participant[];truncated:boolean;course_slug?:string}|null:null;
 return <main className="page ps-page">
  <Link href="/espace/formateur" className="ps-back"><ArrowLeft size={16}/> Espace formateur</Link>
  <header className="ps-header"><span><CalendarDays size={16}/> FORMATION PRO 360 / PÉDAGOGIE ACTIVE</span><h1>Mes séances<span>.</span></h1><p>Planifie tes interventions, prépare les démonstrations et guide tes apprenants vers des réalisations concrètes.</p></header>
 <PedagogicalTrackSelector tracks={context.tracks} selected={context.selected?.slug}/>
  {!agenda||agenda.course_slug!==slug||!roster||roster.course_slug!==slug?<section className="ps-empty" role="status"><h2>Agenda momentanément indisponible</h2><p>Les séances et les participants n'ont pas pu être chargés. Aucune donnée fictive n'est affichée.</p><Link href="/espace/formateur">Retour au tableau de bord</Link></section>:<PracticalSessionAgenda key={slug} trackSlug={slug} agenda={agenda} trainer={true} participants={roster.participants} participantsTruncated={roster.truncated}/>}
 </main>;
}
