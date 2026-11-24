import Link from "next/link";
import {ArrowLeft,ArrowRight,ClipboardCheck,LockKeyhole,BookOpen} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {getAiTrainingPlan,trainingMinutes,formatWorkload} from "@/lib/ai-training-plans";
import {parseQuality,qualityLabels} from "@/lib/curriculum-quality";
import "../formations.css";
import "./quality.css";
export const dynamic="force-dynamic";
const label=(v:string)=>qualityLabels[v]??v;
const states={blocked:"À préparer",candidate_for_manual_review:"Candidat à la revue humaine",published_review:"Publié · à auditer",archived:"Archivé"};
export default async function QualityPage(){
 await requireRole("trainer");
 const response=await backendRequest("/v1/training/curriculum-quality").catch(()=>null);
 const tracks=parseQuality(response?.ok?await response.json().catch(()=>null):null);
 return <main className="page mf-page quality-page">
 <Link className="mf-back" href="/espace/formateur/formations"><ArrowLeft size={16}/> Mes formations</Link>
 <header className="quality-hero"><div><span><ClipboardCheck size={18}/> QUALITY GATE 360</span><h1>Préparer les formations.</h1><p>Contrôle des versions, des charges et des preuves avant ouverture. Les contrôles automatiques ne remplacent pas la relecture du formateur.</p></div><div className="quality-lock"><LockKeyhole size={22}/><strong>Activation désactivée</strong><small>Aucune inscription créée depuis cet écran</small></div></header>
 {!tracks?<section className="mf-notice" role="status">Contrôle qualité indisponible. Aucun état de préparation n’est estimé.</section>:<>
 <section className="quality-kpis" aria-label="Synthèse"><article><small>Parcours contrôlés</small><strong>{tracks.length}</strong></article><article><small>Ateliers enregistrés</small><strong>{tracks.reduce((n,t)=>n+(t.lesson_count??0),0)}</strong></article><article><small>Candidats à la revue</small><strong>{tracks.filter(t=>t.gate==="candidate_for_manual_review").length}</strong></article><article><small>Brouillons bloqués</small><strong>{tracks.filter(t=>t.gate==="blocked").length}</strong></article></section>
 <p className="quality-note">Les charges proposées proviennent du plan pédagogique éditorial. Une charge scellée correspond uniquement à une référence privée actuelle qui satisfait les contrôles techniques. Ni l’une ni l’autre ne garantit le temps réellement travaillé ou l’acquisition des compétences.</p>
 <div className="quality-list">{tracks.map(t=>{
  const plan=getAiTrainingPlan(t.slug),base="/espace/formateur/formations/"+encodeURIComponent(t.slug);
  return <section className="quality-course" key={t.slug}><header><div><span className="quality-state">{states[t.gate]}</span><h2>{t.title}</h2><p>{t.module_count??"—"} modules · {t.lesson_count??"—"} ateliers · {t.ready_count===null?"Contenu officiel":t.ready_count+" copies prêtes"}</p></div><div className="quality-links"><Link href={"/espace/formateur/formations?parcours="+encodeURIComponent(t.slug)}>Programme <ArrowRight size={16}/></Link>{t.status==="draft"&&<Link href={base+"/publication"}>Scellement <ArrowRight size={16}/></Link>}</div></header>
  <div className="quality-metrics"><div><small>Charge proposée</small><strong>{plan?formatWorkload(trainingMinutes(plan)):"À définir"}</strong></div><div><small>Dernière référence</small><strong>{t.sealed_version?"v"+t.sealed_version:"—"}</strong></div><div><small>Charge scellée contrôlée</small><strong>{t.approved_minutes!==null?formatWorkload(t.approved_minutes):"Non confirmée"}</strong></div></div>
  {t.blockers.length>0&&<div className="quality-blockers"><strong>Points bloquants</strong><ul>{t.blockers.map(x=><li key={x}>{label(x)}</li>)}</ul></div>}
  {t.warnings.length>0&&<ul className="quality-warnings">{t.warnings.map(x=><li key={x}>{label(x)}</li>)}</ul>}
  {t.lessons.length>0&&<details><summary><BookOpen size={17}/> Examiner les {t.lessons.length} ateliers <span>{t.lessons.filter(l=>l.issues.length>0).length} à corriger</span></summary><div className="quality-lessons">{t.lessons.map(l=><article key={l.lesson_id}><div><small>{l.module_title}{l.revision?" · r"+l.revision:""}</small><h3>{l.title}</h3><small>{l.minutes===null?"Charge à confirmer":formatWorkload(l.minutes)}</small>{l.issues.length>0?<ul>{l.issues.map(x=><li key={x}>{label(x)}</li>)}</ul>:<p>Contrôles structurels passés.</p>}{l.warnings.length>0&&<p>{l.warnings.map(label).join(" · ")}</p>}</div><Link href={base+"/atelier/"+encodeURIComponent(l.lesson_id)}>Vérifier <ArrowRight size={15}/></Link></article>)}</div></details>}
  </section>;
 })}</div></>}
 </main>;
}
