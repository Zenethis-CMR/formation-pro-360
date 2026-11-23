const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");

test("learner optional data is queried only for its active tab",()=>{
  const page=read("src/app/espace/apprenant/page.tsx");
  assert.match(page,/tab==="progression" \? db\.from\("badges"\)/);
  assert.match(page,/tab==="progression" \? db\.from\("coach_messages"\)/);
  assert.match(page,/tab==="dashboard" \? db\.from\("learner_preferences"\)/);
  assert.match(page,/tab==="progression"\|\|tab==="programme" \? db\.from\("training_settings"\)/);
  assert.match(page,/tab==="programme" \? skipped : db\.from\("submissions"\)/);
});

test("trainer history is filtered, paginated in SQL, and navigable",()=>{
  const page=read("src/app/espace/formateur/page.tsx");
  assert.match(page,/\.neq\("status","pending"\)/);
  assert.match(page,/\.range\(\(historyPage-1\)\*historySize,historyPage\*historySize-1\)/);
  assert.match(page,/historyTotal>historySize/);
  assert.match(page,/page="\+\(historyPage\+1\)/);
  assert.match(page,/tab==="apprenants" \? db\.from\("practice_checkins"\)/);
});

test("trainer dashboard uses counts without loading unrelated cohort data",()=>{
  const page=read("src/app/espace/formateur/page.tsx");
  assert.match(page,/head:true,count:"exact"/);
  assert.match(page,/tab==="apprenants"\|\|tab==="evaluations" \? db\.from\("learner_preferences"\)/);
  assert.match(page,/tab==="programme" \? db\.from\("learner_badges"\)/);
  assert.match(page,/pending=\{pendingCount\} learners=\{learnerCount\}/);
});
