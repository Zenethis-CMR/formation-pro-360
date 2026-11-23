const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("V2 learner submissions depend on backend granted enrollment and evaluation_open",()=>{
  const page=read("src/app/espace/parcours/ingenierie-produit-ia/page.tsx");
  assert.match(page,/data\?\.lesson_access==="granted"/);
  assert.match(page,/data\?\.evaluation_open/);
  assert.match(page,/latest\.status==="changes_requested"/);
  assert.match(page,/latest\?\.status==="approved"/);
  assert.match(page,/action=\{submitV2Lesson\}/);
  assert.match(page,/xp_total/);
});
test("trainer correction UI is authenticated and never awards XP directly",()=>{
  const page=read("src/app/espace/formateur/corrections-v2/page.tsx");
  const actions=read("src/app/espace/actions.ts");
  const shell=read("src/components/secure-academy-shell.tsx");
  assert.match(page,/requireRole\("trainer"\)/);
  assert.match(page,/action=\{reviewV2Lesson\}/);
  assert.match(page,/V2TrainerScoreInputs/);
  assert.match(page,/item.evidence_required/);
  assert.match(page,/pending-submissions/);
  assert.match(shell,/label:"Corriger les ateliers"/);
  assert.match(actions,/export async function reviewV2Lesson/);
  assert.match(actions,/export async function submitV2Lesson/);
  const newActions=actions.slice(actions.indexOf("export async function submitV2Lesson"));
  assert.doesNotMatch(newActions,/xp_ledger|v2_lesson_xp|db\.from\(/);
});
