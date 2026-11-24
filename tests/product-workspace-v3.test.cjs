const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("product workspace has shared navigation and no panels ahead of the editor",()=>{
 const page=read("src/app/espace/projet/page.tsx"),nav=read("src/components/product-workspace-nav.tsx");
 assert.ok(page.indexOf("<ProductWorkspaceNav")<page.indexOf("<LearnerProductEditor"));
 assert.ok(page.indexOf("<LearnerProductEditor")<page.indexOf('aria-labelledby="milestone-title"'));
 assert.ok(page.indexOf("<LearnerProductEditor")<page.indexOf('aria-labelledby="project-evidence-title"'));
 assert.ok(page.includes('trainer_approved_with_xp_ledger'));
 for(const [route,active] of [["projet","dossier"],["projet/backlog","backlog"],["projet/accompagnement","accompagnement"],["projet/revues","revues"],["portfolio","portfolio"]]){
  const p=read("src/app/espace/"+route+"/page.tsx");
  assert.ok(p.includes('<ProductWorkspaceNav active="'+active+'"/>'),route);
  assert.ok(p.includes('requireRole("learner")'),route);
  assert.ok(nav.includes('href:"/espace/'+route+'"'),route);
 }
 assert.ok(nav.includes('aria-current={active===id?"page":undefined}'));
 assert.ok(nav.includes('href={href}'));
});
test("editor changes visible sections without discarding the full draft",()=>{
 const editor=read("src/components/learner-product-editor.tsx");
 assert.ok(editor.includes('activeSection===section.id&&'));
 assert.ok(editor.includes("saveProductProject(revision,draft)"));
 assert.ok(editor.includes("const invalidSection=projectSections.find"));
 assert.ok(editor.includes("setActiveSection(invalidSection.id)"));
 assert.ok(editor.includes("beforeunload"));
 assert.ok(editor.includes("draft[field.key]"));
 assert.ok(editor.includes("projectSections.flatMap"));
 assert.ok(editor.includes("ne valide aucun atelier"));
 assert.ok(!editor.includes("localStorage"));
});
test("board column filter does not change the saved task collection",()=>{
 const board=read("src/components/product-backlog-board.tsx"),css=read("src/app/espace/workspace-v3.css");
 assert.ok(board.includes('taskStatuses.filter(s=>statusFilter==="all"||s.id===statusFilter)'));
 assert.ok(board.includes("saveProductBacklog(revision,tasks)"));
 assert.ok(board.includes("Aucun statut Kanban n'attribue d'XP"));
 assert.ok(css.includes("@container (min-width:1000px)"));
 assert.ok(css.includes(".backlog-board.pw-board-single"));
});
