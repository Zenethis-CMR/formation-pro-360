"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, Code2, GraduationCap, Info, Search, Sparkles, Target, TrendingUp } from "lucide-react";
import { TechnologyBadge, technologiesForMission, displayDomain } from "@/components/technology-badge";
import type { V2DashboardPilot } from "@/lib/v2-dashboard-pilot";

export type OverviewMission={
  id:string;title:string;description:string;domain:string;week:number;xp:number;
};
export type OverviewSubmission={
  mission_id:string;status:string;score:number|null;created_at:string;
};
export function SecureLearnerOverview({missions,submissions,approvedIds,dependencies,xp,level,pilot}:{
  missions:OverviewMission[];submissions:OverviewSubmission[];approvedIds:string[];dependencies:{mission_id:string;prerequisite_id:string}[];xp:number;level:number;pilot:V2DashboardPilot;
}){
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
  const resumeHref=enrolled&&pilot.resumeSlug?pilotHref+"/atelier/"+pilot.resumeSlug:pilotHref;
  const actionLabel=enrolled?"Continuer mes ateliers":
    suspended?"Consulter mon inscription":
    pilot.published&&pilot.enrollmentOpen?"Rejoindre le pilote gratuit":
    pilot.published?"Consulter le programme V2":"Découvrir le programme";

  return <div className="real-overview" id="tableau-de-bord">
    <header className="academy-head">
      <div><span className="academy-kicker">MON ESPACE DE FORMATION</span>
        <h1>Mes classes<span className="academy-dot">.</span></h1>
        <p>Avance à ton rythme, transforme chaque leçon en réalisation.</p></div>
      <div className="head-actions"><span className="academy-date">Cycle pratique · 8 semaines</span>
        <Link href="/espace/apprenant?onglet=missions" className="head-square-action" title="Mes missions" aria-label="Voir les missions"><Search size={18}/></Link>
      </div>
    </header>
    <section className="academy-feature academy-feature-v2" aria-label="Parcours V2 à la une">
      <div className="feature-copy">
        <span className="feature-label"><Sparkles size={14}/> PILOTE V2 · FORMATION ACTIVE</span>
        <h2>Ingénierie produit<br/><span>et intelligence artificielle.</span></h2>
        <p>Du problème utilisateur au MVP en ligne, puis aux premiers essais commerciaux. Un projet fil rouge et des réalisations évaluées.</p>
        <div className="feature-meta">
          <span className="feature-tech-logos"><TechnologyBadge name="React" compact/><TechnologyBadge name="Next.js" compact/><TechnologyBadge name="PostgreSQL" compact/></span>
          <span>8 modules · 16 ateliers · 8 semaines</span>
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
    <section className="v2-pilot-metrics" aria-label="Progression dans le programme V2">
      <div><span>ATELIERS V2 VALIDÉS</span><strong>{enrolled?pilot.approved:"—"}<small> / 16</small></strong><p>{enrolled?"Validés par le formateur":"Après inscription"}</p></div>
      <div><span>XP GAGNÉS EN V2</span><strong>{enrolled?pilot.xp:"—"}</strong><p>Indépendants des XP historiques V1</p></div>
      <div><span>EN CORRECTION</span><strong>{enrolled?pilot.pending:"—"}</strong><p>{enrolled?"Livrables en attente":"Suivi après inscription"}</p></div>
    </section>
    <div className="v2-legacy-heading"><div><span>PARCOURS HISTORIQUE · V1</span><h2>Mes acquis et missions conservés</h2><p>Ces résultats appartiennent à la V1 et restent séparés des XP V2.</p></div><Link href="/espace/apprenant?onglet=missions">Mes missions V1 <ArrowRight size={15}/></Link></div>
    <section className="academy-metrics" aria-label="Indicateurs du programme historique V1">
      <div className="metric"><div className="metric-icon blue"><GraduationCap size={20}/></div>
        <div><span>Niveau historique V1</span><strong>{String(level).padStart(2,"0")}</strong><small>Progression par expérience</small></div></div>
      <div className="metric"><div className="metric-icon purple"><TrendingUp size={20}/></div>
        <div><span>XP historiques V1</span><strong>{xp}<em> / {plannedXp}</em></strong><small>Gagnés après validation</small></div></div>
      <div className="metric"><div className="metric-icon mint"><BadgeCheck size={20}/></div>
        <div><span>Missions V1 validées</span><strong>{approved.size}<em> / {missions.length}</em></strong><small>{inReview} soumission(s) en attente</small></div></div>
    </section>
    <section className="academy-milestone"><div className="milestone-marker"><Target size={20}/></div>
      <div><span>OBJECTIF V2 · JOUR 14</span><strong>Mettre ton premier scénario utilisateur en ligne.</strong>
        <p>Une mission à la fois. Chaque étape donne lieu à un livrable évalué.</p></div>
      <Link href={pilotHref} aria-label="Ouvrir le parcours V2"><ArrowRight size={20}/></Link>
    </section>
    <div className="academy-content-grid real-overview-grid">
      <section className="academy-class-section" aria-label="Missions à poursuivre">
        <div className="academy-section-title"><div><h2>Mes missions historiques V1</h2>
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
          <div className="academy-card-heading"><div><h2>Progression V1</h2>
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
  </div>;
}
