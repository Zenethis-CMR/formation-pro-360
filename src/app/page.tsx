"use client";
import Link from "next/link";
import { Search, ArrowRight, Sparkles, GraduationCap, TrendingUp, BadgeCheck, Code2, Info, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { useDemo } from "@/context/demo-store";
import { latestSubmission, missionState } from "@/lib/mission-engine";
import { TechnologyBadge, technologiesForMission, displayDomain } from "@/components/technology-badge";

export default function Home() {
  const { missions, submissions, xp, level, approvedCount }=useDemo();
  const [query,setQuery]=useState("");
  const percent=missions.length?Math.round(100*approvedCount/missions.length):0;
  const inReview=submissions.filter(s=>s.status==="pending").length;
  const remaining=Math.max(0,missions.length-approvedCount-inReview);
  const visible=useMemo(()=>missions
    .filter(m=>(m.title+" "+m.domain+" "+m.description).toLocaleLowerCase("fr").includes(query.toLocaleLowerCase("fr").trim()))
    .slice(0,5),[missions,query]);
  const plannedXp=missions.reduce((sum,m)=>sum+m.xp,0);
  return <main className="academy-dashboard">
    <header className="academy-head">
      <div><span className="academy-kicker">MON ESPACE DE FORMATION</span><h1>Mes classes<span className="academy-dot">.</span></h1>
        <p>Avance à ton rythme, transforme chaque leçon en réalisation.</p>
      </div>
      <div className="head-actions"><span className="academy-date">Cycle pratique · 8 semaines</span>
        <Link href="/apprenant" className="head-square-action" title="Voir les missions" aria-label="Voir les missions"><Search size={18} strokeWidth={2} aria-hidden="true"/></Link>
      </div>
    </header>
    <section className="academy-feature" aria-label="Formation à la une">
      <div className="feature-copy"><span className="feature-label"><Sparkles size={14} strokeWidth={2}/> PARCOURS À LA UNE</span>
        <h2>Développement web<br/><span>du premier code au produit.</span></h2>
        <p>HTML, CSS, JavaScript, design et projets concrets.</p>
        <div className="feature-meta"><span className="feature-tech-logos"><TechnologyBadge name="HTML5" compact/><TechnologyBadge name="CSS3" compact/><TechnologyBadge name="JavaScript" compact/></span><span>{missions.length} missions · Premier projet en 2 semaines</span></div>
        <Link href="/apprenant" className="feature-action">Continuer mon parcours <ArrowRight size={16} strokeWidth={2} aria-hidden="true"/></Link>
      </div>
      <div className="feature-art" aria-label="Photo libre de droits d'un poste de programmation, Unsplash" role="img">
        <div className="feature-art-caption"><span className="feature-art-icon"><Code2 size={20} strokeWidth={2}/></span><span><strong>Atelier de développement</strong><small>Concevoir, coder et livrer</small></span></div>
      </div>
    </section>
    <section className="academy-metrics" aria-label="Tes indicateurs">
      <div className="metric"><div className="metric-icon blue"><GraduationCap size={20} strokeWidth={2.1}/></div><div><span>Niveau actuel</span><strong>{String(level).padStart(2,"0")}</strong><small>Apprentissage continu</small></div></div>
      <div className="metric"><div className="metric-icon purple"><TrendingUp size={20} strokeWidth={2.1}/></div><div><span>XP obtenus</span><strong>{xp}<em> / {plannedXp}</em></strong><small>Gagnés après validation</small></div></div>
      <div className="metric"><div className="metric-icon mint"><BadgeCheck size={20} strokeWidth={2.1}/></div><div><span>Missions validées</span><strong>{approvedCount}<em> / {missions.length}</em></strong><small>{inReview} soumission(s) en attente</small></div></div>
    </section>
    <section className="academy-milestone"><div className="milestone-marker"><Target size={20} strokeWidth={2}/></div><div><span>OBJECTIF DES 2 PREMIÈRES SEMAINES</span><strong>Publier une mini-application qui fonctionne vraiment.</strong><p>Une mission à la fois. Chaque étape donne lieu à un livrable évalué.</p></div><Link href="/apprenant" aria-label="Voir le parcours des deux premières semaines"><ArrowRight size={20}/></Link></section>
    <div className="academy-content-grid">
      <section className="academy-class-section">
        <div className="academy-section-title"><div><h2>Continuer mes classes</h2><span>{missions.length} modules disponibles</span></div><Link href="/apprenant">Voir tout <ArrowRight size={16} strokeWidth={2} aria-hidden="true"/></Link></div>
        <label className="academy-search"><Search size={18} strokeWidth={2} aria-hidden="true"/><input aria-label="Rechercher une mission" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher une mission, une compétence…"/></label>
        <div className="academy-class-list">
          {visible.length===0 && <p className="academy-empty">Aucune mission trouvée. Essaie un autre mot-clé.</p>}
          {visible.map((m,i)=>{
            const state=missionState(m,submissions);
            const sub=latestSubmission(m.id,submissions);
            return <Link className={"academy-class-item state-"+state} key={m.id} href="/apprenant">
              <span className="class-count">{String(i+1).padStart(2,"0")}</span>
              <span className="class-main"><strong>{m.title}</strong><small>Semaine {m.week} · {displayDomain(m.domain)}</small><span className="mission-tech-tags">{technologiesForMission(m).map(tech=><TechnologyBadge name={tech} key={tech}/>)}</span></span>
              <span className={"class-state "+state}>{state==="approved"?"Validée":state==="in_review"?"En correction":state==="locked"?"À débloquer":state==="changes_requested"?"À corriger":"Disponible"}</span>
              <span className="class-go"><ArrowRight size={16} strokeWidth={2} aria-hidden="true"/></span>
              {sub?.score!=null && <span className="sr-only">Note : {sub.score} sur 100</span>}
            </Link>;
          })}
        </div>
        <div className="academy-info-note"><Info size={16} strokeWidth={2}/> Les missions se débloquent après validation du livrable précédent par le formateur.</div>
      </section>
      <div className="academy-column-cards">
        <section className="academy-chart-card">
          <div className="academy-card-heading"><div><h2>Progression</h2><p>Évolution de tes missions</p></div><TrendingUp size={18}/></div>
          <div className="academy-donut-wrap"><svg className="academy-donut" viewBox="0 0 160 160" role="img" aria-label={percent+" pour cent de missions validées"}>
            <circle cx="80" cy="80" r="57" stroke="#eef2f7" strokeWidth="18" fill="none"/>
            <circle cx="80" cy="80" r="57" stroke="#448ff7" strokeWidth="18" fill="none" pathLength={100} strokeDasharray={percent+" "+(100-percent)} strokeLinecap="round" transform="rotate(-90 80 80)"/>
            <circle cx="80" cy="80" r="57" stroke="#73d5de" strokeWidth="5" fill="none" pathLength={100} strokeDasharray={Math.min(100,inReview*100/Math.max(1,missions.length))+" "+(100-Math.min(100,inReview*100/Math.max(1,missions.length)))} strokeLinecap="round" transform="rotate(90 80 80)"/>
          </svg><div className="donut-value"><strong>{percent}%</strong><span>Complété</span></div></div>
          <div className="academy-chart-legend"><span><i className="leg-blue"/>Validées <b>{approvedCount}</b></span><span><i className="leg-cyan"/>En attente <b>{inReview}</b></span><span><i className="leg-muted"/>À réaliser <b>{remaining}</b></span></div>
        </section>
        <section className="academy-goal-card"><div className="academy-goal-icon"><Target size={20} strokeWidth={2}/></div><div><strong>Un objectif, un projet.</strong><p>Le plus important : savoir expliquer ce que tu as construit.</p></div><Link href="/apprenant" aria-label="Découvrir les missions"><ArrowRight size={19} strokeWidth={2} aria-hidden="true"/></Link></section>
      </div>
    </div>
  </main>;
}
