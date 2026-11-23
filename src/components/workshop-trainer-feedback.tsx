"use client";
import {ArrowRight,CheckCircle2,ClipboardCheck,MessageSquare,Target} from "lucide-react";
import {interpretWorkshopReview,type WorkshopReview} from "@/lib/workshop-feedback";

export function WorkshopTrainerFeedback({review,criteria,onPlan}:{
  review:WorkshopReview;criteria:string[];
  onPlan?:(suggestion:string)=>void
}){
  const {feedbackText,scores,suggestedAction}=interpretWorkshopReview(review,criteria);
  const approved=review.status==="approved";
  return <section id="retour-formateur" className="studio-section studio-trainer-feedback"
    aria-labelledby="studio-trainer-feedback-title">
    <span className="studio-eyebrow"><MessageSquare size={15}/> RETOUR OFFICIEL DU FORMATEUR</span>
    <div className="studio-trainer-feedback-head">
      <div><h2 id="studio-trainer-feedback-title">{approved?"Atelier validé : découvre tes acquis":"À améliorer : ton plan de reprise"}</h2>
        <p>Une correction humaine fondée sur ton livrable, distincte des conseils du coach IA.</p>
      </div>
      {review.score!==null&&<span className="studio-trainer-score">{review.score}<small> /100</small></span>}
    </div>
    <div className={"studio-trainer-verdict "+(approved?"is-passed":"needs-work")}>
      <CheckCircle2 size={18}/>
      <span>{approved?"Validation officielle enregistrée · 100 XP selon les règles du parcours":
        "Une nouvelle version du livrable est nécessaire avant validation · Aucun XP attribué pour cette tentative"}</span>
    </div>
    {feedbackText&&<blockquote className="studio-trainer-message">
      <strong>Commentaire du formateur</strong><p>{feedbackText}</p>
    </blockquote>}
    {scores.length===4&&<div className="studio-trainer-criteria">
      <h3><ClipboardCheck size={16}/> Grille de la correction</h3>
      {scores.map((score,i)=><div className="studio-trainer-criterion" key={i}>
        <div><span>{score.label}</span><strong>{score.points}/25</strong></div>
        <div className="studio-trainer-bar" role="meter" aria-valuemin={0} aria-valuemax={25}
          aria-valuenow={score.points} aria-label={score.label}>
          <span style={{width:(score.points/25*100)+"%"}}/>
        </div>
      </div>)}
      <p>Scores saisis par le formateur et conservés dans sa correction. Ce n'est pas une évaluation automatique.</p>
    </div>}
    {suggestedAction&&<div className="studio-trainer-next">
      <span><Target size={16}/> SUGGESTION DE PROCHAINE ACTION</span>
      <p>{suggestedAction}</p>
      <small>Proposition construite à partir des critères notés. Ce texte n'est pas une nouvelle instruction du formateur.</small>
      {onPlan&&<button type="button" onClick={()=>onPlan(suggestedAction)}>
        Ajouter à ma prochaine action <ArrowRight size={15}/>
      </button>}
    </div>}
  </section>;
}
