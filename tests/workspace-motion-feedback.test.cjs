const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),ts=require("typescript"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const out={};vm.runInNewContext(ts.transpileModule(read("src/lib/workspace-feedback.ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:out});
test("save status never reports success for pending, error or dirty draft",()=>{
 const base={pending:false,dirty:false,saved:false,error:false};
 for(const [patch,expected] of [[{},"idle"],[{saved:true},"saved"],[{saved:true,dirty:true},"dirty"],[{saved:true,error:true,dirty:true},"error"],[{saved:true,pending:true,dirty:true},"saving"],[{saved:true,readOnly:true},"readonly"]])assert.equal(out.resolveSaveState({...base,...patch}),expected);
});
test("loading is contextual and exposes no invented user statistics",()=>{
 const component=read("src/components/workspace-loading.tsx");
 assert.ok(component.includes('role="status"'));assert.ok(component.includes('aria-hidden="true"'));assert.ok(!component.includes("Math.random"));assert.ok(!component.includes("XP"));
 for(const [route,variant] of [["","generic"],["apprenant/","dashboard"],["formateur/","dashboard"],["projet/","product"],["parcours/ingenierie-produit-ia/atelier/[slug]/","studio"],["apprenant/bilan/","report"],["formateur/bilan/","report"]])assert.ok(read("src/app/espace/"+route+"loading.tsx").includes('variant="'+variant+'"'));
});
test("navigation feedback depends on link pending, and recovery is manual",()=>{
 const ui=read("src/components/workspace-feedback.tsx"),shell=read("src/components/secure-academy-shell.tsx"),error=read("src/app/espace/error.tsx"),css=read("src/app/workspace-motion.css");
 assert.ok(ui.includes("useLinkStatus()"));assert.ok(ui.includes('aria-live="polite"'));
 assert.ok(shell.includes('href="#workspace-content"'));assert.ok(shell.includes('id="workspace-content" tabIndex={-1}'));
 assert.ok(error.includes("startTransition(()=>reset())"));assert.ok(error.includes("disabled={pending}"));assert.ok(!error.includes("setTimeout"));
 assert.ok(css.includes("prefers-reduced-motion:reduce"));assert.ok(css.includes("animation:none!important"));
 for(const path of ["src/components/learner-product-editor.tsx","src/components/product-backlog-board.tsx"]){const s=read(path);assert.ok(s.includes("<WorkspaceSaveStatus pending={pending}"));assert.ok(s.includes("beforeunload"));assert.ok(s.includes("if(result.ok===true)"));}
});
