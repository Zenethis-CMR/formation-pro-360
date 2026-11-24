const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("guided optional onboarding preserves a single form and server validation",()=>{
 const page=read("src/app/espace/bienvenue/page.tsx"),wizard=read("src/components/learner-onboarding-wizard.tsx"),action=read("src/app/espace/actions.ts");
 assert.ok(page.includes('requireRole("learner")'));
 assert.ok(page.includes("<LearnerOnboardingWizard current={current}"));
 for(const marker of ['hidden={step!==0}','hidden={step!==1}','hidden={step!==2}','readValues(form.current)','saveLearnerPreferencesDraft(data)','plannedWeeklyHours(recap)','Passer cette étape pour le moment','beforeunload','aria-current={i===step?"step":undefined}'])assert.ok(wizard.includes(marker),marker);
 assert.ok(action.includes('export async function saveLearnerPreferencesDraft'));
 assert.ok(action.includes('learner_id:user.id,...parsed.value'));
 assert.ok(action.includes('if(!parsed.valid) return {ok:false,error:"invalid"}'));
 assert.ok(!wizard.includes("localStorage"));
});
test("verification stays separate from credentials and resend errors retain context",()=>{
 const login=read("src/app/login/page.tsx"),action=read("src/app/auth/actions.ts"),password=read("src/components/auth-password-field.tsx");
 assert.ok(login.includes('mode==="connexion"&&!needsConfirmation&&<form'));
 assert.ok(login.includes('mode==="inscription"&&!needsConfirmation&&<form'));
 assert.ok(login.includes('params.verification==="1"'));
 assert.ok(action.includes('&verification=1&error=resend'));
 assert.ok(action.includes('&verification=1&error=quota'));
 assert.ok(password.includes('autoComplete==="new-password"&&!confirm'));
 assert.ok(password.includes('auth-password-checks'));
 assert.ok(password.includes('pattern={autoComplete==="new-password"'));
 assert.ok(!password.includes('localStorage'));
});
test("responsive layout respects hidden steps and reduced motion",()=>{
 const css=read("src/app/espace/bienvenue/onboarding.css"),auth=read("src/app/login/onboarding-auth.css");
 assert.ok(css.includes(".onboarding-stage[hidden]{display:none!important}"));
 assert.ok(css.includes("@container(max-width:450px)"));
 assert.ok(css.includes("prefers-reduced-motion"));
 assert.ok(auth.includes("prefers-reduced-motion"));
 assert.ok(auth.includes(".auth-confirmation-mode"));
});
