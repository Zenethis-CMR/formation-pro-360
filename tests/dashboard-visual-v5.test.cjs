const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("learner V5 visual metrics use existing authoritative values and keep hero priority",()=>{
 const page=read("src/components/secure-learner-overview.tsx"),css=read("src/app/espace/dashboard-v5.css"),shell=read("src/components/secure-academy-shell.tsx");
 assert.ok(page.indexOf("academy-feature-v2")<page.indexOf("v2-pilot-metrics"));
 assert.ok(page.includes('Array.from({length:16}'));
 assert.ok(page.includes('i<pilot.approved?"filled":""'));
 assert.ok(page.includes('enrolled?pilot.xp:"—"'));
 assert.ok(page.includes('enrolled?pilot.pending:"—"'));
 assert.ok(page.includes("enrolled&&<><div className=\"v5-progress-segments\""));
 assert.ok(css.includes(".v5-progress-segments i.filled"));
 assert.ok(shell.includes("workspace-learner-rail"));
});
test("trainer cockpit has actual queue status, scores and an explicit unavailable state",()=>{
 const page=read("src/app/espace/formateur/page.tsx"),view=read("src/components/v2-trainer-evaluation-overview.tsx");
 assert.ok(page.includes("<V2TrainerEvaluationOverview dashboard/>"));
 assert.ok(page.includes("<V2TrainerEvaluationOverview/>"));
 assert.ok(view.includes("dashboard&&summary&&"));
 assert.ok(view.includes("summary.assessments.pending===0"));
 assert.ok(view.includes("Indicateurs du parcours indisponibles"));
 assert.ok(view.includes("item.score"));
 assert.ok(view.includes("item.feedback"));
 assert.ok(view.includes('data-review-state={item.status}'));
});
test("V5 visual layer is imported and respects responsive and reduced-motion states",()=>{
 const layout=read("src/app/espace/layout.tsx"),css=read("src/app/espace/dashboard-v5.css");
 assert.ok(layout.includes('import "./dashboard-v5.css"'));
 assert.ok(css.includes(".trainer-cockpit-v5 .v2-trainer-summary-head"));
 assert.ok(css.includes("max-width:720px"));
 assert.ok(css.includes("prefers-reduced-motion:reduce"));
 assert.ok(css.includes("font-variant-numeric:tabular-nums"));
});
