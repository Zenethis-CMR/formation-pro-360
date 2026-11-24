const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),ts=require("typescript"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const exportsObject={};
vm.runInNewContext(ts.transpileModule(read("src/lib/universal-learning.ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:exportsObject});
const {parseStudioTrack,selectStudioLesson}=exportsObject;
const id=n=>"00000000-0000-4000-8000-"+String(n).padStart(12,"0");
const m={id:id(1),slug:"module-a",title:"Module A",week:1};
const l={id:id(2),module_id:m.id,slug:"atelier",version:1,status:"published",title:"Atelier",objective:"Objectif",guided_work:"Guide",independent_work:"Travail",evidence_required:"Preuve",rubric:[{label:"Qualité",descriptor:"Critère officiel"}]};
const data={track:{slug:"design",title:"Design",status:"published"},enrollment:"active",lesson_access:"granted",modules:[m],lessons:[l,{...l,id:id(3),version:2},{...l,id:id(4),version:3,status:"draft"},{...l,id:id(5),module_id:id(8)}],workshop_states:[{module_id:m.id,lesson_slug:l.slug,status:"changes_requested"}]};
test("only published and enrolled curriculum, newest published revision, actual rubric and state",()=>{
 const studio=parseStudioTrack(data,"design");
 assert.equal(studio.lessons.length,1);
 assert.equal(studio.lessons[0].id,id(3));
 assert.equal(studio.lessons[0].state,"changes_requested");
 assert.equal(studio.lessons[0].rubric[0].descriptor,"Critère officiel");
 for(const invalid of [{...data,enrollment:"paused"},{...data,enrollment:null},{...data,lesson_access:"locked"},{...data,track:{...data.track,status:"draft"}}])assert.equal(parseStudioTrack(invalid,"design"),null);
 assert.equal(parseStudioTrack(data,"other"),null);
});
test("no guessed state and no fallback for a forged or stale lesson id",()=>{
 const studio=parseStudioTrack({...data,workshop_states:undefined},"design");
 assert.equal(studio.lessons[0].state,"unknown");
 assert.equal(selectStudioLesson(studio.lessons,undefined).id,id(3));
 for(const bad of [id(2),id(4),id(8),"../../admin",["a"],""])assert.equal(selectStudioLesson(studio.lessons,bad),null);
});
test("selection works for variable module counts and same slug in distinct modules",()=>{
 const second={...m,id:id(9),slug:"module-b",title:"Module B"};
 const studio=parseStudioTrack({...data,modules:[m,second],lessons:[l,{...l,id:id(10),module_id:second.id}],workshop_states:[{module_id:second.id,lesson_slug:l.slug,status:"changes_requested"},{module_id:m.id,lesson_slug:l.slug,status:"approved"}]},"design");
 assert.equal(studio.lessons.length,2);
 assert.equal(selectStudioLesson(studio.lessons,undefined).id,id(10));
});
test("generic route checks learner before API and guards interactions by capabilities",()=>{
 const page=read("src/app/espace/apprenant/formations/[parcours]/studio/page.tsx");
 assert.ok(page.indexOf('await requireRole("learner")')<page.indexOf("await backendRequest"));
 assert.ok(page.includes("parseStudioTrack"));
 assert.ok(page.includes("if(!track)return"));
 assert.ok(!page.includes('method:"POST"'));
 assert.ok(page.includes("canSubmit?<form action={submitV2Lesson}"));
 assert.ok(page.includes("track.notebookAvailable?await backendRequest"));
 assert.ok(page.includes("track.coachAvailable?<WorkshopCoach"));
 assert.ok(page.includes('trackSlug={parcours}'));
 assert.ok(read("src/app/espace/apprenant/formations/page.tsx").includes('+"/studio"'));
});

test("mutations require confirmed capability and an actionable exact state",()=>{
 const {studioCanSubmit,studioSteps}=exportsObject;
 const track=parseStudioTrack({...data,evaluation_open:true,notebook_available:true,coach_available:true},"design");
 assert.equal(track.notebookAvailable,true);
 assert.equal(track.coachAvailable,true);
 assert.equal(studioCanSubmit(track,track.lessons[0]),true);
 for(const state of ["unknown","approved","pending"])assert.equal(studioCanSubmit(track,{...track.lessons[0],state}),false);
 assert.equal(studioCanSubmit({...track,evaluationOpen:false},track.lessons[0]),false);
 assert.equal(studioSteps(track.lessons[0]).length,5);
});
