const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");

test("V2 progression is session-scoped and separate from learner V1 achievements",()=>{
  const page=read("src/app/espace/apprenant/page.tsx");
  const helper=read("src/lib/v2-learner-progress.ts");
  const panel=read("src/components/v2-learner-progress-panel.tsx");
  assert.match(page,/tab==="progression"\?await loadV2LearnerProgress\(\):null/);
  assert.ok(page.indexOf("<V2LearnerProgressPanel")<page.indexOf("<LearnerCoachingPanel"));
  assert.match(page,/MES AUTRES ACQUIS/);
  assert.match(helper,/backendRequest\("\/v1\/training\/catalog\/ingenierie-produit-ia"\)/);
  assert.match(helper,/lesson_access==="granted"/);
  assert.match(helper,/return empty/);
  assert.match(panel,/status==="approved"/);
  assert.match(panel,/XP CUMULÉS/);
  assert.match(panel,/progress.xpTotal\+otherXp/);
  assert.match(panel,/latest\.has\(key\)/);
  assert.match(panel,/Rejoindre la formation/);
  assert.doesNotMatch(panel,/xp_ledger|from\("submissions"\)/);
});

test("V2 trainer evaluation overview is read-only and outside V1 history",()=>{
  const page=read("src/app/espace/formateur/page.tsx");
  const component=read("src/components/v2-trainer-evaluation-overview.tsx");
  assert.match(page,/<V2TrainerEvaluationOverview\/>/);
  assert.match(page,/AUTRES RÉALISATIONS · HISTORIQUE/);
  assert.ok(page.indexOf("<V2TrainerEvaluationOverview/>")<page.indexOf('id="evaluations"'));
  assert.match(component,/evaluation-overview/);
  assert.match(component,/source-backed|read-only|read.only/i);
  assert.match(component,/Corriger les ateliers/);
  assert.match(component,/Indicateurs du parcours indisponibles/);
  assert.doesNotMatch(component,/xp_ledger|db\.from\(/);
});
