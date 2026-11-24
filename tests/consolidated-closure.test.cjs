const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("official dashboards remain independent of legacy query errors",()=>{
 const layout=read("src/app/espace/layout.tsx"),learner=read("src/app/espace/apprenant/page.tsx"),trainer=read("src/app/espace/formateur/page.tsx"),shell=read("src/components/secure-academy-shell.tsx");
 assert.ok(layout.includes("courseStats:detail?.progress.summary?"));assert.ok(!layout.includes("throw new Error"));
 assert.ok(learner.includes('tab!=="dashboard"&&(legacyError||preferencesError)'));assert.ok(trainer.includes('tab!=="dashboard"&&legacyError'));assert.ok(learner.includes("learning?.available&&!active"));assert.ok(shell.includes('stats.courseStats?stats.courseStats.approved+"/"+stats.courseStats.total:"—"'));
});
test("onboarding is scoped to signed-in preferences and entitled formation",()=>{
 const p=read("src/app/espace/bienvenue/page.tsx"),w=read("src/components/learner-onboarding-wizard.tsx");
 assert.ok(p.includes('.eq("learner_id",user.id)'));assert.ok(!p.includes('db.from("missions")'));assert.ok(!p.includes('db.from("xp_ledger")'));assert.ok(p.includes("active?.slug===pilotCourse.slug?await getV2DashboardPilot():null"));assert.ok(w.includes("course?")&&w.includes("#planning-adaptatif"));
});
test("existing learners see work before acquisition and trainer priorities reflect official counts",()=>{
 const d=read("src/app/espace/apprenant/formations/page.tsx"),t=read("src/components/universal-trainer-cockpit.tsx");
 assert.ok(d.includes("(!tracks.length||choice)&&offersSection"));assert.ok(d.includes("tracks.length>0&&!choice&&offersSection"));assert.ok(t.includes("b.metrics?.pending"));assert.ok(t.includes("/espace/formateur/formations/qualite"));assert.ok(t.includes("priority.map"));
});
