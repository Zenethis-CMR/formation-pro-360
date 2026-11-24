const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),ts=require("typescript"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const out={};vm.runInNewContext(ts.transpileModule(read("src/lib/curriculum-authoring.ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:out});
test("initial copy preserves official evidence and requires new trainer demonstrations",()=>{
 const source={title:"Atelier",objective:"Objectif pédagogique à détailler",guided_work:"Travail guidé sous supervision du formateur",independent_work:"Travail autonome avec preuve de réalisation",evidence_required:"Livrable documenté et démonstration",rubric:[{label:"Qualité"},"Preuves","Tests","Autonomie"]};
 const copy=out.initialAuthoring(source,{hours:6,procedure:"Procédure IA contextualisée et documentée"});
 assert.equal(copy.minutes,360);assert.equal(copy.evidence,source.evidence_required);assert.equal(copy.rubric[0].label,"Qualité");
 assert.ok(out.missingAuthoring(copy).includes("demonstration"));assert.ok(out.missingAuthoring(copy).includes("rubric"));
 const detail="Description précise avec vérification et résultat attendu";
 const ready={...copy,demonstration:detail,ai_context:detail,ai_verification:detail,rubric:copy.rubric.map(x=>({...x,descriptor:detail}))};
 assert.equal(out.missingAuthoring(ready).length,0);assert.ok(out.missingAuthoring({...ready,rubric:ready.rubric.map(x=>({...x,label:"Même critère"}))}).includes("rubric"));
});
test("private studio preserves revision conflicts and does not offer publication",()=>{
 const editor=read("src/components/curriculum-editor.tsx"),actions=read("src/app/espace/formateur/formations/authoring-actions.ts"),directory=read("src/app/espace/formateur/formations/page.tsx");
 assert.ok(actions.includes('await requireRole("trainer")'));assert.ok(editor.includes("revision_conflict"));assert.ok(editor.includes("beforeunload"));assert.ok(editor.includes("Aucune publication"));assert.ok(editor.includes("historical"));assert.ok(directory.includes("authorRows.filter"));assert.ok(!actions.includes("/enroll"));
});
