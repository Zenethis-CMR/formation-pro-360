const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const ts=require("typescript");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const compiled=ts.transpileModule(read("src/lib/product-backlog.ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const exportsObject={};
vm.runInNewContext(compiled,{exports:exportsObject});
const {summarizeBacklog,sortTasks,canCompleteTask,localCalendarDate}=exportsObject;
const task={id:"a",title:"Prototype",description:"",acceptance:"",status:"todo",priority:"normal",workshop:null,due_date:null,estimate_minutes:60};
test("backlog statistics distinguish declared tasks from official evaluations",()=>{
 const tasks=[{...task,due_date:"2026-11-23"},{...task,id:"b",status:"done",due_date:"2026-11-22"},{...task,id:"c",status:"doing",estimate_minutes:90},{...task,id:"d",status:"testing",estimate_minutes:30}];
 const result=summarizeBacklog(tasks,"2026-11-24");
 assert.equal(result.total,4);assert.equal(result.done,1);assert.equal(result.active,1);assert.equal(result.testing,1);assert.equal(result.overdue,1);assert.equal(result.remainingMinutes,180);
 assert.equal(summarizeBacklog([],"2026-11-24").total,0);
});
test("priority and deadline ordering is deterministic; completed tasks require criteria",()=>{
 const sorted=sortTasks([{...task,id:"a"},{...task,id:"b",priority:"critical"},{...task,id:"c",due_date:"2026-11-25"}]);
 assert.equal(sorted.map(t=>t.id).join(","),"b,c,a");
 assert.equal(canCompleteTask(task),false);
 assert.equal(canCompleteTask({...task,acceptance:"  "}),false);
 assert.equal(canCompleteTask({...task,acceptance:"Test the flow"}),true);
 assert.equal(localCalendarDate(new Date("2026-11-23T23:10:00Z")),"2026-11-24");
});
test("the board is optional, private, linked to the project and never grants XP",()=>{
 const page=read("src/app/espace/projet/backlog/page.tsx");
 const action=read("src/app/espace/projet/backlog/actions.ts");
 const ui=read("src/components/product-backlog-board.tsx");
 assert.ok(page.includes('requireRole("learner")'));
 assert.ok(action.includes('requireRole("learner")'));
 assert.ok(action.includes('res?.status===409'));
 assert.ok(ui.includes("Aucun statut Kanban n'attribue d'XP"));
 assert.ok(ui.includes("canCompleteTask"));
 assert.ok(ui.includes("Exporter")||ui.includes("Export JSON"));
 assert.ok(!ui.includes("localStorage"));
 assert.ok(read("src/app/espace/projet/page.tsx").includes('href="/espace/projet/backlog"'));
});
