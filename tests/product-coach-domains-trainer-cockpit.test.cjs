const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("six selectable domains are passed only after voluntary consent",()=>{
 const ui=read("src/components/product-practice-assistance.tsx");
 const api=read("src/app/api/coach/route.ts");
 for(const id of ["projet","backlog","ux","technique","qualite","business"])assert.ok(ui.includes('id:"'+id+'"'));
 assert.ok(ui.includes('scope:"project",consent:true,mode,domain'));
 assert.ok(ui.includes('setDomain(e.target.value as Domain);setConsent(false)'));
 assert.ok(api.includes('invalid_domain'));
 assert.ok(api.includes('domain:body.domain??"projet"'));
 assert.ok(api.includes('body.consent!==true'));
});
test("trainer cockpit is private, paginated, read only and anchored to official evidence",()=>{
 const page=read("src/app/espace/formateur/suivi/page.tsx");
 assert.ok(page.includes('requireRole("trainer")'));
 assert.ok(page.includes('official_workshop_submissions_and_xp'));
 assert.ok(page.includes('w.status==="verified"'));
 assert.ok(page.includes('data.has_next'));
 assert.ok(page.includes("Aucun chiffre n'est estimé"));
 assert.ok(page.includes("ne prouvent pas une absence de travail"));
 assert.ok(read("src/app/espace/formateur/page.tsx").includes('href="/espace/formateur/suivi"'));
});
