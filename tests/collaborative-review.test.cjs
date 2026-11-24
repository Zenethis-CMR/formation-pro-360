const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),ts=require("typescript");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const load=(file,deps={})=>{const e={};const output=ts.transpileModule(read(file),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(output,{exports:e,require:n=>{if(!(n in deps))throw Error(n);return deps[n];},URL});return e;};
const project=load("src/lib/learner-product-project.ts");
const {previewSnapshot,shareReady,reviewSections}=load("src/lib/collaborative-review.ts",{"./learner-product-project":project});
test("preview includes only selected sections and evidence",()=>{
 const s={project:{revision:3,dossier:{...project.emptyDossier(),name:"Prototype",architecture:"Private architecture"}},backlog:{revision:2,tasks:[{id:"t",title:"Build"}]},proofs:[{id:"p1"},{id:"p2"}]};
 const result=previewSnapshot(s,["vision","evidence"],["p1"]);
 assert.equal(result.vision.name,"Prototype");assert.equal(result.evidence.length,1);assert.equal(result.evidence[0].id,"p1");
 assert.equal("engineering" in result,false);assert.equal("backlog" in result,false);
 assert.equal(reviewSections.length,9);
 assert.equal(shareReady(s,["vision"],[],"Revue MVP",false),false);
 assert.equal(shareReady(s,["vision"],[],"Revue MVP",true),true);
 assert.equal(shareReady(s,["evidence"],["wrong"],"Revue MVP",true),false);
 assert.equal(shareReady({...s,backlog:null},["backlog"],[],"Revue MVP",true),false);
});
test("review UI protects role and requires preview, consent and explicit revocation",()=>{
 const learner=read("src/app/espace/projet/revues/page.tsx"),trainer=read("src/app/espace/formateur/revues/page.tsx"),ui=read("src/components/collaborative-review-workspace.tsx"),action=read("src/app/espace/revues/actions.ts");
 assert.ok(learner.includes('requireRole("learner")'));assert.ok(trainer.includes('requireRole("trainer")'));
 assert.ok(!trainer.includes('>("/project")'));assert.ok(trainer.includes('const sources:ShareSources|null=null'));
 assert.ok(action.includes('action?.intent==="comment"?"trainer":"learner"'));
 for(const s of ["Prévisualiser le partage","Retirer l'accès","LECTURE SEULE","source_changed","revision_conflict","beforeunload","!preview||!shareReady","Retours sur cette rubrique"])assert.ok(ui.includes(s),s);
 assert.ok(read("src/app/espace/projet/page.tsx").includes('<ProductWorkspaceNav active="dossier"/>'));
 assert.ok(read("src/components/product-workspace-nav.tsx").includes('href:"/espace/projet/revues"'));
 assert.ok(read("src/app/espace/revues/reviews.css").includes("prefers-reduced-motion"));
});
