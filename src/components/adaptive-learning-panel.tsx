import Link from "next/link";
import {ArrowRight,CalendarDays,Clock3,BookOpen,CheckCircle2} from "lucide-react";
import {formatWorkload} from "@/lib/ai-training-plans";
import {doualaCalendarDate} from "@/lib/learner-week-plan";
import {publishedWorkItems,forecastWork,type Availability} from "@/lib/adaptive-learning-plan";
import type {StudioTrack,ProgressSummary} from "@/lib/universal-learning";
import "./adaptive-learning.css";
const formatDate=(value:string)=>new Intl.DateTimeFormat("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(value+"T12:00:00Z"));
export function AdaptiveLearningPanel({slug,track,summary,xp,availability}:{slug:string;track:StudioTrack;summary:ProgressSummary|null;xp:number;availability:Availability|null}){
 const {items,completeCoverage}=publishedWorkItems(slug,track);
 const plan=forecastWork(items,availability,doualaCalendarDate(),completeCoverage);
 const next=track.lessons.find(l=>l.state==="changes_requested")??track.lessons.find(l=>l.state==="not_started");
 const base="/espace/apprenant/formations/"+encodeURIComponent(slug)+"/studio";
 const nextHref=next?base+"?atelier="+encodeURIComponent(next.id):base;
 const done=completeCoverage&&items.length>0&&items.every(x=>x.state==="approved");
 return <section className="adaptive-panel" id="planning-adaptatif" aria-label="Planning de la formation active">
 <header className="adaptive-head"><div><span>FORMATION ACTIVE · MON RYTHME</span><h2>{track.title}</h2><p>Travaille sur les ateliers restants, sans confondre temps de préparation et validation officielle.</p></div><Link href="/espace/apprenant/formations" className="adaptive-link">Changer de formation <ArrowRight size={16}/></Link></header>
 <div className="adaptive-metrics"><article><CheckCircle2 size={19}/><small>Ateliers validés</small><strong>{summary?summary.approved+"/"+summary.total:"—"}</strong></article><article><BookOpen size={19}/><small>XP du parcours</small><strong>{summary?xp:"—"}</strong></article><article><Clock3 size={19}/><small>Charge à produire estimée</small><strong>{plan.remainingMinutes===null?"—":formatWorkload(plan.remainingMinutes)}</strong></article><article><CalendarDays size={19}/><small>Capacité hebdomadaire fixe</small><strong>{plan.weeklyMinutes===null?"—":formatWorkload(plan.weeklyMinutes)}</strong></article></div>
 <div className="adaptive-next"><div><span>PROCHAINE ACTION</span><h3>{next?.title??(done?"Tous les ateliers sont validés":plan.pending?"Suivre les corrections":"Consulter mon programme")}</h3><p>{plan.pending} atelier(s) en correction · {plan.revisions} à améliorer</p></div><Link href={nextHref} className="primary-btn">{next?"Reprendre l’atelier":"Ouvrir le studio"} <ArrowRight size={16}/></Link></div>
 <div className="adaptive-forecast"><div><h3>Fin prévisionnelle du travail restant</h3>{done?<p>Tous les ateliers du programme sont validés.</p>:plan.courseWorkDate?<strong>{formatDate(plan.courseWorkDate)}</strong>:<p>{plan.unknown?"Des durées ou des états d’atelier manquent. Aucune date fiable ne peut être calculée.":!completeCoverage?"Le programme publié ne correspond pas encore à un budget complet. Aucune date de fin de formation n’est annoncée.":plan.remainingMinutes===0?"Aucun travail à planifier actuellement ; vérifie les corrections en attente.":"Renseigne tes jours fixes et ta durée de séance pour calculer une date."}</p>}</div><Link className="adaptive-link" href="/espace/bienvenue">Modifier mes disponibilités <ArrowRight size={16}/></Link></div>
 {plan.slots.length>0&&<div className="adaptive-agenda"><h3>Mes prochaines séances · 7 jours</h3><ol>{plan.slots.map(day=><li key={day.date}><div><strong>{formatDate(day.date)}</strong><span>{formatWorkload(day.minutes)}</span></div>{day.tasks.map(task=><Link key={task.id} href={base+"?atelier="+encodeURIComponent(task.id)}><span>{task.title}</span><b>{formatWorkload(task.minutes)}</b></Link>)}</li>)}</ol></div>}
 <p className="adaptive-note">Estimation éditoriale des ateliers publiés de version initiale, pas du temps réellement passé. Les ateliers validés sont retirés ; les corrections attendues ne sont pas planifiées. Une reprise utilise le budget initial par prudence. Le calcul commence demain, sur les jours fixes uniquement ({plan.optionalDays} jour(s) facultatif(s) non compté(s)). La date ne garantit ni les délais du formateur, ni la validation finale. Un seul parcours est planifié à la fois.</p>
 </section>;
}
