/** Safe read-only interpretation of a correction already validated by a trainer. */
export type WorkshopReview={
  status:"approved"|"changes_requested";
  score:number|null;
  feedback:string|null;
  reviewed_at:string|null;
};
export type CriterionResult={label:string;points:number;max:number};
const rubricSuffix=/\n\nGrille formative : C1 (\d{1,2})\/25 · C2 (\d{1,2})\/25 · C3 (\d{1,2})\/25 · C4 (\d{1,2})\/25 · Total (\d{1,3})\/100$/;

/**
 * Only the trainer has authority to assign a grade. Never infer a score from
 * checklist ticks or ask the AI to grade the learner. The rubric here is
 * strictly parsed from the actual trainer review, not recomputed from AI.
 */
export function interpretWorkshopReview(review:WorkshopReview,criteria:string[]){
  const raw=review.feedback||"";
  const match=raw.match(rubricSuffix);
  let scores:CriterionResult[]=[];
  let feedbackText=raw;
  if(match){
    const points=match.slice(1,5).map(Number);
    const total=Number(match[5]);
    if(points.every(n=>Number.isInteger(n)&&n>=0&&n<=25)&&
      total===points.reduce((sum,n)=>sum+n,0)&&total===review.score){
      scores=points.map((n,i)=>({
        label:criteria[i]?.trim()||"Critère "+(i+1),points:n,max:25
      }));
      feedbackText=raw.slice(0,match.index).trim();
    }
  }
  const lowest=scores.length?
    scores.reduce((current,item)=>item.points<current.points?item:current,scores[0]):null;
  const suggestedAction=review.status==="changes_requested"?
    lowest?
      "Reprendre « "+lowest.label.slice(0,125)+" » : corriger le point signalé, tester le résultat et préparer une preuve vérifiable.":
      "Relire le retour du formateur, corriger les écarts signalés, puis vérifier une preuve concrète avant de soumettre de nouveau.":
    null;
  return {feedbackText,scores,suggestedAction};
}
