const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");

test("new learner sees clear email confirmation, recovery and correct password rules",()=>{
 const login=read("src/app/login/page.tsx");
 const verify=read("src/app/auth/verify/route.ts");
 assert.ok(verify.includes("sent=verified"));
 for(const word of ["verified:","auth-verification-journey","auth-signup-steps",
   "auth-verification-retry","J'ai confirmé mon adresse","majuscule, une minuscule et un chiffre"])
   assert.ok(login.includes(word),word);
 assert.ok(!login.includes('params.error==="signup";'));
});
test("first login has a guided journey with optional preferences and no invented progress",()=>{
 const page=read("src/app/espace/apprenant/page.tsx");
 const journey=read("src/components/learner-journey-guide.tsx");
 assert.ok(page.includes("<LearnerJourneyGuide pilot={pilot} profileSaved={!!rawPreferences}/>"));
 for(const x of ["profileSaved:boolean","stage","profile","enroll","first","continue",
   "review","suspended","complete","Passer cette étape","resumeSlug","role=\"progressbar\""])
   assert.ok(journey.includes(x),x);
 assert.ok(journey.includes("pilot.approved===16&&pilot.xp>=1600"));
 assert.ok(!journey.includes("localStorage"));
 assert.ok(!journey.includes("Math.random"));
});
test("the eight-week roadmap sends all submissions to one full studio",()=>{
 const roadmap=read("src/app/espace/parcours/ingenierie-produit-ia/page.tsx");
 const studio=read("src/app/espace/parcours/ingenierie-produit-ia/atelier/[slug]/page.tsx");
 assert.ok(!roadmap.includes("action={submitV2Lesson}"));
 assert.ok(roadmap.includes("formulaire de remise"));
 assert.ok(roadmap.includes("Suivre ma correction dans le studio"));
 assert.ok(roadmap.includes("Améliorer mon projet dans le studio"));
 assert.ok(studio.includes("action={submitV2Lesson}"));
 assert.ok(studio.includes("Commencer par les consignes"));
 assert.ok(studio.includes("Reprendre après la correction"));
 assert.ok(studio.includes("Suivre mon évaluation"));
});
test("true course completion requires all 16 validated workshops plus official 1600 XP",()=>{
 const view=read("src/components/secure-learner-overview.tsx");
 const progress=read("src/components/v2-learner-progress-panel.tsx");
 const studio=read("src/app/espace/parcours/ingenierie-produit-ia/atelier/[slug]/page.tsx");
 assert.ok(view.includes("pilot.approved===16&&pilot.xp>=1600"));
 assert.ok(progress.includes("successes===16&&progress.xpTotal>=1600"));
 assert.ok(studio.includes("verifiedLessons.size===16"));
 assert.ok(studio.includes("Number(data?.xp_total??0)>=1600"));
 for(const s of [view,progress,studio])assert.ok(s.includes("/espace/portfolio"));
});
test("new learners see their principal course before supplementary history",()=>{
 const ui=read("src/components/secure-learner-overview.tsx");
 assert.ok(ui.includes("Mon apprentissage"));
 assert.ok(ui.includes('open={xp>0||submissions.length>0}'));
 assert.ok(ui.includes("learner-legacy-details-content"));
 assert.ok(ui.includes("v2-legacy-heading"));
 assert.ok(ui.includes("academy-donut"));
 assert.ok(ui.indexOf("academy-milestone")<ui.indexOf("learner-legacy-details"));
});
test("new learner UX has responsive layout, keyboard focus and reduced motion controls",()=>{
 const css=read("src/app/premium.css");
 for(const marker of [".auth-verification-journey",".learner-journey-guide",
   ".learner-journey-steps",".learner-finish-celebration",".studio-journey-finish",
   "@media(max-width:550px)","focus-visible","prefers-reduced-motion:reduce"])
   assert.ok(css.includes(marker),marker);
});

test("studio primary actions remain reachable when access or review information is incomplete",()=>{
 const studio=read("src/app/espace/parcours/ingenierie-produit-ia/atelier/[slug]/page.tsx");
 const feedback=read("src/components/workshop-trainer-feedback.tsx");
 const notebook=read("src/components/workshop-notebook.tsx");
 assert.ok(studio.includes('const primaryHref=!accessible?base:'));
 assert.ok(studio.includes('const primaryLabel=!accessible?"Vérifier mon accès"'));
 assert.ok(studio.includes('const reviewHref=review?"#retour-formateur":"#livrable"'));
 assert.ok(studio.includes('history.find(s=>s.status!=="pending"&&\n    s.reviewed_at!==null)'));
 assert.ok(studio.includes('!data?"Atelier momentanément indisponible"'));
 assert.ok(studio.includes('id="livrable"'));
 assert.ok(feedback.includes('id="retour-formateur"'));
 assert.ok(feedback.includes("Aucun commentaire écrit"));
 assert.ok(notebook.includes('{review&&<WorkshopTrainerFeedback'));
 assert.ok(studio.includes('{review&&<WorkshopTrainerFeedback'));
});

test("authentication outage is distinguishable from invalid credentials or expired email links",()=>{
 const actions=read("src/app/auth/actions.ts");
 const verification=read("src/app/auth/verify/route.ts");
 const login=read("src/app/login/page.tsx");
 assert.ok(actions.includes('if(!response||response.status>=500) redirect("/login?error=setup")'));
 assert.ok(verification.includes('!result || result.status >= 500'));
 assert.ok(verification.includes('error=verification_unavailable'));
 assert.ok(login.includes('params.error==="verification_unavailable"'));
 assert.ok(login.includes("La vérification est temporairement indisponible"));
 assert.ok(login.includes("12 et 128 caractères, avec une majuscule, une minuscule et un chiffre"));
 assert.ok(login.includes("1 · Demande de confirmation"));
});
