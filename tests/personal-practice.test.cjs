const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),ts=require("typescript");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const output=ts.transpileModule(read("src/lib/personal-practice.ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const exportsObject={};vm.runInNewContext(output,{exports:exportsObject,URL});
const {briefPriority,briefIssues,emptyBrief,localDay,isOverdue,safeEvidence}=exportsObject;
test("human-authored briefs have explicit requirements and actionable status priority",()=>{
 assert.equal(briefIssues(emptyBrief()).length,5);
 assert.equal(briefIssues({...emptyBrief(),learner_id:"learner",title:"Tester un flux",objective:"Objectif",instructions:"Exercice",criteria:"Preuve"}).length,0);
 assert.ok(briefPriority("submitted",true)<briefPriority("accepted",true));
 assert.ok(briefPriority("revision_requested",false)<briefPriority("submitted",false));
 assert.equal(localDay(new Date("2026-11-24T23:30:00Z")),"2026-11-25");
 assert.equal(isOverdue({due_date:"2026-11-24",status:"assigned"},"2026-11-25"),true);
 assert.equal(isOverdue({due_date:"2026-11-24",status:"submitted"},"2026-11-25"),false);
 assert.equal(safeEvidence("javascript:alert(1)"),null);
 assert.equal(safeEvidence("https://u:p@example.invalid"),null);
});
test("brief experience keeps publication, evidence and correction human and role-separated",()=>{
 const trainer=read("src/app/espace/formateur/defis/page.tsx"),learner=read("src/app/espace/apprenant/defis/page.tsx"),ui=read("src/components/personal-practice-board.tsx"),action=read("src/app/espace/defis/actions.ts");
 assert.ok(trainer.includes('requireRole("trainer")'));
 assert.ok(learner.includes('requireRole("learner")'));
 assert.ok(!learner.includes("session-participants"));
 assert.ok(action.includes('action?.intent==="submit"?"learner":"trainer"'));
 for(const s of ["APERÇU · NON PUBLIÉ","Remettre mon travail","Demander une reprise","Retour humain","revision_conflict","ne génèrent pas d'XP"])assert.ok(ui.includes(s),s);
 assert.ok(read("src/components/secure-academy-shell.tsx").includes('base+"/defis"'));
});
