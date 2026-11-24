import Link from "next/link";
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,Clock3,LockKeyhole,Award} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {canReadTrack,selectEnrolledTrack} from "@/lib/universal-learning";
import {loadLearningContext,loadLearningDetail} from "@/lib/active-learning-context";
import {setActiveLearningTrack} from "./actions";
import {AdaptiveLearningPanel} from "@/components/adaptive-learning-panel";
import "./formations.css";

export const dynamic="force-dynamic";
const base="/espace/apprenant/formations";
const labels={active:"En cours",completed:"Terminée",paused:"Suspendue",revoked:"Révoquée"};
export default async function LearnerFormations({searchParams}:{searchParams:Promise<{parcours?:string|string[];selection?:string}>}){
 const {db,user}=await requireRole("learner");
 const {parcours,selection}=await searchParams;
 const {available,tracks,active}=await loadLearningContext();
 const selected=selectEnrolledTrack(tracks,parcours??active?.slug);
 const detail=selected?await loadLearningDetail(selected.slug):null;
 const data=detail?.progress??null;
 const prefs=selected&&detail?await db.from("learner_preferences").select("regular_days,minutes_per_day,optional_days").eq("learner_id",user.id).maybeSingle():null;
 const summary=data?.summary;
 const percent=summary&&summary.total?Math.round(summary.approved/summary.total*100):0;
 return <main className="page ul-page">
 <Link href="/espace/apprenant" className="ul-back"><ArrowLeft size={16}/> Tableau de bord</Link>
 <header className="ul-hero"><span>MON ESPACE 360</span><h1>Mes formations.</h1><p>Choisis ton parcours pour retrouver tes validations, tes XP et tes corrections, sans mélanger les résultats des autres formations.</p><Link href="/catalogue" className="ul-link">Explorer le catalogue <ArrowRight size={16}/></Link></header>
 {selection==="ok"&&active?.slug===selected?.slug&&<p className="alert success" role="status">Formation active enregistrée.</p>}{selection==="refusee"&&<p className="alert danger" role="alert">La formation demandée n’est pas accessible.</p>}
 {!available?<section className="ul-card" role="status"><h2>Inscriptions momentanément indisponibles</h2><p>Nous ne pouvons pas confirmer tes accès. Actualise cette page pour réessayer.</p></section>:!tracks.length?<section className="ul-card"><BookOpen size={24}/><h2>Aucune inscription confirmée</h2><p>Choisis une formation ouverte dans le catalogue pour commencer.</p><Link href="/catalogue" className="ul-link">Voir les formations <ArrowRight size={16}/></Link></section>:<div className="ul-grid">
 <nav className="ul-card ul-nav" aria-label="Choisir une formation"><h2>Mes inscriptions</h2>{tracks.map(t=>canReadTrack(t)?<Link key={t.slug} className={"ul-track"+(selected?.slug===t.slug?" selected":"")} aria-current={selected?.slug===t.slug?"page":undefined} href={base+"?parcours="+encodeURIComponent(t.slug)}><BookOpen size={19}/><span><strong>{t.title}</strong><small>{labels[t.enrollment]}{active?.slug===t.slug?" · Active":""}</small></span><ArrowRight size={16}/></Link>:<div className="ul-track ul-locked" key={t.slug}><LockKeyhole size={19}/><span><strong>{t.title}</strong><small>{labels[t.enrollment]} · accès fermé</small><Link href={base+"/"+encodeURIComponent(t.slug)+"/portfolio"} className="ul-link">Gérer le partage</Link><Link href={"/espace/projet/revues?parcours="+encodeURIComponent(t.slug)} className="ul-link">Gérer les revues</Link></span></div>)}</nav>
 <section className="ul-card ul-detail" aria-label="Progression du parcours choisi">{!selected?<><h2>Choisis une formation accessible</h2><p>Une inscription active ou terminée est nécessaire pour consulter les résultats. Les inscriptions suspendues ou révoquées ne donnent pas accès aux ateliers.</p></>:<>
 <span className="ul-overline">{active?.slug===selected.slug?"FORMATION ACTIVE":"PARCOURS CONSULTÉ"}</span><h2>{selected.title}</h2>
 {active?.slug!==selected.slug&&data&&<form action={setActiveLearningTrack}><input type="hidden" name="trackSlug" value={selected.slug}/><button type="submit" className="primary-btn">Définir comme formation active <ArrowRight size={16}/></button></form>}
 {!data?<p role="status">Les données du parcours ne sont pas disponibles pour cette session. Aucun résultat n’est estimé.</p>:!summary?<p role="status">Les compteurs exacts de progression ne sont pas encore disponibles. Aucun résultat n’est estimé.</p>:<>
 <div className="ul-metrics"><article><CheckCircle2 size={20}/><small>Ateliers validés</small><strong>{summary.approved}/{summary.total}</strong></article><article><Award size={20}/><small>XP de cette formation</small><strong>{data.xp}</strong></article><article><Clock3 size={20}/><small>En correction</small><strong>{summary.pending}</strong></article></div>
 {summary.total>0?<><div className="ul-progress" role="progressbar" aria-label="Ateliers validés" aria-valuemin={0} aria-valuemax={summary.total} aria-valuenow={summary.approved}><span style={{width:percent+"%"}}/></div><p>{percent}% des ateliers publiés validés · {summary.changes_requested} à améliorer · {summary.total-summary.approved-summary.pending-summary.changes_requested} à réaliser.</p></>:<p>Aucun atelier publié dans ce parcours.</p>}
 </>}
 {data&&<div><Link className="ul-link" href={selected.slug==="ingenierie-produit-ia"?"/espace/projet":base+"/"+encodeURIComponent(selected.slug)+"/projet"}>Mon dossier projet <ArrowRight size={16}/></Link> · <Link className="ul-link" href={selected.slug==="ingenierie-produit-ia"?"/espace/portfolio":base+"/"+encodeURIComponent(selected.slug)+"/portfolio"}>Mon portfolio <ArrowRight size={16}/></Link></div>}
 {data?<Link href={selected.slug==="ingenierie-produit-ia"?"/espace/parcours/ingenierie-produit-ia":base+"/"+encodeURIComponent(selected.slug)+"/studio"} className="ul-link">Ouvrir mon Learning Studio <ArrowRight size={16}/></Link>:<p className="ul-note">L’accès au studio doit être confirmé par le serveur. Cette page ne publie ni n’ouvre de formation.</p>}
 </>}</section></div>}
 {selected&&detail&&active?.slug===selected.slug&&<AdaptiveLearningPanel slug={selected.slug} track={detail.studio} summary={data?.summary??null} xp={data?.xp??0} availability={prefs?.error?null:prefs?.data as {regular_days:number[]|null;minutes_per_day:number;optional_days:number[]}|null??null}/>}
 </main>;
}
