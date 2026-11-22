import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, ClipboardCheck, GraduationCap, Info, Search, Sparkles, Target, TrendingUp, Users } from "lucide-react";

export function SecureTrainerOverview({pending,learners,missions,validatedXp}:{
  pending:number;learners:number;missions:number;validatedXp:number
}){
  return <div className="real-overview secure-trainer-overview">
    <header className="academy-head">
      <div><span className="academy-kicker">MON ESPACE DE FORMATION</span>
        <h1>Pilotage de la cohorte<span className="academy-dot">.</span></h1>
        <p>Accompagne les apprenants, évalue les projets et pilote la progression.</p></div>
      <div className="head-actions"><span className="academy-date">Suivi pédagogique · 8 semaines</span>
        <Link href="/espace/formateur?onglet=evaluations" className="head-square-action" aria-label="Voir les évaluations"><Search size={18}/></Link></div>
    </header>
    <section className="academy-feature" aria-label="Pilotage de la formation">
      <div className="feature-copy">
        <span className="feature-label"><Sparkles size={14}/> STUDIO PÉDAGOGIQUE</span>
        <h2>Former par la pratique.<br/><span>Évaluer pour faire progresser.</span></h2>
        <p>Des missions concrètes, une correction transparente et un accompagnement à chaque étape.</p>
        <div className="feature-meta"><span>{missions} missions publiées</span><span> · </span><span>{learners} apprenant(s) inscrit(s)</span></div>
        <Link href={pending?"/espace/formateur?onglet=evaluations":"/espace/formateur?onglet=apprenants"} className="feature-action">
          {pending?"Corriger les projets":"Suivre les apprenants"} <ArrowRight size={16}/>
        </Link>
      </div>
      <div className="feature-art" role="img" aria-label="Poste de travail du formateur">
        <div className="feature-art-caption"><span className="feature-art-icon"><ClipboardCheck size={20}/></span>
          <span><strong>Atelier pédagogique</strong><small>Accompagner, corriger, valider</small></span></div>
      </div>
    </section>
    <section className="academy-metrics" aria-label="Indicateurs réels du formateur">
      <div className="metric"><div className="metric-icon blue"><ClipboardCheck size={20}/></div>
        <div><span>À évaluer</span><strong>{pending}</strong><small>Soumissions en attente</small></div></div>
      <div className="metric"><div className="metric-icon purple"><Users size={20}/></div>
        <div><span>Apprenants inscrits</span><strong>{learners}</strong><small>Comptes dans la base de données</small></div></div>
      <div className="metric"><div className="metric-icon mint"><GraduationCap size={20}/></div>
        <div><span>Missions publiées</span><strong>{missions}</strong><small>Accessibles selon les prérequis</small></div></div>
    </section>
    <section className="academy-milestone">
      <div className="milestone-marker"><Target size={20}/></div>
      <div><span>OBJECTIF DU PROGRAMME</span><strong>Faire progresser chaque apprenant grâce à des projets vérifiables.</strong>
        <p>{validatedXp} XP réellement attribués. Aucune réussite fictive.</p></div>
      <Link href="/espace/formateur?onglet=programme" aria-label="Voir le programme"><ArrowRight size={20}/></Link>
    </section>
    <div className="real-trainer-actions" aria-label="Actions rapides du formateur">
      <Link href="/espace/formateur?onglet=evaluations"><span><ClipboardCheck size={19}/></span><strong>Évaluer les livrables</strong><small>{pending} projet(s) en attente</small><ArrowRight size={17}/></Link>
      <Link href="/espace/formateur?onglet=apprenants"><span><Users size={19}/></span><strong>Suivre les apprenants</strong><small>Progression et accompagnement</small><ArrowRight size={17}/></Link>
      <Link href="/espace/formateur?onglet=programme#creation"><span><CalendarDays size={19}/></span><strong>Créer une mission</strong><small>Programme et ateliers pratiques</small><ArrowRight size={17}/></Link>
    </div>
  </div>;
}
