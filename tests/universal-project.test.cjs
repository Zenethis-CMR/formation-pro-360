const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),ts=require("typescript"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("seven project presentations adapt the work without changing storage",()=>{
 const exports={};vm.runInNewContext(ts.transpileModule(read("src/lib/universal-project.ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports});
 const get=exports.getProjectPresentation;
 const slugs=["ingenierie-produit-ia","design-produit-ux-ui-motion","copywriting-communication-contenu-ia","marketing-acquisition-ia","automatisation-integrations-agents-ia","infrastructure-devops-cybersecurite","entrepreneuriat-numerique-monetisation"];
 assert.equal(new Set(slugs.map(s=>get(s).brief)).size,7);
 assert.equal(Object.keys(get(slugs[0]).labels).length,0);
 for(const slug of slugs.slice(1))assert.ok(get(slug).labels.architecture.length>10);
});
test("project and portfolio use explicit validated track and preserve revocation",()=>{
 const a=read("src/app/espace/projet/actions.ts"),e=read("src/components/learner-product-editor.tsx"),p=read("src/app/espace/apprenant/formations/[parcours]/portfolio/page.tsx"),proxy=read("src/app/api/portfolio-publication/route.ts");
 assert.ok(a.includes('await requireRole("learner")'));assert.ok(e.includes("saveProductProject(revision,draft,trackSlug)"));
 assert.ok(p.includes("candidate.course?.slug===parcours"));assert.ok(p.includes("l.module_id===proof.module_id&&l.slug===proof.lesson_slug"));assert.ok(p.includes("projects={[]} trackSlug={parcours}"));
 assert.ok(proxy.includes('getAll("parcours")'));assert.ok(proxy.includes("values.length<=1"));assert.ok(proxy.includes("sameOrigin(request)"));
});
