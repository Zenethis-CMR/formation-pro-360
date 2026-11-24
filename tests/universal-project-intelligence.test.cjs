const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("project workspace preserves explicit track on mutations and navigation",()=>{
 for(const p of ["projet/backlog","revues"]){const s=read("src/app/espace/"+p+"/actions.ts");assert.ok(s.includes("validPedagogicalSlug(trackSlug)"));assert.ok(s.includes("encodeURIComponent(trackSlug)"));}
 assert.ok(read("src/components/product-backlog-board.tsx").includes("saveProductBacklog(revision,tasks,trackSlug)"));
 assert.ok(read("src/components/collaborative-review-workspace.tsx").includes("actOnReview(action,trackSlug)"));
 assert.ok(read("src/components/product-workspace-nav.tsx").includes("destination(id,href)"));
 assert.ok(read("src/lib/project-context.ts").includes('t.enrollment==="paused"||t.enrollment==="revoked"'));
});
test("project coach keeps consent, track validation and no implicit dossier",()=>{
 const api=read("src/app/api/coach/route.ts"),ui=read("src/components/product-practice-assistance.tsx");
 assert.ok(api.includes('body.consent!==true'));assert.ok(api.includes('"/project/coach"'));assert.ok(api.includes('invalid_track'));
 assert.ok(ui.includes("scope:\"project\",consent:true,mode,domain,trackSlug"));assert.ok(ui.includes("Aucune action n'a été exécutée."));
});
