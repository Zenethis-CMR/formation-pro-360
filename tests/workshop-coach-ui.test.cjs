const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");

test("coach is rendered only if the real backend declares it available",()=>{
 const s=read("src/app/espace/parcours/ingenierie-produit-ia/atelier/[slug]/page.tsx");
 assert.match(s,/coach_available\?:boolean/);
 assert.match(s,/lesson&&data\?\.coach_available/);
 assert.match(s,/<WorkshopCoach lessonId=\{lesson.id\}/);
 assert.match(s,/Les réponses IA ne sont jamais simulées/);
});
test("authenticated coach server action only sends a question and never issues XP",()=>{
 const s=read("src/app/espace/actions.ts");
 const pos=s.indexOf("export async function askWorkshopCoach");
 assert.ok(pos>=0);
 const action=s.slice(pos);
 assert.match(action,/requireRole\("learner"\)/);
 assert.match(action,/question.length<8/);
 assert.match(action,/question.length>1200/);
 assert.match(action,/method:"POST",body:JSON.stringify\(\{question\}\)/);
 assert.doesNotMatch(action,/xp_ledger|v2_lesson_xp|referenceUrl|completed_steps/);
});
test("client makes an explicit request and shows a model response or accurate unavailability",()=>{
 const s=read("src/components/workshop-coach.tsx");
 assert.match(s,/useActionState/);
 assert.match(s,/action=\{run\}/);
 assert.match(s,/Pose une question sur cet atelier/);
 assert.match(s,/state.answer/);
 assert.match(s,/En envoyant cette question/);
 assert.doesNotMatch(s,/localStorage|fetch\(|simulate|faker/i);
});
