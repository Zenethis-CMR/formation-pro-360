"use client";
import { useState, type FormEvent } from "react";
import { useDemo } from "@/context/demo-store";
import { latestSubmission, missionState, reviewCriteria } from "@/lib/mission-engine";

export default function Formateur() {
  const { missions, submissions, review, addMission, reset, approvedCount } = useDemo();
  const [scores, setScores] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("Développement web");
  const [description, setDescription] = useState("");
  const [week, setWeek] = useState("1");
  const [xp, setXp] = useState("100");
  const pending = submissions.filter((item) => item.status === "pending");
  const evaluated = submissions.filter((item) => item.status !== "pending");
  const totalXp = missions.reduce((sum, mission) => sum + mission.xp, 0);
  function onReview(id: string) {
    const score = Number(scores[id]);
    const note = feedback[id] ?? "";
    if (!review(id, score, note)) { setError("Saisis une note entière entre 0 et 100 et un commentaire d’au moins 3 caractères.");return; }
    setNotice(score >= 80 ? "Mission validée, XP attribués." : "Mission renvoyée pour correction.");
    setError("");
  }
  function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const w = Number(week), points = Number(xp);
    if (!title.trim() || !description.trim() || !Number.isInteger(w) || w < 1 || w > 52 || !Number.isInteger(points) || points < 10 || points > 1000) {
      setError("Vérifie les champs et leurs valeurs."); return;
    }
    addMission({ title:title.trim(), domain, description:description.trim(), week:w, xp:points,
      difficulty:"Débutant", objectives:["Livrer une réalisation fonctionnelle"], deliverable:"Lien vers le projet", duration:"À définir", prerequisites:[] });
    setTitle("");setDescription("");setNotice("Mission ajoutée au catalogue local de démonstration.");setError("");
  }
  return <main className="page">
    <section className="page-hero"><div><span className="eyebrow">ESPACE FORMATEUR / PILOTAGE</span><h1>Exiger. Évaluer. <span>Faire progresser.</span></h1><p>Corrige les livrables, débloque les missions et accompagne la montée en compétences.</p></div><div className="hero-icon" aria-hidden="true">◎</div></section>
    <section className="stats-grid">
      <div className="stat-card"><span>À ÉVALUER</span><strong>{pending.length}</strong><small>Soumissions en attente</small></div>
      <div className="stat-card"><span>VALIDÉES</span><strong>{approvedCount}<em> / {missions.length}</em></strong><small>Missions du parcours</small></div>
      <div className="stat-card"><span>XP AU PROGRAMME</span><strong>{totalXp}</strong><small>Récompenses possibles</small></div>
    </section>
    {notice && <div className="alert success" role="status">{notice}</div>}
    {error && <div className="alert danger" role="alert">{error}</div>}
    <section className="panel"><div className="section-head"><div><span className="eyebrow">CORRECTION</span><h2>Soumissions à examiner</h2></div><span className="counter">{pending.length} en attente</span></div>
      {pending.length === 0 ? <div className="empty-state"><span>✧</span><h3>Aucune soumission en attente</h3><p>Ouvre l’espace apprenant et soumets la mission M01 pour tester le circuit complet.</p></div> :
        <div className="review-list">{pending.map((submission) => {
          const mission = missions.find((item) => item.id === submission.missionId);
          return <div className="review-card" key={submission.id}>
            <div><span className="week">{mission?.id} · {mission?.domain}</span><h3>{mission?.title ?? "Mission inconnue"}</h3>
              <p className="muted">{submission.note || "Aucune note jointe"}</p>
              <a className="external-link" href={submission.url} target="_blank" rel="noopener noreferrer">Ouvrir le livrable ↗</a></div>
            <div className="review-controls"><label>Note /100<input type="number" min={0} max={100} step={1} placeholder="80" value={scores[submission.id] ?? ""} onChange={(e) => setScores((prev) => ({...prev,[submission.id]:e.target.value}))}/></label>
              <label>Retour pédagogique<textarea rows={3} placeholder="Ce qui fonctionne et ce qu’il faut améliorer…" value={feedback[submission.id] ?? ""} onChange={(e) => setFeedback((prev) => ({...prev,[submission.id]:e.target.value}))}/></label>
              <button className="primary-btn" onClick={() => onReview(submission.id)}>Valider l’évaluation</button>
              <small>80/100 ou plus = mission validée · sinon correction demandée</small>
            </div>
          </div>;
        })}</div>}
    </section>
    <div className="two-cols">
      <section className="panel"><span className="eyebrow">GRILLE PÉDAGOGIQUE</span><h2>Évaluation sur 100</h2>
        <div className="rubric">{reviewCriteria.map((criterion) => <div key={criterion.label}><span>{criterion.label}</span><b>{criterion.points} pts</b></div>)}</div>
        <p className="muted">Cette grille guide la correction. La saisie détaillée de chaque critère viendra avec les comptes sécurisés.</p>
      </section>
      <section className="panel"><span className="eyebrow">CATALOGUE</span><h2>Créer une mission</h2><form className="form" onSubmit={create}>
        <label>Titre<input required maxLength={110} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. Construire une API"/></label>
        <label>Domaine<select value={domain} onChange={(e) => setDomain(e.target.value)}><option>Développement web</option><option>Design & UX</option><option>IA & automatisation</option><option>Multimédia</option><option>Produit & business</option></select></label>
        <label>Description<textarea rows={2} required maxLength={600} value={description} onChange={(e) => setDescription(e.target.value)}/></label>
        <div className="field-row"><label>Semaine<input type="number" min="1" max="52" value={week} onChange={(e) => setWeek(e.target.value)}/></label><label>Récompense XP<input type="number" min="10" max="1000" value={xp} onChange={(e) => setXp(e.target.value)}/></label></div>
        <button className="primary-btn" type="submit">Ajouter la mission</button>
      </form></section>
    </div>
    <section className="panel"><div className="section-head"><h2>Historique de correction</h2><span className="counter">{evaluated.length} évaluation(s)</span></div>
      {evaluated.length === 0 ? <p className="muted">Aucune évaluation pour l’instant.</p> :
        <div className="history">{evaluated.slice().reverse().map((s) => <div key={s.id}><span>{missions.find((m) => m.id === s.missionId)?.title ?? s.missionId}</span><span>{s.score}/100 · {s.status === "approved" ? "Validée" : "Correction demandée"}</span></div>)}</div>}
      <div className="bottom-actions"><button className="text-btn" type="button" onClick={() => {if(window.confirm("Réinitialiser toute la démonstration de ce navigateur ?")){reset();setNotice("Démonstration réinitialisée.");}}}>Réinitialiser les données de démo</button></div>
    </section>
    <p className="muted small-note">Espace de simulation : aucune authentification ni autorisation de rôle réelle. Ne pas utiliser pour des évaluations personnelles.</p>
  </main>;
}
