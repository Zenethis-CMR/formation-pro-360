import Link from "next/link";
import { ArrowRight, CalendarDays, ClipboardCheck, GraduationCap, Target, Users } from "lucide-react";

export function SecureTrainerOverview({pending,learners,missions,validatedXp}:{
  pending:number;learners:number;missions:number;validatedXp:number
}){
  return <div className="real-overview secure-trainer-overview">
    <section className="academy-metrics" aria-label="Indicateurs réels du formateur">
      <div className="metric"><div className="metric-icon blue"><ClipboardCheck size={20}/></div>
        <div><span>Autres projets à évaluer</span><strong>{pending}</strong><small>Missions complémentaires en attente</small></div></div>
      <div className="metric"><div className="metric-icon purple"><Users size={20}/></div>
        <div><span>Comptes apprenants</span><strong>{learners}</strong><small>Comptes dans la base de données</small></div></div>
      <div className="metric"><div className="metric-icon mint"><GraduationCap size={20}/></div>
        <div><span>Missions complémentaires</span><strong>{missions}</strong><small>Accessibles selon les prérequis</small></div></div>
    </section>
    <section className="academy-milestone">
      <div className="milestone-marker"><Target size={20}/></div>
      <div><span>AUTRES RÉALISATIONS · ACQUIS CONSERVÉS</span><strong>Faire progresser chaque apprenant grâce à des projets vérifiables.</strong>
        <p>{validatedXp} XP conservés pour les missions complémentaires.</p></div>
      <Link href="/espace/formateur?onglet=programme" aria-label="Voir le programme"><ArrowRight size={20}/></Link>
    </section>
    <div className="real-trainer-actions" aria-label="Actions rapides du formateur">
      <Link href="/espace/formateur?onglet=evaluations"><span><ClipboardCheck size={19}/></span><strong>Évaluer les livrables</strong><small>{pending} projet(s) en attente</small><ArrowRight size={17}/></Link>
      <Link href="/espace/formateur?onglet=apprenants"><span><Users size={19}/></span><strong>Suivre les apprenants</strong><small>Progression et accompagnement</small><ArrowRight size={17}/></Link>
      <Link href="/espace/formateur?onglet=programme#creation"><span><CalendarDays size={19}/></span><strong>Créer une mission</strong><small>Programme et ateliers pratiques</small><ArrowRight size={17}/></Link>
    </div>
  </div>;
}
