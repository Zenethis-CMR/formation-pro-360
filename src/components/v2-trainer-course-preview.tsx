import { BookOpenCheck, Layers3, LockKeyhole, Sparkles } from "lucide-react";

export type V2CoursePreview={
  title:string;
  status:"draft"|"published"|"archived";
  modules:{id:string;week:number;title:string;outcome:string;lessons:{
    title:string;objective:string;evidence:string;version:number;status:"draft"|"published";
  }[]}[];
};

/** Trainer-only, read-only. Draft content cannot be published from this UI. */
export function V2TrainerCoursePreview({course,unavailable}:{
  course:V2CoursePreview|null;unavailable:boolean;
}) {
  return <section className="v2-trainer-preview panel" aria-labelledby="v2-preview-title">
    <header className="v2-preview-head">
      <div><span className="journey-overline"><Sparkles size={15}/> CHANTIER V2 · INGÉNIERIE PRODUIT & IA</span>
        <h2 id="v2-preview-title">Nouveau cursus en préparation</h2>
        <p>Voici le programme versionné. Le parcours actuel et ses validations restent inchangés jusqu'à une publication contrôlée.</p>
      </div>
      <span className="v2-preview-state"><LockKeyhole size={13}/> Lecture seule</span>
    </header>
    {unavailable
      ? <p role="status" className="v2-preview-empty">Le moteur V2 n'est pas encore prêt sur cet environnement. Vérifier les migrations et les permissions en staging.</p>
      : !course
        ? <p className="v2-preview-empty">Aucun parcours V2 n'a été initialisé sur cet environnement.</p>
        : <>
          <div className="v2-preview-stats">
            <span><Layers3 size={17}/><strong>{course.modules.length}</strong> modules</span>
            <span><BookOpenCheck size={17}/><strong>{course.modules.reduce((n,m)=>n+m.lessons.length,0)}</strong> ateliers</span>
            <span className="v2-preview-draft">{course.status==="draft"?"Brouillon non publié":course.status==="published"?"Parcours publié":"Parcours archivé"}</span>
          </div>
          <div className="v2-preview-grid">{course.modules.map(m=><article key={m.id} className="v2-preview-module">
            <span>SEMAINE {m.week} · {m.lessons.length} ATELIER(S)</span>
            <h3>{m.title}</h3>
            <p>{m.outcome}</p>
            <details className="v2-preview-lessons">
              <summary>Voir les ateliers et les livrables attendus</summary>
              <ol>{m.lessons.map((lesson,i)=><li key={i}>
                <strong>{lesson.title}</strong>
                <small>{lesson.status==="draft"?"Brouillon":"Publié"} · Version {lesson.version}</small>
                <p>{lesson.objective}</p>
                <p><b>Preuve attendue :</b> {lesson.evidence}</p>
              </li>)}</ol>
              {!m.lessons.length&&<p>Aucun atelier renseigné pour cette semaine.</p>}
            </details>
          </article>)}</div>
          <p className="v2-preview-notice">Cet aperçu n'accorde aucun accès, ne crée aucune inscription et n'attribue aucun XP. Seules les corrections réellement validées peuvent faire progresser un apprenant.</p>
        </>}
  </section>;
}
