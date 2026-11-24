const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),ts=require("typescript");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const output=ts.transpileModule(read("src/lib/learner-support.ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const exportsObject={};vm.runInNewContext(output,{exports:exportsObject});
const {emptySupport,supportReady,supportOrder}=exportsObject;
test("structured requests and role-specific priorities",()=>{
 assert.equal(supportReady(emptySupport()),false);
 assert.equal(supportReady({...emptySupport(),title:"Tester le flux",context:"Erreur observée",attempted:"Test effectué",expected:"Aide pour comprendre"}),true);
 assert.ok(supportOrder({status:"waiting_trainer",urgency:"blocking"},true)<supportOrder({status:"waiting_trainer",urgency:"normal"},true));
 assert.ok(supportOrder({status:"waiting_learner",urgency:"normal"},false)<supportOrder({status:"waiting_trainer",urgency:"blocking"},false));
 assert.ok(supportOrder({status:"resolved",urgency:"blocking"},true)>supportOrder({status:"waiting_trainer",urgency:"normal"},true));
});
test("human support remains role-separated, voluntary and explicit",()=>{
 const learner=read("src/app/espace/apprenant/aide/page.tsx"),trainer=read("src/app/espace/formateur/aide/page.tsx"),ui=read("src/components/learner-support-center.tsx");
 assert.ok(learner.includes('requireRole("learner")'));
 assert.ok(trainer.includes('requireRole("trainer")'));
 assert.ok(learner.includes("data.can_create===true"));
 assert.ok(ui.includes("Transmettre au formateur"));
 assert.ok(ui.includes("Confirmer la résolution"));
 assert.ok(ui.includes("Rouvrir la demande"));
 assert.ok(ui.includes("Aucune notification externe"));
 assert.ok(ui.includes("revision_conflict"));
 assert.ok(ui.includes("beforeunload"));
 assert.ok(read("src/components/secure-academy-shell.tsx").includes('base+"/aide"'));
 assert.ok(read("src/app/espace/aide/support.css").includes("prefers-reduced-motion"));
});
