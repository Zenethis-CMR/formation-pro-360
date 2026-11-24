const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("dashboard puts the page heading first and groups the operational modules",()=>{
 const learner=read("src/app/espace/apprenant/page.tsx"),trainer=read("src/app/espace/formateur/page.tsx"),overview=read("src/components/secure-learner-overview.tsx"),workspace=read("src/components/dashboard-workspace.tsx");
 assert.ok(learner.indexOf("<DashboardHeader")<learner.indexOf("<SecureLearnerOverview"));
 assert.ok(trainer.indexOf("<DashboardHeader")<trainer.indexOf("<V2TrainerEvaluationOverview"));
 assert.ok(overview.indexOf("{primaryAction}")<overview.indexOf("academy-feature-v2"));
 assert.ok(overview.indexOf("{workspace}")<overview.indexOf("learner-legacy-details"));
 assert.ok(!overview.includes("open={xp>0"));
 assert.ok(trainer.includes('<DashboardDisclosure title="État technique du coach local"'));
 for(const href of ["/espace/projet","/espace/apprenant/seances","/espace/apprenant/defis","/espace/apprenant/aide","/espace/apprenant/bilan","/espace/portfolio","/espace/formateur/suivi","/espace/formateur/seances","/espace/formateur/defis","/espace/formateur/aide","/espace/formateur/revues"])assert.ok(workspace.includes(href),href);
});
test("navigation prioritizes official routes and preserves secondary workflows",()=>{
 const shell=read("src/components/secure-academy-shell.tsx"),css=read("src/app/espace/workspace-v3.css");
 assert.ok(shell.includes('const detail=dashboard||'));
 assert.ok(shell.includes("AVEC MON FORMATEUR"));
 assert.ok(shell.includes('href={base+"/corrections"}'));
 assert.ok(shell.includes('href={base+"/suivi"}'));
 assert.ok(shell.includes("mobileMore.current.open=false"));
 assert.ok(shell.includes('base+"?onglet=missions"'));
 assert.ok(shell.includes('base+"?onglet=progression"'));
 assert.ok(!shell.includes("CircleStat"));
 assert.ok(css.includes("prefers-reduced-motion"));
 assert.ok(css.includes("max-width:370px"));
 assert.ok(css.includes(":focus-visible"));
});
