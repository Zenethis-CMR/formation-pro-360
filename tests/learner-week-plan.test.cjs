const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const ts=require("typescript");
const vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const compiled=ts.transpileModule(read("src/lib/learner-week-plan.ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const exportsObject={};
vm.runInNewContext(compiled,{exports:exportsObject});
const {buildLearnerWeekPlan,doualaCalendarDate}=exportsObject;
const prefs={regular_days:[2,4,6,7],optional_days:[1],minutes_per_day:360};

test("four fixed six-hour sessions yield 24 planned hours; optional hours are separate",()=>{
 const p=buildLearnerWeekPlan(prefs,"2026-11-24");
 assert.equal(p.plannedMinutes,1440);
 assert.equal(p.optionalMinutes,360);
 assert.equal(p.regularCount,4);
 assert.equal(p.days.length,7);
 assert.equal(p.days[0].kind,"regular");
 assert.equal(p.days[0].learningMinutes,108);
 assert.equal(p.days[0].practiceMinutes,252);
 assert.equal(p.days[6].date,"2026-11-30");
 assert.equal(p.days[6].kind,"optional");
 assert.equal(p.days[1].minutes,0);
});
test("no invented schedule for incomplete preferences; duplicate and overlapping days do not inflate hours",()=>{
 assert.equal(buildLearnerWeekPlan(null,"2026-11-24"),null);
 assert.equal(buildLearnerWeekPlan({...prefs,minutes_per_day:60},"2026-11-24"),null);
 assert.equal(buildLearnerWeekPlan({...prefs,regular_days:[2,2]},"2026-11-24"),null);
 assert.equal(buildLearnerWeekPlan(prefs,"2026-02-30"),null);
 const p=buildLearnerWeekPlan({...prefs,regular_days:[2,4,6,7,7],optional_days:[2,1,1]},"2026-11-24");
 assert.equal(p.plannedMinutes,1440);
 assert.equal(p.optionalMinutes,360);
});
test("calendar boundary is based on Douala, not host timezone",()=>{
 assert.equal(doualaCalendarDate(new Date("2026-11-23T23:15:00Z")),"2026-11-24");
});
test("planner is reachable without treating planned time as validation",()=>{
 const page=read("src/app/espace/apprenant/page.tsx");
 const ui=read("src/components/learner-week-plan.tsx");
 const banner=read("src/components/learner-welcome-banner.tsx");
 assert.ok(page.includes("<LearnerWeekPlan"));
 assert.ok(ui.includes('id="planning-personnel"'));
 assert.ok(banner.includes("?onglet=programme#planning-personnel"));
 assert.ok(ui.includes("Aucun retard ni XP"));
 assert.ok(ui.includes('pilot?.enrollment==="active"'));
});
