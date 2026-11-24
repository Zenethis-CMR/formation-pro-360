const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const source=read("src/lib/v2-public-catalog.ts");
const get=(key,next)=>JSON.parse(source.split("export const "+key+"=")[1].split(" as const;")[0]);
test("seven course catalog uses eight weeks and sixteen source-based atelier previews",()=>{
  const pilot=get("pilotCourse");
  const others=get("specializations");
  assert.equal(others.length,6);
  assert.equal(pilot.modules.length,8);
  assert.equal(pilot.modules.reduce((sum,m)=>sum+m.lessons.length,0),16);
  assert.deepEqual(pilot.modules.map(m=>m.week),[1,2,3,4,5,6,7,8]);
  assert.ok(pilot.modules.every(m=>m.lessons.every(l=>l.title&&l.objective&&l.evidence)));
  assert.ok(pilot.modules.some(m=>m.lessons.some(l=>l.slug==="prd-prototype")));
});
test("public catalog pages are discoverable and never grant enrollment or XP",()=>{
  const list=read("src/app/catalogue/page.tsx");
  const detail=read("src/app/catalogue/ingenierie-produit-ia/page.tsx");
  const shell=read("src/components/secure-academy-shell.tsx");
  const login=read("src/app/login/page.tsx");
  assert.match(list,/specializations\.map/);
  assert.match(list,/PROGRAMME PROPOSÉ/);
  assert.match(detail,/pilotCourse\.modules\.map/);
  assert.match(list,/Vérifier les inscriptions/);
  assert.match(detail,/La formation est accessible depuis ton espace personnel./);
  assert.ok(list.includes('learner?"/espace/parcours/ingenierie-produit-ia":withCourseChoice("/login",pilotCourse.slug)'));
  assert.match(shell,/label:"Catalogue"/);
  assert.equal((shell.match(/label:"Catalogue"/g)||[]).length,2);
  assert.match(login,/href="\/catalogue"/);
  for(const page of [list,detail]){
    assert.doesNotMatch(page,/enrollments|xp_ledger|createDatabaseClient|action=\{/);
  }
});
