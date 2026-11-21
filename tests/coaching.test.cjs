const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

// Load the actual TypeScript module without adding another test framework.
const file = path.join(__dirname,"..","src","lib","coaching-insights.ts");
const code = ts.transpileModule(fs.readFileSync(file,"utf8"),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}
}).outputText;
const mod = {exports:{}};
vm.runInNewContext(code,{module:mod,exports:mod.exports,require,Date,Intl,console});
const {learnerInsight,cameroonDay,daysBetween,shiftDate} = mod.exports;

const missions=[
  {id:"m1",title:"HTML",week:1},
  {id:"m2",title:"CSS",week:1},
  {id:"m3",title:"JavaScript",week:2}
];
const deps=[
  {mission_id:"m2",prerequisite_id:"m1"},
  {mission_id:"m3",prerequisite_id:"m2"}
];
function evaluate(overrides={}){
  return learnerInsight({
    learnerId:"learner-a",missions,deps,awards:[],submissions:[],
    practices:[],steps:[],startDate:null,today:"2026-11-21",
    ...overrides
  });
}

test("date and time: Cameroon midnight boundaries and leap years",()=>{
  assert.equal(cameroonDay(new Date("2026-11-20T23:30:00Z")),"2026-11-21");
  assert.equal(cameroonDay(new Date("2026-11-20T22:59:00Z")),"2026-11-20");
  assert.equal(shiftDate("2024-02-28",1),"2024-02-29");
  assert.equal(daysBetween("2026-11-01","2026-11-08"),7);
});

test("no invented overdue week or inactivity before trainer sets a start date",()=>{
  const i=evaluate();
  assert.equal(i.plannedWeek,null);
  assert.equal(i.backlogWeeks.length,0);
  assert.equal(i.daysWithoutActivity,null);
  assert.equal(i.focusMission.id,"m1");
});

test("a week is not overdue until AFTER its seventh day",()=>{
  const onTime=evaluate({startDate:"2026-11-15",today:"2026-11-21"});
  assert.equal(onTime.backlogWeeks.length,0);
  const overdue=evaluate({startDate:"2026-11-14",today:"2026-11-21"});
  assert.equal(overdue.backlogWeeks.length,1);
  assert.equal(overdue.backlogWeeks[0],1);
});

test("approved missions are excluded from the week's backlog",()=>{
  const i=evaluate({
    startDate:"2026-11-01",today:"2026-11-21",
    awards:[{learner_id:"learner-a",mission_id:"m1"},{learner_id:"learner-a",mission_id:"m2"}]
  });
  assert.equal(i.backlogWeeks.includes(1),false);
  assert.equal(i.backlogWeeks.includes(2),true);
  assert.equal(i.nextMission.id,"m3");
});

test("review queue takes precedence over blocked missions",()=>{
  const i=evaluate({
    submissions:[{learner_id:"learner-a",mission_id:"m1",status:"pending",created_at:"2026-11-20T16:00:00Z"}]
  });
  assert.equal(i.pendingCount,1);
  assert.equal(i.focusKind,"evaluation");
  assert.equal(i.nextMission,null);
});

test("a requested correction must be prioritized for learner progress",()=>{
  const i=evaluate({
    submissions:[{learner_id:"learner-a",mission_id:"m1",status:"changes_requested",created_at:"2026-11-20T16:00:00Z"}]
  });
  assert.equal(i.revisionCount,1);
  assert.equal(i.focusKind,"correction");
  assert.equal(i.focusMission.id,"m1");
});

test("submissions and practice belonging to another learner are not counted",()=>{
  const i=evaluate({
    submissions:[{learner_id:"learner-b",mission_id:"m1",status:"pending",created_at:"2026-11-20T16:00:00Z"}],
    practices:[{learner_id:"learner-b",practice_date:"2026-11-20"}],
    startDate:"2026-11-20"
  });
  assert.equal(i.pendingCount,0);
  assert.equal(i.lastActivity,null);
});

test("a completed curriculum is not recommended for resubmission",()=>{
  const i=evaluate({
    awards:missions.map(m=>({learner_id:"learner-a",mission_id:m.id}))
  });
  assert.equal(i.focusKind,"termine");
  assert.equal(i.focusMission,null);
  assert.equal(i.approvedCount,3);
});

test("activity is aggregated using the Cameroon calendar day",()=>{
  const i=evaluate({
    startDate:"2026-11-18",
    submissions:[{learner_id:"learner-a",mission_id:"m1",status:"pending",created_at:"2026-11-20T23:35:00Z"}]
  });
  assert.equal(i.lastActivity,"2026-11-21");
  assert.equal(i.daysWithoutActivity,0);
});
