import Link from "next/link";
import {ArrowRight,Users,ClipboardCheck,BookOpen,CheckCircle2} from "lucide-react";
import {loadTrainerCockpit} from "@/lib/trainer-cockpit";
import "./trainer-cockpit.css";
export async function UniversalTrainerCockpit(){
 const tracks=await loadTrainerCockpit();
 const published=tracks?.filter(t=>t.status==="published")??[];
 const sum=(key:"enrollments"|"pending"|"rework"|"verified")=>published.reduce((n,t)=>n+(t.metrics?.[key]??0),0);
 return <section className="utc" aria-labelledby="utc-title">
 <header className="utc-head"><div><span>FORMATION PRO 360 · PILOTAGE HUMAIN</span><h2 id="utc-title">Centre de pilotage pédagogique</h2><p>Les formations, les corrections et les interventions à préparer, à partir des données officielles.</p></div><Link href="/espace/formateur/formations">Gérer les programmes <ArrowRight size={16}/></Link></header>
 {!tracks?<div className="utc-unavailable" role="status"><h3>Indicateurs momentanément indisponibles</h3><p>Aucun chiffre n’est estimé. Les outils existants restent accessibles.</p></div>:<>
 <div className="utc-kpis">{[{label:"Inscriptions aux parcours",value:sum("enrollments"),icon:Users},{label:"Derniers dépôts à corriger",value:sum("pending"),icon:ClipboardCheck},{label:"Ateliers à reprendre",value:sum("rework"),icon:BookOpen},{label:"Preuves vérifiées",value:sum("verified"),icon:CheckCircle2}].map(k=><article key={k.label}><k.icon size={20}/><small>{k.label}</small><strong>{k.value}</strong></article>)}</div>
 <p className="utc-note">{published.length} formation(s) publiée(s) sur {tracks.length}. Une personne inscrite à deux formations compte pour deux inscriptions. Les corrections et XP incluent l’historique officiel, pas les brouillons.</p>
 <div className="utc-grid">{tracks.map(t=><article key={t.slug} className="utc-course"><div className="utc-course-head"><span className={t.status==="published"?"utc-open":"utc-draft"}>{t.status==="published"?"Publiée":t.status==="draft"?"En préparation":t.status==="archived"?"Archivée":t.status}</span><h3>{t.title}</h3></div>{t.metrics?<><div className="utc-course-stats"><div><small>Inscrits actifs</small><strong>{t.metrics.active}</strong></div><div><small>À corriger</small><strong>{t.metrics.pending}</strong></div><div><small>À reprendre</small><strong>{t.metrics.rework}</strong></div></div><p>{t.metrics.workshops} ateliers publiés · {t.metrics.verified} preuves vérifiées · {t.metrics.xp} XP officiels</p><div className="utc-actions"><Link href={"/espace/formateur/suivi?parcours="+encodeURIComponent(t.slug)}>Suivi individuel <ArrowRight size={15}/></Link><Link href={"/espace/formateur/corrections?parcours="+encodeURIComponent(t.slug)}>Corrections <ArrowRight size={15}/></Link>{[["seances","Séances"],["defis","Défis"],["aide","Blocages"],["revues","Revues"]].map(([route,label])=><Link key={route} href={"/espace/formateur/"+route+"?parcours="+encodeURIComponent(t.slug)}>{label} <ArrowRight size={15}/></Link>)}</div></>:<><p>Le contenu reste fermé. Aucun indicateur de progression n’est affiché.</p><Link href="/espace/formateur/formations">Gérer les contenus <ArrowRight size={15}/></Link></>}</article>)}</div>
 </>}
 <div className="utc-note">Les séances, défis et demandes d’aide sont contextualisés par formation. Les revues collaboratives sont accessibles par formation ; seuls les dossiers volontairement partagés sont visibles. Les signaux de progression servent à préparer l’accompagnement, pas à diagnostiquer automatiquement une difficulté.</div>
 </section>;
}
