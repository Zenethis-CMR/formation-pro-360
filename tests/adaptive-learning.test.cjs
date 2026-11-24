const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),ts=require("typescript"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const modules={};
function load(p){if(modules[p])return modules[p];const exports={};vm.runInNewContext(ts.transpileModule(read("src/lib/"+p+".ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:n=>load(n.replace("@/lib/",""))});return modules[p]=exports;}
const {forecastWork,publishedWorkItems}=load("adaptive-learning-plan");
const rhythm={regular_days:[1,3,5],minutes_per_day:300,optional_days:[2,3]};
const item=(id,state,minutes)=>({id,title:id,state,minutes});
test("calendar allocates only unfinished production, starts tomorrow, splits sessions and ignores optional days",()=>{
 const p=forecastWork([item("done","approved",240),item("pending","pending",360),item("new","not_started",360),item("fix","changes_requested",180)],rhythm,"2026-11-24",true);
 assert.equal(p.remainingMinutes,540);assert.equal(p.pending,1);assert.equal(p.revisions,1);assert.equal(p.weeklyMinutes,900);assert.equal(p.optionalDays,1);assert.equal(p.courseWorkDate,"2026-11-27");assert.equal(p.slots[0].date,"2026-11-25");assert.equal(p.slots[0].tasks[0].id,"fix");assert.equal(p.slots[1].minutes,240);
});
test("unknown durations, state, incomplete publication and invalid availability never produce an asserted date",()=>{
 for(const bad of [item("x","unknown",300),item("x","not_started",null)])assert.equal(forecastWork([bad],rhythm,"2026-11-24",true).courseWorkDate,null);
 assert.equal(forecastWork([item("x","not_started",300)],rhythm,"2026-11-24",false).courseWorkDate,null);
 assert.equal(forecastWork([item("x","not_started",300)],{...rhythm,regular_days:[1,1,3]},"2026-11-24",true).courseWorkDate,null);
 assert.equal(forecastWork([item("x","approved",300)],rhythm,"2026-11-24",true).remainingMinutes,0);
});
test("budget joins exact published identity and version, never backend array position",()=>{
 const course=load("v2-public-catalog").pilotCourse;
 const modules=course.modules.map((m,i)=>({id:String(i),slug:m.slug}));
 const lessons=course.modules.flatMap((m,i)=>m.lessons.map(l=>({...l,id:l.slug,module_id:String(i),version:1,evidence_required:l.evidence,state:"not_started"}))).reverse();
 const track={modules,lessons};
 const result=publishedWorkItems(course.slug,track);
 assert.equal(result.completeCoverage,true);
 assert.equal(result.items.reduce((n,x)=>n+x.minutes,0),63*60);
 const altered=publishedWorkItems(course.slug,{...track,lessons:[{...lessons[0],version:2},...lessons.slice(1)]});
 assert.equal(altered.completeCoverage,false);assert.equal(altered.items[0].minutes,null);
});
test("active choice is server-validated, account-bound and connected to dashboard and navigation",()=>{
 const action=read("src/app/espace/apprenant/formations/actions.ts"),ctx=read("src/lib/active-learning-context.ts"),home=read("src/app/espace/apprenant/page.tsx"),shell=read("src/components/secure-academy-shell.tsx");
 assert.ok(action.includes('await requireRole("learner")'));assert.ok(action.includes("selectEnrolledTrack(tracks,requested)"));assert.ok(action.includes("httpOnly:true"));assert.ok(ctx.includes("saved?.startsWith(prefix)"));assert.ok(ctx.includes("selectEnrolledTrack(tracks,requested)??selectEnrolledTrack(tracks,undefined)"));assert.ok(home.includes("nonPilot?(adaptive"));assert.ok(shell.includes("activeCourseHref(stats)"));
});
