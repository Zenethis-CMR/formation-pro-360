const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),ts=require("typescript"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const exportsObject={};vm.runInNewContext(ts.transpileModule(read("src/lib/curriculum-quality.ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:exportsObject});
const {parseQuality}=exportsObject;
const lesson={lesson_id:"00000000-0000-4000-8000-000000000000",module_title:"Module",lesson_slug:"atelier",title:"Atelier",revision:1,minutes:45,issues:[],warnings:[]};
const track={slug:"design",title:"Design",status:"draft",gate:"candidate_for_manual_review",blockers:[],warnings:["manual_review_required"],module_count:1,lesson_count:1,ready_count:1,sealed_version:1,approved_minutes:45,lessons:[lesson]};
const data={source:"official_curriculum_quality",activation_enabled:false,tracks:[track]};
test("quality gate fails closed for inconsistent or activation-enabled responses",()=>{
 assert.equal(parseQuality(data).length,1);
 assert.equal(parseQuality({...data,activation_enabled:true}),null);
 assert.equal(parseQuality({...data,tracks:[{...track,blockers:["release_stale"]}]}),null);
 assert.equal(parseQuality({...data,tracks:[{...track,approved_minutes:null}]}),null);
 assert.equal(parseQuality({...data,tracks:[{...track,lessons:[{...lesson,issues:["copy_missing"]}]}]}),null);
});
test("quality screen is trainer-only and separates proposed from sealed workload",()=>{
 const p=read("src/app/espace/formateur/formations/qualite/page.tsx");
 assert.ok(p.includes('requireRole("trainer")'));assert.ok(p.includes("/v1/training/curriculum-quality"));assert.ok(p.includes("Charge proposée"));assert.ok(p.includes("Charge scellée contrôlée"));assert.ok(p.includes("Activation désactivée"));
 assert.ok(read("src/app/espace/formateur/formations/page.tsx").includes("/espace/formateur/formations/qualite"));
});
