const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.join(__dirname,"..");
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");

test("all retired public demo routes lead into protected workspace",()=>{
  for(const p of ["src/app/page.tsx","src/app/apprenant/page.tsx","src/app/formateur/page.tsx"]){
    const page=read(p);
    assert.match(page,/redirect\("\/espace"\)/,p);
    assert.doesNotMatch(page,/useDemo|DemoProvider|missions\.map\(/,p);
  }
});
test("simulated localStorage missions and review engine no longer ship",()=>{
  for(const p of ["src/context/demo-store.tsx","src/data/missions.ts","src/lib/mission-engine.ts"])
    assert.equal(fs.existsSync(path.join(root,p)),false,p);
  assert.doesNotMatch(read("src/components/app-shell.tsx"),/DemoProvider|useDemo/);
  assert.doesNotMatch(read("src/components/technology-badge.tsx"),/data\/missions/);
});
test("login remains available for both existing and new users without demo CTA",()=>{
  const login=read("src/app/login/page.tsx");
  assert.match(login,/mode==="inscription"/);
  assert.match(login,/signInWithPassword/);
  assert.match(login,/registerLearner/);
  assert.match(login,/sendMagicLink/);
  assert.match(login,/requestPasswordReset/);
  assert.doesNotMatch(login,/Voir la démonstration|href="\/"/);
});
test("all roles have four distinct secure workspace views",()=>{
  const shell=read("src/components/secure-academy-shell.tsx");
  for(const tab of ["evaluations","apprenants","programme","missions","progression"])
    assert.match(shell,new RegExp("onglet="+tab));
  assert.match(shell,/useSearchParams/);
  assert.match(shell,/currentTab/);
  assert.match(shell,/\/espace\/compte/);
  assert.doesNotMatch(shell,/\/formateur#|\/apprenant#|useDemo/);
});
test("learner tabs gather missions, progress and program without mixed dashboard sections",()=>{
  const file=read("src/app/espace/apprenant/page.tsx");
  assert.match(file,/tab==="dashboard"/);
  assert.match(file,/tab==="missions"/);
  assert.match(file,/tab==="progression"/);
  assert.match(file,/tab==="programme"/);
  assert.match(file,/WorkspaceTabHeading/);
  for(const component of ["SecureLearnerOverview","LearnerCoachingPanel","LearningAchievements","SkillMastery","TrainingSchedule","CurriculumRoadmap"])
    assert.match(file,new RegExp(component));
  assert.match(file,/requireRole\("learner"\)/);
});
test("trainer tabs organize evaluation history, learner messages and program actions",()=>{
  const file=read("src/app/espace/formateur/page.tsx");
  for(const tab of ["dashboard","evaluations","apprenants","programme"])
    assert.match(file,new RegExp('tab==="'+tab+'"'));
  assert.match(file,/workspace-review-history/);
  assert.match(file,/TrainerCoachingPanel/);
  assert.match(file,/CohortProgress/);
  assert.match(file,/LaunchReadiness/);
  assert.match(file,/action={reviewMission}/);
  assert.match(file,/action={publishMission}/);
  assert.match(file,/action={createMission}/);
  assert.match(file,/requireRole\("trainer"\)/);
});
test("server actions return to the tab that performed the work",()=>{
  const file=read("src/app/espace/actions.ts");
  for(const tab of ["evaluations","apprenants","programme","progression"])
    assert.match(file,new RegExp("onglet="+tab));
  assert.match(file,/requireRole\("trainer"\)/);
  assert.match(file,/requireRole\("learner"\)/);
});
test("protected pages still enforce their roles and never reference demo data",()=>{
  const routes=["src/app/espace/formateur/page.tsx","src/app/espace/apprenant/page.tsx",
    "src/app/espace/atelier/[id]/page.tsx","src/app/espace/formateur/atelier/[id]/page.tsx"];
  for(const route of routes){
    const page=read(route);
    assert.match(page,/requireRole\(/,route);
    assert.doesNotMatch(page,/useDemo|DemoProvider/,route);
  }
});
