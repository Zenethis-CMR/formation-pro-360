const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("full viewport shells preserve the learner context on all private routes",()=>{
 const root=read("src/app/layout.tsx"),global=read("src/app/fullscreen.css"),shell=read("src/components/secure-academy-shell.tsx"),css=read("src/app/espace/workspace-v3.css");
 assert.ok(root.includes('import "./fullscreen.css"'));
 assert.match(global,/\.academy-viewport\.secure-academy-viewport\{width:100%;max-width:none;padding:0;margin:0;min-height:100dvh\}/);
 assert.match(global,/\.secure-academy-content \.page\{width:100%;max-width:none!important;margin:0\}/);
 assert.ok(global.includes(".auth-new-page .auth-new-container{width:100%;min-height:100dvh"));
 assert.ok(global.includes(".v2catalog .v2catalog-nav,.v2catalog .v2catalog-body"));
 assert.ok(shell.includes('{!trainer?<aside className="academy-rail secure-academy-rail workspace-learner-rail"'));
 assert.ok(shell.includes('!trainer&&!learnerDashboard&&<div className="workspace-profile-bottom">'));
 assert.ok(css.includes(".secure-academy-frame.workspace-learner-shell .workspace-learner-rail{display:block}"));
 assert.ok(css.includes(".workspace-learner-shell .workspace-profile-bottom,.workspace-learner-shell .workspace-compact-profile{display:block}"));
});
test("studio keeps human-led work, anchor navigation and entitlement checks",()=>{
 const page=read("src/app/espace/parcours/ingenierie-produit-ia/atelier/[slug]/page.tsx"),css=read("src/app/espace/workspace-v3.css");
 assert.ok(page.indexOf('className="studio-aside studio-command-bar"')<page.indexOf('className="studio-main"'));
 for(const anchor of ["brief","studio-checklist-title","retour-formateur","carnet","qualite","boite-outils","coach","livrable"])assert.ok(page.includes('href="#'+anchor+'"'),anchor);
 assert.ok(page.includes("Un atelier pratique, avec ton formateur."));
 assert.ok(page.includes("const guide=accessible?v2WorkshopGuides[slug]:null"));
 assert.ok(page.includes("action={submitV2Lesson}"));
 assert.ok(page.includes("<WorkshopNotebook"));
 assert.ok(page.includes("<WorkshopCoach"));
 assert.ok(css.includes(".studio-layout.studio-layout-v3{display:block"));
 assert.ok(css.includes("scroll-margin-top:150px"));
 assert.ok(css.includes("@media(max-height:500px)"));
});
