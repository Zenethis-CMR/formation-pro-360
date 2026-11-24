"use client";
import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Award, BadgeCheck, BookOpen, ClipboardCheck, Code2, GraduationCap, Info, Search, Sparkles, Target, TrendingUp, Trophy } from "lucide-react";
import { LearnerCompactProfile } from "@/components/secure-academy-shell";
import { TechnologyBadge, technologiesForMission, displayDomain } from "@/components/technology-badge";
import {getAiTrainingPlan,trainingHours,estimateLabel,formatWorkload,type StudyRhythm} from "@/lib/ai-training-plans";
import type { V2DashboardPilot } from "@/lib/v2-dashboard-pilot";

export type OverviewMission={
  id:string;title:string;description:string;domain:string;week:number;xp:number;
};
export type OverviewSubmission={
  mission_id:string;status:string;score:number|null;created_at:string;
};
export function SecureLearnerOverview({missions,submissions,approvedIds,dependencies,xp,level,pilot,primaryAction,workspace,rhythm=null}:{
  missions:OverviewMission[];submissions:OverviewSubmission[];approvedIds:string[];dependencies:{mission_id:string;prerequisite_id:string}[];xp:number;level:number;pilot:V2DashboardPilot;primaryAction?:ReactNode;workspace?:ReactNode;rhythm?:StudyRhythm|null;
}){
  const workload=trainingHours(getAiTrainingPlan("ingenierie-produit-ia")!);
  const duration=estimateLabel(workload,rhythm);
  const [query,setQuery]=useState("");
  const approved=new Set(approvedIds);
  const latest=new Map<string,OverviewSubmission>();
  for(const s of submissions) if(!latest.has(s.mission_id))latest.set(s.mission_id,s);
  const inReview=submissions.filter(s=>s.status==="pending").length;
  const percent=missions.length?Math.round(approved.size/missions.length*100):0;
  const remaining=Math.max(0,missions.length-approved.size-inReview);
  const plannedXp=missions.reduce((sum,m)=>sum+m.xp,0);
  const visible=useMemo(()=>missions.filter(m=>(m.title+" "+m.domain+" "+m.description).toLocaleLowerCase("fr")
    .includes(query.toLocaleLowerCase("fr").trim())).slice(0,6),[missions,query]);
  const first=missions.find(m=>!approved.has(m.id)&&latest.get(m.id)?.status!=="pending"&&
    !dependencies.some(d=>d.mission_id===m.id&&!approved.has(d.prerequisite_id)));
  const pending=missions.find(m=>latest.get(m.id)?.status==="pending");
  const next=first||pending||missions[0];
  const enrolled=pilot.enrollment==="active"||pilot.enrollment==="completed";
  const suspended=pilot.enrollment==="paused"||pilot.enrollment==="revoked";
  const pilotHref="/espace/parcours/ingenierie-produit-ia";
  const finished=enrolled&&pilot.approved===16&&pilot.xp>=1600;
  const resumeHref=finished?"/espace/portfolio":
    enrolled&&pilot.resumeSlug?pilotHref+"/atelier/"+pilot.resumeSlug:
    enrolled&&pilot.pending>0?"/espace/apprenant?onglet=progression":pilotHref;
  const actionLabel=finished?"Voir mon portfolio de fin de parcours":
    enrolled&&pilot.pending>0&&!pilot.resumeSlug?"Suivre mes corrections":
    enrolled?"Continuer mes ateliers":
    suspended?"Consulter mon inscription":
    pilot.published&&pilot.enrollmentOpen?"Rejoindre le pilote gratuit":
    pilot.published?"Consulter le programme":"Découvrir le programme";

  return <div className="real-overview learner-dashboard-v5" id="tableau-de-bord">
    <section className="academy-feature academy-feature-v2" aria-label="Formation principale">
      <div className="feature-copy">
        <span className="feature-label"><Sparkles size={14}/> PARCOURS PRINCIPAL · {pilot.published?"FORMATION DISPONIBLE":"APERÇU DU PROGRAMME"}</span>
        <h2>Ingénierie produit<br/><span>et intelligence artificielle.</span></h2>
        <p>Du problème utilisateur au MVP en ligne, puis aux premiers essais commerciaux. Un projet fil rouge et des réalisations évaluées.</p>
        <div className="feature-meta">
          <span className="feature-tech-logos"><TechnologyBadge name="React" compact/><TechnologyBadge name="Next.js" compact/><TechnologyBadge name="PostgreSQL" compact/></span>
          <span>8 modules · 16 ateliers · {formatWorkload(workload*60)}{duration?" · "+duration+" au rythme choisi":""}</span>
        </div>
        <div className="v2-feature-actions">
          <Link href={resumeHref} className="feature-action">{actionLabel} <ArrowRight size={16}/></Link>
          <Link href="/catalogue/ingenierie-produit-ia" className="v2-feature-outline">Voir les objectifs <ArrowRight size={14}/></Link>
        </div>
        <p className="v2-pilot-state" role="status">
          {enrolled?<><BadgeCheck size={14}/> Inscription {pilot.enrollment==="completed"?"terminée":"active"} · {pilot.approved}/16 ateliers validés</>:
            suspended?<><Info size={14}/> Inscription suspendue : contacter le formateur.</>:
            pilot.published&&pilot.enrollmentOpen?<><BadgeCheck size={14}/> Inscription gratuite ouverte pour ton compte.</>:
            pilot.published?<><Info size={14}/> Programme publié : inscription selon éligibilité.</>:
            <><Info size={14}/> Consulte l'aperçu ; vérification du statut indisponible.</>}
        </p>
      </div>
      <div className="feature-art" role="img" aria-label="Espace de travail pour créer et déployer un produit">
        <div className="feature-art-caption"><span className="feature-art-icon"><Code2 size={20}/></span>
          <span><strong>Du prototype au produit</strong><small>Concevoir, coder, tester, vendre</small></span></div>
      </div>
    </section>
    <section className="v2-pilot-metrics" aria-label="Progression du programme">
      <div className="v5-metric v5-verified"><div className="v5-metric-head"><span>ATELIERS VALIDÉS</span><span className="v5-metric-icon"><BadgeCheck size={20}/></span></div><strong>{enrolled?pilot.approved:"—"}<small> / 16</small></strong><p>{enrolled?"Validés par le formateur":"Après inscription"}</p>{enrolled&&<><div className="v5-progress-segments" role="img" aria-label={pilot.approved+" ateliers validés sur 16"}>{Array.from({length:16},(_,i)=><i key={i} className={i<pilot.approved?"filled":""}/>)}</div><small className="v5-progress-caption">{Math.min(100,Math.round(pilot.approved/16*100))}% du parcours</small></>}</div>
      <div className="v5-metric v5-xp"><div className="v5-metric-head"><span>XP DU PARCOURS</span><span className="v5-metric-icon"><Award size={20}/></span></div><strong>{enrolled?pilot.xp:"—"}<small> XP</small></strong><p>{xp} XP des autres réalisations, comptés séparément</p><Link className="v5-metric-link" href="/espace/apprenant/bilan">Consulter mon bilan <ArrowRight size={14}/></Link></div>
      <div className="v5-metric v5-review"><div className="v5-metric-head"><span>EN CORRECTION</span><span className="v5-metric-icon"><ClipboardCheck size={20}/></span></div><strong>{enrolled?pilot.pending:"—"}</strong><p>{enrolled?(pilot.pending>0?"Livrables en attente de ton formateur":"Aucun livrable en attente"):"Suivi après inscription"}</p><Link className="v5-metric-link" href="/espace/parcours/ingenierie-produit-ia">Voir mes ateliers <ArrowRight size={14}/></Link></div>
    </section>
    {finished&&<section className="learner-finish-celebration" aria-label="Fin de parcours validée">
      <Trophy size={27}/><div><span>16 ATELIERS APPROUVÉS PAR LE FORMATEUR</span>
        <h2>Ton parcours de production est terminé.</h2>
        <p>Rassemble tes projets vérifiés et présente tes preuves dans ton portfolio.</p>
      </div><Link href="/espace/portfolio">Présenter mes réalisations <ArrowRight size={16}/></Link>
    </section>}
    <LearnerCompactProfile/>
    {workspace}
    {primaryAction}
    <section className="academy-milestone"><div className="milestone-marker"><Target size={20}/></div>
      <div><span>OBJECTIF · JOUR 14</span><strong>Mettre ton premier scénario utilisateur en ligne.</strong>
        <p>Une mission à la fois. Chaque étape donne lieu à un livrable évalué.</p></div>
      <Link href={pilotHref} aria-label="Ouvrir le parcours"><ArrowRight size={20}/></Link>
    </section>
    {missions.length>0&&<details className="learner-legacy-details">
      <summary><BookOpen size={17}/>
        <span><strong>Mes réalisations complémentaires</strong>
          <small>Tes anciens projets et graphiques sont conservés, mais restent secondaires au parcours principal.</small>
        </span><ArrowRight size={17}/>
      </summary>
      <div className="learner-legacy-details-content">
    <div className="v2-legacy-heading"><div><span>AUTRES RÉALISATIONS · ACQUIS CONSERVÉS</span><h2>Mes projets et missions complémentaires</h2><p>Ces réalisations sont toujours accessibles avec leurs validations et récompenses.</p></div><Link href="/espace/apprenant?onglet=missions">Mes autres projets <ArrowRight size={15}/></Link></div>
    {enrolled&&<p className="dash-note"><strong>XP CUMULÉS : {xp+pilot.xp}</strong> · {xp} XP de tes autres réalisations et {pilot.xp} XP du parcours principal.</p>}
    <section className="academy-metrics" aria-label="Indicateurs des réalisations complémentaires">
      <div className="metric"><div className="metric-icon blue"><GraduationCap size={20}/></div>
        <div><span>Niveau des missions</span><strong>{String(level).padStart(2,"0")}</strong><small>Progression par expérience</small></div></div>
      <div className="metric"><div className="metric-icon purple"><TrendingUp size={20}/></div>
        <div><span>XP des missions</span><strong>{xp}<em> / {plannedXp}</em></strong><small>Gagnés après validation</small></div></div>
      <div className="metric"><div className="metric-icon mint"><BadgeCheck size={20}/></div>
        <div><span>Missions complémentaires validées</span><strong>{approved.size}<em> / {missions.length}</em></strong><small>{inReview} soumission(s) en attente</small></div></div>
    </section>

    <div className="academy-content-grid real-overview-grid">
      <section className="academy-class-section" aria-label="Missions à poursuivre">
        <div className="academy-section-title"><div><h2>Mes autres réalisations</h2>
          <span>{missions.length} missions conservées</span></div>
          <Link href="/espace/apprenant?onglet=missions">Voir tout <ArrowRight size={16}/></Link></div>
        <label className="academy-search"><Search size={18}/>
          <input aria-label="Rechercher une mission" value={query} onChange={e=>setQuery(e.target.value)}
            placeholder="Rechercher une mission, une compétence…"/></label>
        <div className="academy-class-list">
          {visible.length===0&&<p className="academy-empty">Aucune mission trouvée. Essaie une autre recherche.</p>}
          {visible.map((m,index)=>{
            const last=latest.get(m.id);
            const blocked=dependencies.some(d=>d.mission_id===m.id&&!approved.has(d.prerequisite_id));
            const status=approved.has(m.id)?"approved":blocked?"locked":last?.status==="pending"?"in_review":
              last?.status==="changes_requested"?"changes_requested":"available";
            return <Link key={m.id} className={"academy-class-item state-"+status} href={"/espace/atelier/"+m.id}>
              <span className="class-count">{String(index+1).padStart(2,"0")}</span>
              <span className="class-main"><strong>{m.title}</strong>
                <small>Semaine {m.week} · {displayDomain(m.domain)}</small>
                <span className="mission-tech-tags">{technologiesForMission(m).map(tech=><TechnologyBadge name={tech} key={tech}/>)}</span>
              </span>
              <span className={"class-state "+status}>{status==="approved"?"Validée":status==="in_review"?"En correction":status==="changes_requested"?"À corriger":status==="locked"?"À débloquer":"Disponible"}</span>
              <span className="class-go"><ArrowRight size={16}/></span>
              {last?.score!=null&&<span className="sr-only">Note : {last.score} sur 100</span>}
            </Link>;
          })}
        </div>
        <div className="academy-info-note"><Info size={16}/>
          Les missions se débloquent après validation de leurs prérequis par le formateur.</div>
      </section>
      <div className="academy-column-cards">
        <section className="academy-chart-card" id="progression" aria-label="Graphique de progression">
          <div className="academy-card-heading"><div><h2>Progression des missions</h2>
            <p>Évolution de tes missions</p></div><TrendingUp size={18}/></div>
          <div className="academy-donut-wrap">
            <svg className="academy-donut" viewBox="0 0 160 160" role="img"
              aria-label={percent+" pour cent de missions validées"}>
              <circle cx="80" cy="80" r="57" stroke="#eef2f7" strokeWidth="18" fill="none"/>
              <circle cx="80" cy="80" r="57" stroke="#448ff7" strokeWidth="18" fill="none"
                pathLength={100} strokeDasharray={percent+" "+(100-percent)} strokeLinecap="round"
                transform="rotate(-90 80 80)"/>
              <circle cx="80" cy="80" r="57" stroke="#73d5de" strokeWidth="5" fill="none"
                pathLength={100}
                strokeDasharray={Math.min(100,inReview*100/Math.max(1,missions.length))+" "+(100-Math.min(100,inReview*100/Math.max(1,missions.length)))}
                strokeLinecap="round" transform="rotate(90 80 80)"/>
            </svg>
            <div className="donut-value"><strong>{percent}%</strong><span>Complété</span></div>
          </div>
          <div className="academy-chart-legend">
            <span><i className="leg-blue"/>Validées <b>{approved.size}</b></span>
            <span><i className="leg-cyan"/>En attente <b>{inReview}</b></span>
            <span><i className="leg-muted"/>À réaliser <b>{remaining}</b></span>
          </div>
        </section>
        <section className="academy-goal-card"><div className="academy-goal-icon"><Target size={20}/></div>
          <div><strong>Un objectif, un projet.</strong><p>Savoir expliquer ce que tu as construit.</p></div>
          <Link href="/espace/apprenant?onglet=missions" aria-label="Découvrir les missions"><ArrowRight size={19}/></Link>
        </section>
      </div>
    </div>
      </div>
    </details>}
  </div>;
}
