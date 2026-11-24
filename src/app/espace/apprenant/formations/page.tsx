import Link from "next/link";
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,Clock3,LockKeyhole,Award} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {canReadTrack,enrolledTracks,parseTrackProgress,selectEnrolledTrack} from "@/lib/universal-learning";
import "./formations.css";

export const dynamic="force-dynamic";
const base="/espace/apprenant/formations";
const labels={active:"En cours",completed:"Terminée",paused:"Suspendue",revoked:"Révoquée"};
export default async function LearnerFormations({searchParams}:{searchParams:Promise<{parcours?:string|string[]}>}){
 await requireRole("learner");
 const {parcours}=await searchParams;
 const response=await backendRequest("/v1/training/catalog").catch(()=>null);
 const catalog=response?.ok?await response.json().catch(()=>null):null;
 const available=Array.isArray(catalog?.tracks);
 const tracks=enrolledTracks(catalog);
 const selected=selectEnrolledTrack(tracks,parcours);
 const detail=selected?await backendRequest("/v1/training/catalog/"+encodeURIComponent(selected.slug)).catch(()=>null):null;
 const data=selected&&detail?.ok?parseTrackProgress(await detail.json().catch(()=>null),selected.slug):null;
 const summary=data?.summary;
 const percent=summary&&summary.total?Math.round(summary.approved/summary.total*100):0;
 return <main className="page ul-page">
 <Link href="/espace/apprenant" className="ul-back"><ArrowLeft size={16}/> Tableau de bord</Link>
 <header className="ul-hero"><span>MON ESPACE 360</span><h1>Mes formations.</h1><p>Choisis ton parcours pour retrouver tes validations, tes XP et tes corrections, sans mélanger les résultats des autres formations.</p><Link href="/catalogue" className="ul-link">Explorer le catalogue <ArrowRight size={16}/></Link></header>
 {!available?<section className="ul-card" role="status"><h2>Inscriptions momentanément indisponibles</h2><p>Nous ne pouvons pas confirmer tes accès. Actualise cette page pour réessayer.</p></section>:!tracks.length?<section className="ul-card"><BookOpen size={24}/><h2>Aucune inscription confirmée</h2><p>Choisis une formation ouverte dans le catalogue pour commencer.</p><Link href="/catalogue" className="ul-link">Voir les formations <ArrowRight size={16}/></Link></section>:<div className="ul-grid">
 <nav className="ul-card ul-nav" aria-label="Choisir une formation"><h2>Mes inscriptions</h2>{tracks.map(t=>canReadTrack(t)?<Link key={t.slug} className={"ul-track"+(selected?.slug===t.slug?" selected":"")} aria-current={selected?.slug===t.slug?"page":undefined} href={base+"?parcours="+encodeURIComponent(t.slug)}><BookOpen size={19}/><span><strong>{t.title}</strong><small>{labels[t.enrollment]}</small></span><ArrowRight size={16}/></Link>:<div className="ul-track ul-locked" key={t.slug}><LockKeyhole size={19}/><span><strong>{t.title}</strong><small>{labels[t.enrollment]} · accès fermé</small></span></div>)}</nav>
 <section className="ul-card ul-detail" aria-label="Progression du parcours choisi">{!selected?<><h2>Choisis une formation accessible</h2><p>Une inscription active ou terminée est nécessaire pour consulter les résultats. Les inscriptions suspendues ou révoquées ne donnent pas accès aux ateliers.</p></>:<>
 <span className="ul-overline">PARCOURS SÉLECTIONNÉ</span><h2>{selected.title}</h2>
 {!data?<p role="status">Les données du parcours ne sont pas disponibles pour cette session. Aucun résultat n’est estimé.</p>:!summary?<p role="status">Les compteurs exacts de progression ne sont pas encore disponibles. Aucun résultat n’est estimé.</p>:<>
 <div className="ul-metrics"><article><CheckCircle2 size={20}/><small>Ateliers validés</small><strong>{summary.approved}/{summary.total}</strong></article><article><Award size={20}/><small>XP de cette formation</small><strong>{data.xp}</strong></article><article><Clock3 size={20}/><small>En correction</small><strong>{summary.pending}</strong></article></div>
 {summary.total>0?<><div className="ul-progress" role="progressbar" aria-label="Ateliers validés" aria-valuemin={0} aria-valuemax={summary.total} aria-valuenow={summary.approved}><span style={{width:percent+"%"}}/></div><p>{percent}% des ateliers publiés validés · {summary.changes_requested} à améliorer · {summary.total-summary.approved-summary.pending-summary.changes_requested} à réaliser.</p></>:<p>Aucun atelier publié dans ce parcours.</p>}
 </>}
 {selected.slug==="ingenierie-produit-ia"&&data?<Link href="/espace/parcours/ingenierie-produit-ia" className="ul-link">Ouvrir mon Learning Studio <ArrowRight size={16}/></Link>:<p className="ul-note">La consultation du studio de ce parcours sera proposée lorsque son intégration sera disponible. Cette page ne publie ni n’ouvre de formation.</p>}
 </>}</section></div>}
 </main>;
}
