const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("trainer cockpit is primary and draft metrics remain unavailable",()=>{
 const home=read("src/app/espace/formateur/page.tsx"),panel=read("src/components/universal-trainer-cockpit.tsx"),helper=read("src/lib/trainer-cockpit.ts");
 assert.ok(home.indexOf("<UniversalTrainerCockpit/>")<home.indexOf("<V2TrainerEvaluationOverview dashboard/>"));
 assert.ok(panel.includes("t.metrics?"));assert.ok(panel.includes("Aucun chiffre n’est estimé"));
 assert.ok(helper.includes("t.metrics===null"));assert.ok(helper.includes("published.find(t=>t.slug===requested)"));
});
test("individual reports and pagination preserve selected track, reject mismatched responses, suppress pilot milestones",()=>{
 const roster=read("src/app/espace/formateur/suivi/page.tsx"),report=read("src/app/espace/formateur/bilan/page.tsx"),view=read("src/components/learning-report-view.tsx");
 assert.ok(roster.includes("result.course_slug===slug"));assert.ok(roster.includes("weeks.map"));assert.ok(roster.includes('query+"&page="'));
 assert.ok(report.includes("data.course_slug===slug&&data.learner.id===id"));
 assert.ok(view.includes('{pilot&&<section'));assert.ok(view.includes('pilot||x.title!=="Revues collaboratives"'));
});
