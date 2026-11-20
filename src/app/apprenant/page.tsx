"use client";
import { useMemo, useState, type FormEvent } from "react";
import { useDemo } from "@/context/demo-store";
import { latestSubmission, missionState, stateLabels } from "@/lib/mission-engine";

export default function Apprenant() {
  const { missions, submissions, xp, level, approvedCount, submit, ready } = useDemo();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const selected = missions.find((mission) => mission.id === selectedId);
  const sorted = useMemo(() => [...missions].sort((a,b) => a.week-b.week), [missions]);
  function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    if (!submit(selected.id, url, note)) { setError("Ajoute un lien HTTP(S) valide vers ton livrable."); return; }
    setSuccess("Mission envoyée pour évaluation dans cette démonstration.");
    setError(""); setSelectedId(null); setUrl(""); setNote("");
  }
  return <main className="page">
    <section className="page-hero"><div><span className="eyebrow">ESPACE APPRENANT / PARCOURS ACTIF</span><h1>Ton parcours, <span>tes victoires.</span></h1><p>Valide les missions une par une. Chaque livrable est évalué avant le déblocage du niveau suivant.</p></div><div className="hero-icon" aria-hidden="true">✦</div></section>
    <section className="stats-grid" aria-label="Progression">
      <div className="stat-card"><span>TON NIVEAU</span><strong>{level.toString().padStart(2,"0")}</strong><small>Progression par expérience</small></div>
      <div className="stat-card"><span>EXPÉRIENCE GAGNÉE</span><strong>{xp} <em>XP</em></strong><small>Uniquement après validation</small></div>
      <div className="stat-card"><span>MISSIONS VALIDÉES</span><strong>{approvedCount}<em> / {missions.length}</em></strong><small>Seuil de réussite : 80/100</small></div>
    </section>
    <section id="progression" className="panel progress-panel"><div className="section-head"><h2>Progression des missions</h2><strong>{missions.length ? Math.round(approvedCount / missions.length * 100) : 0}%</strong></div><div className="progress-track" role="progressbar" aria-label="Missions validées" aria-valuenow={approvedCount} aria-valuemin={0} aria-valuemax={missions.length}><div style={{width:(missions.length ? approvedCount / missions.length * 100 : 0)+"%"}}/></div><p>Les missions verrouillées s’ouvrent après validation de leurs prérequis.</p></section>
    {success && <div className="alert success" role="status">{success}</div>}
    <section id="missions"><div className="section-head"><div><span className="eyebrow">LE CHEMIN DE L’EXPERTISE</span><h2>Missions à accomplir</h2></div><span className="counter">{missions.length} missions</span></div>
      <div className="mission-grid">{sorted.map((mission) => {
        const status = missionState(mission, submissions);
        const last = latestSubmission(mission.id, submissions);
        return <article className="mission-card" key={mission.id}>
          <div className="mission-head"><span className="week">SEMAINE {mission.week}</span><span className={"status "+status}>{stateLabels[status]}</span></div>
          <div className="mission-type">{mission.domain}</div><h3>{mission.title}</h3><p>{mission.description}</p>
          <ul className="objective-list">{mission.objectives.map((item) => <li key={item}>✓ {item}</li>)}</ul>
          <div className="mission-meta"><span>◷ {mission.duration}</span><span className="xp">+{mission.xp} XP</span></div>
          {status === "locked" && <div className="helper">Prérequis : {mission.prerequisites.join(", ")}</div>}
          {status === "in_review" && <div className="helper">Livrable soumis · En attente de correction</div>}
          {status === "approved" && <div className="helper positive">Mission approuvée · {last?.score ?? 0}/100</div>}
          {status === "changes_requested" && <div className="helper danger">Correction demandée : {last?.feedback}</div>}
          {(status === "available" || status === "changes_requested") && <button className="primary-btn" type="button" onClick={() => {setSelectedId(mission.id);setError("");setSuccess("");}}>{status === "changes_requested" ? "Soumettre une correction" : "Soumettre mon travail"}</button>}
        </article>;
      })}</div>
    </section>
    {selected && <div className="overlay" role="presentation" onMouseDown={(e) => { if(e.target===e.currentTarget) setSelectedId(null); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-label="Soumettre une mission">
        <div className="section-head"><h2>Soumettre ton livrable</h2><button type="button" className="text-btn" onClick={() => setSelectedId(null)}>Fermer ✕</button></div>
        <p><b>{selected.title}</b></p><p className="muted">Attendu : {selected.deliverable}</p>
        <form onSubmit={send} className="form">
          <label>Lien du projet<input required type="url" maxLength={800} placeholder="https://github.com/…" value={url} onChange={(e) => setUrl(e.target.value)}/></label>
          <label>Présentation du travail<textarea maxLength={1200} rows={4} placeholder="Ce que tu as fait, les difficultés rencontrées…" value={note} onChange={(e) => setNote(e.target.value)}/></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-btn" disabled={!ready} type="submit">Envoyer pour évaluation</button>
        </form>
      </section>
    </div>}
  </main>;
}
