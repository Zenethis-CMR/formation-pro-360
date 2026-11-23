const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");

test("every V2 workshop has an exhaustive guided plan and reusable tools",()=>{
  const text=read("src/lib/v2-workshop-guides.ts");
  const start=text.indexOf("export const v2WorkshopGuides:Record<string,V2WorkshopGuide>=");
  assert.ok(start>0);
  const prefix="export const v2WorkshopGuides:Record<string,V2WorkshopGuide>=";
  const body=text.slice(start+prefix.length).split(";\nexport const v2WorkshopGuideCount")[0];
  const guides=JSON.parse(body);
  const catalog=read("src/lib/v2-public-catalog.ts");
  const pilot=JSON.parse(catalog.split("export const pilotCourse=")[1].split(" as const;")[0]);
  const slugs=pilot.modules.flatMap(m=>m.lessons.map(l=>l.slug));
  assert.equal(slugs.length,16);
  assert.equal(Object.keys(guides).length,16);
  for(const slug of slugs){
    const guide=guides[slug];
    assert.ok(guide,slug);
    assert.equal(guide.steps.length,5,slug);
    assert.equal(guide.checks.length,4,slug);
    assert.equal(guide.errors.length,3,slug);
    assert.ok(guide.prompt.length>80&&guide.template.length>120,slug);
    assert.ok(guide.steps.every(s=>s.title&&s.action&&s.proof&&s.verify),slug);
  }
});

test("workshop studio requires genuine learner access before rendering guides",()=>{
  const page=read("src/app/espace/parcours/ingenierie-produit-ia/atelier/[slug]/page.tsx");
  assert.match(page,/requireRole\("learner"\)/);
  assert.match(page,/backendRequest\("\/v1\/training\/catalog\/ingenierie-produit-ia"\)/);
  assert.match(page,/data.lesson_access==="granted"/);
  assert.match(page,/data\.enrollment==="active"/);
  assert.match(page,/const guide=accessible\?v2WorkshopGuides\[slug\]:null/);
  assert.match(page,/const canSubmit=Boolean\(accessible&&data\?\.evaluation_open/);
  assert.match(page,/lesson\.module_id/);
  assert.match(page,/action=\{submitV2Lesson\}/);
  assert.match(page,/workshopSlug/);
  assert.match(page,/force-dynamic/);
});
test("studio navigation, checklist and AI prompts do not invent server XP",()=>{
  const course=read("src/app/espace/parcours/ingenierie-produit-ia/page.tsx");
  const client=read("src/components/v2-workshop-tools.tsx");
  const actions=read("src/app/espace/actions.ts");
  assert.match(course,/studio pédagogique/);
  assert.match(client,/useState/);
  assert.match(client,/navigator.clipboard.writeText/);
  assert.match(client,/ne sont pas sauvegardées/);
  assert.doesNotMatch(client,/fetch\(|xp_ledger|v2_lesson_xp|localStorage/);
  assert.match(actions,/workshopSlug/);
  assert.match(actions,/path\+"\?livrable=envoye"/);
});
