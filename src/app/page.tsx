"use client";
import { useState } from "react";
import { missions } from "@/data/missions";

export default function Home() {
  const [completed, setCompleted] = useState<string[]>([]);
  const xp = missions.filter((mission) => completed.includes(mission.id)).reduce((total, mission) => total + mission.xp, 0);
  const percent = Math.round((completed.length / missions.length) * 100);
  const level = Math.floor(xp / 250) + 1;
  function toggleMission(id: string) {
    setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }
  return <main className="shell">
    <header className="header"><div className="logo">F<span>360</span></div><span className="eyebrow">PARCOURS D’APPRENTISSAGE</span><span className="tag">Prototype V0</span></header>
    <section className="hero"><p className="kicker">TON AVENTURE COMMENCE ICI</p><h1>Apprendre. Construire.<br/><span>Évoluer.</span></h1><p>Des missions pratiques, des compétences réelles et une progression mesurable. Chaque livraison te rapproche de ton prochain niveau.</p></section>
    <section className="stats" aria-label="Statistiques de progression"><div><small>NIVEAU ACTUEL</small><strong>{level.toString().padStart(2, "0")}</strong></div><div><small>EXPÉRIENCE</small><strong>{xp} <em>XP</em></strong></div><div><small>MISSIONS TERMINÉES</small><strong>{completed.length}<em> / {missions.length}</em></strong></div></section>
    <section className="progress-section"><div className="section-head"><h2>Ta progression</h2><strong>{percent}%</strong></div><div className="progress" role="progressbar" aria-label="Progression du parcours" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><div style={{ width: percent + "%" }} /></div><p>Cette version démontre uniquement l’interface : les états ne sont pas encore enregistrés.</p></section>
    <section className="missions"><div className="section-head"><h2>Missions disponibles</h2><span>{missions.length} missions</span></div><div className="mission-grid">{missions.map((mission, index) => <article className="mission" key={mission.id}><div className="mission-top"><span className="number">{String(index + 1).padStart(2,"0")}</span><span className="xp">+{mission.xp} XP</span></div><span className="module">{mission.module}</span><h3>{mission.title}</h3><p>{mission.description}</p><div className="mission-footer"><span>◷ {mission.duration}</span><button type="button" aria-pressed={completed.includes(mission.id)} className={completed.includes(mission.id) ? "done" : ""} onClick={() => toggleMission(mission.id)}>{completed.includes(mission.id) ? "✓ Terminée (simulation)" : "Marquer terminée"}</button></div></article>)}</div></section>
    <footer>Formation Pro 360 · Prototype pédagogique — aucun compte ni soumission réelle pour le moment.</footer>
  </main>;
}
