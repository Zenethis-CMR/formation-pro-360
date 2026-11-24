const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),ts=require("typescript"),vm=require("node:vm");const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");const exportsObject={};vm.runInNewContext(ts.transpileModule(read("src/lib/universal-enrollment.ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:exportsObject});
test("only published explicitly open non-enrolled offers are selectable",()=>{
 const t={slug:"design",title:"Design",summary:"Formation",status:"published",enrollment:null,enrollment_open:true,module_count:8,lesson_count:16};
 const bad=[{...t,slug:"draft",status:"draft"},{...t,slug:"closed",enrollment_open:false},{...t,slug:"paused",enrollment:"paused"},{...t,slug:"../admin"},{...t,slug:"empty",lesson_count:0}];
 assert.equal(exportsObject.availableEnrollmentOffers({tracks:[t,t,...bad]}).length,1);assert.equal(exportsObject.availableEnrollmentOffers(null).length,0);
});
test("enrollment and opening require explicit user consent and server authority",()=>{
 const a=read("src/app/espace/apprenant/formations/actions.ts"),f=read("src/app/espace/formateur/formations/enrollment-actions.ts"),w=read("src/app/espace/bienvenue/page.tsx"),z=read("src/components/learner-onboarding-wizard.tsx");
 assert.ok(a.includes('requireRole("learner")'));assert.ok(a.includes('acceptFreeEnrollment:true'));assert.ok(a.includes('data?.course_slug!==slug'));assert.ok(f.includes('requireRole("trainer")'));assert.ok(f.includes('expected_revision:Number(raw)'));assert.ok(f.includes('formData.get("confirm")!=="on"'));assert.ok(w.includes("publishedWorkItems(active.slug,detail.studio)"));assert.ok(z.includes("#planning-adaptatif"));
});
