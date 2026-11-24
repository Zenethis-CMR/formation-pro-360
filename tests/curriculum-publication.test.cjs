const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),ts=require("typescript"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const load=p=>{const exports={};vm.runInNewContext(ts.transpileModule(read("src/lib/"+p+".ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:()=>({})});return exports};
test("publication payload is bound to current complete seal and closed enrollment",()=>{
 const {publishPayload}=load("curriculum-releases");
 const l={lesson_id:"a",revision:2,sealed_revision:2,ready:true,minutes:75};
 const v={track:{status:"draft"},can_publish:true,unchanged:true,enrolled:false,latest:{id:"r",version:2,lesson_count:1,total_minutes:75},lessons:[l]};
 assert.equal(publishPayload(v).confirm_closed_enrollment,true);
 assert.equal(publishPayload(v).release_id,"r");
 for(const bad of [{...v,unchanged:false},{...v,enrolled:true},{...v,can_publish:false},{...v,lessons:[{...l,sealed_revision:1}]},{...v,latest:{...v.latest,total_minutes:60}}])assert.equal(publishPayload(bad),null);
});
test("approved pedagogy only accepts valid official fields and planner never mixes partial data",()=>{
 const {parsePublishedPedagogy}=load("universal-learning"),{publishedWorkItems}=load("adaptive-learning-plan");
 const text="Une consigne officielle détaillée et vérifiable.";
 const p={source:"sealed_release",release_version:2,minutes:75,demonstration:text,ai_context:text,ai_procedure:text,ai_verification:text,resources:""};
 assert.equal(parsePublishedPedagogy(p).minutes,75);
 assert.equal(parsePublishedPedagogy({...p,source:"draft"}),null);
 assert.equal(parsePublishedPedagogy({...p,minutes:0}),null);
 const l={id:"a",module_id:"m",title:"Atelier",state:"not_started",pedagogy:p};
 const full=publishedWorkItems("design",{modules:[{id:"m"}],lessons:[l]});
 assert.equal(full.completeCoverage,true);assert.equal(full.items[0].minutes,75);
 const partial=publishedWorkItems("design",{modules:[{id:"m"}],lessons:[l,{...l,id:"b",pedagogy:null}]});
 assert.equal(partial.completeCoverage,false);assert.equal(partial.items[1].minutes,null);
});
test("publication requires two user confirmations and studio displays approved content",()=>{
 const p=read("src/components/curriculum-release-panel.tsx"),a=read("src/app/espace/formateur/formations/release-actions.ts"),s=read("src/app/espace/apprenant/formations/[parcours]/studio/page.tsx");
 assert.ok(p.includes("!publication||!reviewed||!closed"));assert.ok(a.includes('requireRole("trainer")'));assert.ok(a.includes("data.enrollment_open===false"));
 for(const field of ["demonstration","ai_context","ai_procedure","ai_verification","resources","minutes"])assert.ok(s.includes("lesson.pedagogy."+field));
});
