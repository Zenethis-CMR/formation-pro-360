const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");

test("tutor is only visible when backend authorizes the published lesson",()=>{
 const s=read("src/app/espace/parcours/ingenierie-produit-ia/atelier/[slug]/page.tsx");
 assert.match(s,/coach_available\?:boolean/);
 assert.match(s,/lesson&&data\?\.coach_available/);
 assert.match(s,/<WorkshopCoach lessonId=\{lesson.id\}/);
 assert.match(s,/Les réponses IA ne sont jamais simulées/);
});
test("coach no longer holds a slow model response in a Next Server Action",()=>{
 const client=read("src/components/workshop-coach.tsx");
 const endpoint=read("src/app/api/coach/route.ts");
 assert.match(client,/onSubmit=\{ask\}/);
 assert.match(client,/fetch\("\/api\/coach"/);
 assert.match(client,/response\.body\?\.getReader\(\)/);
 assert.match(endpoint,/text\/event-stream/);
 assert.match(endpoint,/new ReadableStream<Uint8Array>/);
 assert.match(endpoint,/emit\("ready"/);
 assert.match(endpoint,/emit\("heartbeat"/);
 assert.match(endpoint,/emit\("answer"/);
 assert.match(endpoint,/emit\("failure"/);
 assert.match(endpoint,/setInterval/);
 assert.match(endpoint,/x-accel-buffering/);
 assert.doesNotMatch(client,/useActionState|useFormStatus|action=\{run\}/);
});
test("same-origin, learner authentication and backend entitlement remain enforced",()=>{
 const endpoint=read("src/app/api/coach/route.ts");
 assert.match(endpoint,/origin!==allowed/);
 assert.match(endpoint,/currentUser\(\)/);
 assert.match(endpoint,/user.role!=="learner"/);
 assert.match(endpoint,/uuid\.test/);
 assert.match(endpoint,/backendRequest\(/);
 assert.doesNotMatch(endpoint,/xp_ledger|completed_steps|v2_lesson_xp|public\.submissions/);
});
test("model failures are handled in component state without reloading the page",()=>{
 const client=read("src/components/workshop-coach.tsx");
 assert.match(client,/catch\{/);
 assert.match(client,/setReply\(\{status:"unavailable"/);
 assert.match(client,/Aucun travail ni carnet/);
 assert.match(client,/Poser une question de suivi/);
 assert.match(client,/lastSuccess\.question/);
 assert.doesNotMatch(client,/localStorage|sessionStorage/);
});
test("studio has a local error boundary for browser-side exceptions",()=>{
 const fallback=read("src/app/espace/parcours/ingenierie-produit-ia/atelier/[slug]/error.tsx");
 assert.match(fallback,/reset/);
 assert.match(fallback,/Retour au parcours/);
 assert.match(fallback,/role="alert"/);
});

test("three pedagogical modes and voluntary work summary are transmitted, never the notebook",()=>{
 const client=read("src/components/workshop-coach.tsx");
 const proxy=read("src/app/api/coach/route.ts");
 assert.match(client,/type CoachMode="commencer"\|"debloquer"\|"verifier"/);
 assert.match(client,/name="coachMode"/);
 assert.match(client,/name="workSummary"/);
 assert.match(client,/maxLength=\{400\}/);
 assert.match(client,/mode,\s*\.\.\.\(workSummary.trim\(\)/);
 assert.match(client,/lastSuccess\?\.mode===mode/);
 assert.match(client,/navigator.clipboard.writeText/);
 assert.match(proxy,/invalid_mode/);
 assert.match(proxy,/invalid_work_summary/);
 assert.match(proxy,/work_summary:body.work_summary.trim\(\)/);
 assert.doesNotMatch(proxy,/workshop_notebooks|xp_ledger/);
});
