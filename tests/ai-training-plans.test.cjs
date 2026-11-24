const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),ts=require("typescript"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const exportsObj={};vm.runInNewContext(ts.transpileModule(read("src/lib/ai-training-plans.ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:exportsObj});
const {aiTrainingPlans,trainingHours,trainingMinutes,formatWorkload,getAiTrainingPlan,estimateTraining,estimateLabel}=exportsObj;
test("all seven courses have 16 workload-budgeted activities with domain-specific methods",()=>{
 const expected={"ingenierie-produit-ia":63,"design-produit-ux-ui-motion":22,"copywriting-communication-contenu-ia":11.5,"marketing-acquisition-ia":20.25,"automatisation-integrations-agents-ia":25,"infrastructure-devops-cybersecurite":25.75,"entrepreneuriat-numerique-monetisation":13};
 assert.equal(aiTrainingPlans.length,7);
 for(const [slug,hours] of Object.entries(expected)){const plan=getAiTrainingPlan(slug);assert.ok(plan);assert.equal(trainingHours(plan),hours);assert.equal(plan.modules.length,8);assert.equal(plan.modules.flatMap(m=>m.activities).length,16);for(const m of plan.modules){assert.equal(m.activities.length,2);for(const a of m.activities){assert.ok(a.minutes>=30&&a.minutes<=360&&Number.isInteger(a.minutes));assert.ok(a.procedure.length>40);assert.equal(a.hours*60,a.minutes);assert.equal(a.understandingMinutes+a.productionMinutes+a.verificationMinutes,a.minutes);assert.ok(a.verificationMinutes>0&&a.productionMinutes>0);}}}
 assert.equal(new Set(aiTrainingPlans.flatMap(p=>p.modules.flatMap(m=>m.activities.map(a=>a.procedure)))).size,112);
});
test("calendar estimate rounds work sessions up, only uses fixed days and never invents availability",()=>{
 const rhythm={regular_days:[1,2,3,4,5],minutes_per_day:360,optional_days:[6,7]};
 assert.equal(estimateTraining(60,rhythm).weeklyHours,30);assert.equal(estimateLabel(60,rhythm),"2 sem.");
 assert.equal(estimateLabel(62,rhythm),"2 sem. + 1 séance");
 assert.equal(estimateLabel(160,{regular_days:[1,3,5],minutes_per_day:300}),"10 sem. + 2 séances");
 assert.equal(estimateLabel(40,{regular_days:[1,2,3,4,5],minutes_per_day:480}),"1 sem.");
 assert.equal(estimateLabel(40,{regular_days:[1,2,3,4,5,6,7],minutes_per_day:600}),"4 séances");
 for(const invalid of [null,{regular_days:null,minutes_per_day:300},{regular_days:[1,1,2],minutes_per_day:300},{regular_days:[1,2,8],minutes_per_day:300},{regular_days:[1,2,3],minutes_per_day:0}])assert.equal(estimateTraining(60,invalid),null);
 assert.equal(estimateTraining(0,rhythm),null);
});
test("catalogue derives personalized estimates from the authenticated learner only",()=>{
 const source=read("src/lib/catalog-study-rhythm.ts"),catalog=read("src/app/catalogue/page.tsx"),wizard=read("src/components/learner-onboarding-wizard.tsx"),pilot=read("src/app/catalogue/ingenierie-produit-ia/page.tsx"),studio=read("src/app/espace/parcours/ingenierie-produit-ia/atelier/[slug]/page.tsx");
 assert.ok(source.includes('user?.role!=="learner"'));assert.ok(source.includes('.eq("learner_id",user.id)'));assert.ok(source.includes('select("regular_days,minutes_per_day")'));
 assert.ok(catalog.includes("await getCatalogStudyRhythm()"));assert.ok(catalog.includes("<TrainingDuration plan={pilotPlan}"));
 assert.ok(wizard.includes("estimateLabel(trainingHours(p),recap)"));
 assert.ok(pilot.includes("<TrainingDuration plan={plan} rhythm={rhythm}"));
 assert.ok(studio.includes("Les critères officiels restent inchangés."));
});

test("minute budgets are formatted without decimal hours and sum correctly",()=>{assert.equal(formatWorkload(45),"45 min");assert.equal(formatWorkload(75),"1 h 15");assert.equal(formatWorkload(1545),"25 h 45");const devops=getAiTrainingPlan("infrastructure-devops-cybersecurite");assert.equal(devops.modules[1].activities[0].minutes,45);assert.equal(devops.modules[1].activities[1].minutes,60);assert.equal(trainingMinutes(devops),1545);assert.equal(estimateLabel(trainingHours(devops),{regular_days:[1,2,3,4],minutes_per_day:360}),"1 sem. + 1 séance");assert.equal(aiTrainingPlans.reduce((n,p)=>n+trainingMinutes(p),0),10830);});
