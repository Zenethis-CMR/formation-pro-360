const test=require("node:test");const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("studio only loads private notes after real enrollment",()=>{
 const s=read("src/app/espace/parcours/ingenierie-produit-ia/atelier/[slug]/page.tsx");
 assert.match(s,/const savedResponse=accessible&&lesson/);
 assert.match(s,/lesson.id\+"\/notebook"/);
 assert.match(s,/workbook&&lesson&&data\?\.enrollment==="active"/);
 assert.match(s,/WorkshopNotebook/);
 assert.match(s,/carnet==="ok"/);
});
test("workbook save requires a learner session, validates input and never modifies rewards",()=>{
 const a=read("src/app/espace/actions.ts");
 const s=a.slice(a.indexOf("export async function saveWorkshopNotebook"));
 assert.match(s,/requireRole\("learner"\)/);
 assert.match(s,/idPattern.test\(lessonId\)/);
 assert.match(s,/checked.length>5/);
 assert.match(s,/new Set\(checked\)/);
 assert.match(s,/method:"PUT"/);
 assert.match(s,/completed_steps:checked.map\(Number\)/);
 assert.doesNotMatch(s,/xp_ledger|v2_lesson_xp|reviewV2Lesson|db\.from\(/);
});
test("workbook checkboxes are persisted only through an explicit form submission",()=>{
 const s=read("src/components/workshop-notebook.tsx");
 assert.match(s,/name="completedStep"/);
 assert.match(s,/initial.completed_steps/);
 assert.match(s,/useFormStatus/);
 assert.match(s,/action=\{saveWorkshopNotebook\}/);
 assert.match(s,/Enregistrer mon carnet/);
 assert.doesNotMatch(s,/localStorage|sessionStorage|fetch\(/);
});
