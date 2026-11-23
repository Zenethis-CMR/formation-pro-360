const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const ts=require("typescript"),vm=require("node:vm");
const code=read("src/lib/workshop-feedback.ts");
const js=ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.CommonJS,
  target:ts.ScriptTarget.ES2022}}).outputText;
const ex={};vm.runInNewContext(js,{exports:ex},{filename:"workshop-feedback.ts"});

test("four-point rubric is rendered only when its points match the real trainer's grade",()=>{
 const review={
  status:"changes_requested",score:68,reviewed_at:"2026-11-23T14:00:00Z",
  feedback:"Le prototype manque d'états d'erreur.\n\nGrille formative : C1 20/25 · C2 12/25 · C3 17/25 · C4 19/25 · Total 68/100"
 };
 const labels=["Problème clair","Tests d'erreur","Preuves réelles","Qualité de l'explication"];
 const result=ex.interpretWorkshopReview(review,labels);
 assert.equal(result.scores.length,4);
 assert.equal(result.scores[1].label,"Tests d'erreur");
 assert.equal(result.scores[1].points,12);
 assert.equal(result.feedbackText,"Le prototype manque d'états d'erreur.");
 assert.match(result.suggestedAction,/Tests d'erreur/);
 const invalid=ex.interpretWorkshopReview({...review,score:75},labels);
 assert.equal(invalid.scores.length,0);
 assert.match(invalid.feedbackText,/Grille formative/);
});
test("a passed review doesn't invent remedial work and an old narrative stays readable",()=>{
 const approved=ex.interpretWorkshopReview({
  status:"approved",score:90,feedback:"Très bon travail",reviewed_at:null
 },[]);
 assert.equal(approved.suggestedAction,null);
 assert.equal(approved.scores.length,0);
 const old=ex.interpretWorkshopReview({
  status:"changes_requested",score:62,feedback:"Corriger les liens du prototype",reviewed_at:null
 },[]);
 assert.match(old.suggestedAction,/Relire le retour/);
 assert.equal(old.feedbackText,"Corriger les liens du prototype");
});
test("the studio only presents the signed-in learner's returned correction and never automatically saves it",()=>{
 const studio=read("src/app/espace/parcours/ingenierie-produit-ia/atelier/[slug]/page.tsx");
 const notebook=read("src/components/workshop-notebook.tsx");
 const panel=read("src/components/workshop-trainer-feedback.tsx");
 assert.match(studio,/history.find\(s=>s.status!=="pending"/);
 assert.match(studio,/review=\{review\}/);
 assert.match(notebook,/setNextAction/);
 assert.match(notebook,/planFromCorrection/);
 assert.match(notebook,/action=\{saveWorkshopNotebook\}/);
 assert.match(panel,/Retour officiel du formateur|RETOUR OFFICIEL DU FORMATEUR/);
 assert.match(panel,/onPlan\(suggestedAction\)/);
 assert.doesNotMatch(panel,/xp_ledger|v2_lesson_xp|fetch\(/);
});
test("the coach receives trainer feedback only after the learner explicitly selects it",()=>{
 const coach=read("src/components/workshop-coach.tsx");
 assert.match(coach,/trainerFeedback&&<button/);
 assert.match(coach,/onClick=\{\(\)=>\{/);
 assert.match(coach,/setWorkSummary\(plain.slice\(0,400\)\)/);
 assert.match(coach,/setMode\("verifier"\)/);
 assert.match(coach,/Demander un conseil/);
});
test("revisions and pending deposits are prioritized from verified submission statuses",()=>{
 const panel=read("src/components/v2-learner-progress-panel.tsx");
 assert.match(panel,/status==="changes_requested"/);
 assert.match(panel,/status==="pending"/);
 assert.match(panel,/Mes prochaines priorités/);
 assert.match(panel,/#retour-formateur/);
 assert.match(panel,/#livrable/);
 assert.doesNotMatch(panel,/xp_ledger|update\(/);
});
