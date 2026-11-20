"use client";
import Link from "next/link";
import { useDemo } from "@/context/demo-store";
import { missionState, stateLabels } from "@/lib/mission-engine";

export default function Home() {
  const { missions, submissions, xp, level, approvedCount } = useDemo();
  const progress = missions.length ? Math.round(approvedCount / missions.length * 100) : 0;
  return <main className="page home">
    <section className="home-hero">
      <div className="hero-copy">
        <span className="eyebrow"><span className="online-dot"/> L’ACADÉMIE DE LA PRATIQUE</span>
        <h1>Maîtrise tes<br/><span>compétences.</span><br/>Crée ton avenir.</h1>
        <p>Un parcours d’apprentissage intensif, des missions concrètes et une progression qui se mérite. Du premier code à ton premier produit numérique.</p>
        <div className="hero-buttons">
          <Link href="/apprenant" className="primary-btn">Commencer les missions <span aria-hidden="true">↗</span></Link>
          <Link href="/formateur" className="secondary-btn">Espace formateur</Link>
        </div>
        <div className="hero-sub"><span>✦</span> Une mission. Un livrable. Une compétence validée.</div>
      </div>
      <div className="hero-display" aria-label="Aperçu de progression">
        <div className="display-top"><span>PROFIL APPRENANT</span><span className="status-pill">EN PROGRESSION</span></div>
        <div className="display-badge">✦</div>
        <h2>Explorateur <span>digital</span></h2><p>Parcours : Créateur de produits numériques</p>
        <div className="display-stats"><div><small>NIVEAU</small><strong>{level.toString().padStart(2,"0")}</strong></div><div><small>EXPÉRIENCE</small><strong>{xp} <span>XP</span></strong></div><div><small>MISSIONS</small><strong>{approvedCount}<span>/{missions.length}</span></strong></div></div>
        <div className="display-progress"><span>Évolution du parcours</span><span>{progress}%</span></div>
        <div className="progress-track"><div style={{width:progress+"%"}}/></div>
      </div>
    </section>
    <section className="value-strip">
      <div><span className="strip-icon">01</span><div><strong>Apprendre</strong><p>Acquérir les fondamentaux</p></div></div>
      <div><span className="strip-icon">02</span><div><strong>Construire</strong><p>Livrer de vrais projets</p></div></div>
      <div><span className="strip-icon">03</span><div><strong>Être évalué</strong><p>Prouver ses compétences</p></div></div>
    </section>
    <section className="home-section">
      <div className="section-head"><div><span className="eyebrow">PARCOURS STRUCTURÉ</span><h2>Ton prochain défi</h2></div><Link className="inline-link" href="/apprenant">Voir toutes les missions ↗</Link></div>
      <div className="preview-grid">{missions.slice(0,3).map((m) => <div className="preview-card" key={m.id}>
        <div className="mission-head"><span className="week">SEMAINE {m.week}</span><span className={"status "+missionState(m,submissions)}>{stateLabels[missionState(m,submissions)]}</span></div>
        <div className="mission-type">{m.domain}</div><h3>{m.title}</h3><p>{m.description}</p>
        <div className="mission-meta"><span>◷ {m.duration}</span><span className="xp">+{m.xp} XP</span></div>
      </div>)}</div>
    </section>
  </main>;
}
