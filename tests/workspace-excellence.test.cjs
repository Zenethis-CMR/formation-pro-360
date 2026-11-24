const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),ts=require("typescript"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");const exportsObject={};vm.runInNewContext(ts.transpileModule(read("src/lib/workspace-navigation.ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:exportsObject});
const {workspaceDestination,prefersWorkspaceFocus}=exportsObject;
test("mobile route chooses exactly one destination for both learner and trainer",()=>{
 const base="/espace/apprenant/formations/design";
 const cases=[["/espace/apprenant","dashboard",false,"home"],["/espace/apprenant","progression",false,"more"],[base+"/studio","dashboard",false,"courses"],[base+"/projet","dashboard",false,"project"],[base+"/portfolio","dashboard",false,"more"],["/espace/projet/backlog","dashboard",false,"project"],["/espace/formateur/bilan","dashboard",true,"learners"],["/espace/formateur/formations/qualite","dashboard",true,"more"]];
 for(const [p,tab,trainer,expected] of cases)assert.equal(workspaceDestination(p,tab,trainer,base),expected,p);
 assert.equal(prefersWorkspaceFocus("/espace/apprenant","dashboard",false),false);
 assert.equal(prefersWorkspaceFocus(base+"/studio","dashboard",false),true);
 assert.equal(prefersWorkspaceFocus("/espace/formateur/suivi","dashboard",true),false);
});
test("shared focus mode is reversible, desktop only, and contextual shortcuts exist",()=>{
 const shell=read("src/components/secure-academy-shell.tsx"),css=read("src/app/espace/workspace-excellence.css"),page=read("src/app/espace/apprenant/page.tsx"),quick=read("src/components/dashboard-workspace.tsx");
 assert.ok(shell.includes("aria-pressed={focused}"));assert.ok(shell.includes("focusOverride?.route===routeKey"));assert.ok(shell.includes('aria-current={mobileDestination==="project"?"page":undefined}'));
 assert.ok(css.includes("workspace-learner-shell.workspace-focus .workspace-learner-rail{display:none}"));assert.ok(css.includes("safe-area-inset-bottom"));assert.ok(css.includes("@media print"));
 assert.ok(page.includes("trackSlug={active.slug}"));assert.ok(quick.includes('projectBase+"/projet"'));assert.ok(quick.includes('projectBase+"/portfolio"'));
});

test("learner report is contextual and the narrow studio offers an accessible native workshop selector",()=>{
 const report=read("src/app/espace/apprenant/bilan/page.tsx"),studio=read("src/app/espace/apprenant/formations/[parcours]/studio/page.tsx"),css=read("src/app/espace/apprenant/formations/[parcours]/studio/studio.css");
 assert.ok(report.includes("selectEnrolledTrack(tracks,query.parcours??active?.slug)"));assert.ok(report.includes("data.course_slug===slug&&data.learner?.id===user.id"));assert.ok(!report.includes("learning-report?learner_id"));assert.ok(report.includes("workshopLinks={workshopLinks}"));
 assert.ok(studio.includes('method="get" action={base}'));assert.ok(studio.includes('htmlFor="us-workshop-select"'));assert.ok(studio.includes('name="atelier" defaultValue={lesson?.id??""}'));assert.ok(css.includes(".us-layout>.us-nav{display:none}"));assert.ok(css.includes(".us-compact-program{display:grid;gap:8px}"));
});
