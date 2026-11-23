const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const ts=require("typescript");
const path=require("node:path");
const root=path.join(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
function tsExports(p){
 const code=ts.transpileModule(read(p),{compilerOptions:{
   module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,
   esModuleInterop:true
 }}).outputText;
 const exports={};
 vm.runInNewContext(code,{exports,require(name){
   if(name==="server-only")return {};
   throw Error("Unexpected import in curriculum: "+name);
 }},{timeout:3000,filename:p});
 return exports;
}

test("8-week principal curriculum has exactly 16 unique complete pedagogical studios",()=>{
 const course=tsExports("src/lib/v2-public-catalog.ts").pilotCourse;
 const guides=tsExports("src/lib/v2-workshop-guides.ts").v2WorkshopGuides;
 assert.equal(course.slug,"ingenierie-produit-ia");
 assert.equal(course.modules.length,8);
 const slugs=new Set();
 for(const [i,module] of course.modules.entries()){
   assert.equal(module.week,i+1);
   assert.equal(module.lessons.length,2,"Semaine "+module.week);
   assert.ok(module.skills.length>=2);
   for(const lesson of module.lessons){
     assert.ok(!slugs.has(lesson.slug),"Duplicate lesson "+lesson.slug);
     slugs.add(lesson.slug);
     assert.ok(lesson.title.length>10);
     assert.ok(lesson.objective.length>20);
     assert.ok(lesson.evidence.length>20);
     const guide=guides[lesson.slug];
     assert.ok(guide,"Missing pedagogical studio "+lesson.slug);
     assert.equal(guide.slug,lesson.slug);
     assert.equal(guide.steps.length,5,"Five actionable steps: "+lesson.slug);
     assert.equal(guide.checks.length,4,"Four quality checks: "+lesson.slug);
     assert.ok(guide.minutes>=30&&guide.minutes<=480);
     assert.ok(guide.prompt.length>40);
     assert.ok(guide.template.length>40);
     assert.ok(guide.steps.every(s=>s.title&&s.action.length>20&&
       s.proof.length>15&&s.verify.length>15));
     assert.ok(exists("src/app/espace/parcours/ingenierie-produit-ia/atelier/[slug]/page.tsx"));
   }
 }
 assert.equal(slugs.size,16);
 assert.deepEqual(Object.keys(guides).sort().join("|"),[...slugs].sort().join("|"));
});

test("all learner tabs lead to protected real pages, not demo or legacy-only placeholders",()=>{
 const shell=read("src/components/secure-academy-shell.tsx");
 const learner=read("src/app/espace/apprenant/page.tsx");
 const heading=read("src/components/workspace-tab-heading.tsx");
 const resources=read("src/components/v2-learner-resources-panel.tsx");
 for(const [label,route,file] of [
   ["dashboard","/espace/apprenant","src/app/espace/apprenant/page.tsx"],
   ["main course","/espace/parcours/ingenierie-produit-ia","src/app/espace/parcours/ingenierie-produit-ia/page.tsx"],
   ["portfolio","/espace/portfolio","src/app/espace/portfolio/page.tsx"],
   ["account","/espace/compte","src/app/espace/compte/page.tsx"],
   ["objectives","/espace/bienvenue","src/app/espace/bienvenue/page.tsx"]
 ]){
   assert.ok(shell.includes(route),label);
   assert.ok(exists(file),file);
 }
 for(const tab of ["missions","progression","programme"]){
   assert.ok(shell.includes("onglet="+tab));
   assert.ok(learner.includes('tab==="'+tab+'"'));
   assert.ok(Object.hasOwn(heading,tab)||heading.includes(tab+":{"));
 }
 assert.match(shell,/label:"Mes ressources"/);
 assert.match(heading,/title:"Mes ressources"/);
 assert.match(learner,/V2LearnerResourcesPanel data=\{courseResources\}/);
 assert.match(learner,/TrainingSchedule/);
 assert.match(learner,/CurriculumRoadmap/);
 assert.match(learner,/AUTRES RÉALISATIONS · RESSOURCES CONSERVÉES/);
 assert.match(resources,/data.lesson_access==="granted"/);
 assert.match(resources,/published.has\(id\+":"\+slug\)/);
 assert.match(resources,/guide=accessible\?v2WorkshopGuides\[l.slug\]:null/);
 assert.doesNotMatch(resources,/localStorage|Math\.random|fakeProjects/);
});

test("principal-course enrollment and permissions gate the eight modules and their exercises",()=>{
 const course=read("src/app/espace/parcours/ingenierie-produit-ia/page.tsx");
 const studio=read("src/app/espace/parcours/ingenierie-produit-ia/atelier/[slug]/page.tsx");
 const progress=read("src/lib/v2-learner-progress.ts");
 const dashboard=read("src/lib/v2-dashboard-pilot.ts");
 assert.match(course,/requireRole\("learner"\)/);
 assert.match(course,/lesson_access==="granted"/);
 assert.match(course,/enrollInV2Pilot/);
 assert.match(course,/data\.enrollment_open/);
 assert.match(course,/data\?\.evaluation_open/);
 assert.match(course,/data\.modules\|\|pilotCourse/);
 assert.match(studio,/requireRole\("learner"\)/);
 assert.match(studio,/data\.lesson_access==="granted"/);
 assert.match(studio,/l.status==="published"/);
 assert.match(studio,/enrollment==="active"/);
 assert.match(studio,/data\?\.coach_available/);
 assert.match(studio,/savedResponse\?\.ok/);
 assert.match(studio,/WorkshopNotebook/);
 assert.match(studio,/WorkshopTrainerFeedback/);
 assert.match(studio,/submitV2Lesson/);
 assert.match(progress,/backendRequest\("\/v1\/training\/catalog\/ingenierie-produit-ia"\)/);
 assert.match(dashboard,/backendRequest\("\/v1\/training\/catalog\/ingenierie-produit-ia"\)/);
 assert.doesNotMatch(studio,/Math\.random|sessionStorage|useDemo/);
});
test("learner onboarding and dashboard prioritize the active current course",()=>{
 const banner=read("src/components/learner-welcome-banner.tsx");
 const intro=read("src/app/espace/bienvenue/page.tsx");
 const home=read("src/app/espace/apprenant/page.tsx");
 assert.match(home,/pilot=\{pilot\}/);
 assert.match(banner,/pilot\.resumeSlug|pilot\?\.resumeSlug/);
 assert.match(banner,/nextLesson\.slug/);
 assert.match(banner,/Autre réalisation/);
 assert.match(intro,/getV2DashboardPilot\(\)/);
 assert.match(intro,/primaryLesson/);
 assert.match(intro,/Reprendre mon atelier principal/);
 assert.match(intro,/Voir les huit semaines du parcours principal/);
 assert.match(intro,/action=\{saveLearnerPreferences\}/);
});
test("private learner progress and portfolio use official statuses and XP",()=>{
 const progress=read("src/components/v2-learner-progress-panel.tsx");
 const shares=read("src/components/portfolio-publishing.tsx");
 const page=read("src/app/espace/portfolio/page.tsx");
 const publicPage=read("src/app/p/[token]/page.tsx");
 const api=read("src/app/api/portfolio-publication/route.ts");
 assert.match(progress,/status==="approved"/);
 assert.match(progress,/status==="changes_requested"/);
 assert.match(progress,/status==="pending"/);
 assert.match(progress,/progress\.xpTotal\+otherXp/);
 assert.match(page,/requireRole\("learner"\)/);
 assert.match(page,/trainer_approved_with_xp_ledger/);
 assert.match(shares,/include_scores:scores,include_links:links/);
 assert.match(shares,/window.confirm/);
 assert.match(api,/sameOrigin\(request\)/);
 assert.match(publicPage,/robots:\{index:false,follow:false,nocache:true\}/);
});
test("legacy supplementary missions, goals, profile, and mobile navigation remain available",()=>{
 const legacy=read("src/app/espace/atelier/[id]/page.tsx");
 const welcome=read("src/app/espace/bienvenue/page.tsx");
 const account=read("src/app/espace/compte/page.tsx");
 const shell=read("src/components/secure-academy-shell.tsx");
 assert.match(legacy,/requireRole\("learner"\)/);
 assert.match(legacy,/action=\{submitMission\}/);
 assert.match(welcome,/requireRole\("learner"\)/);
 assert.match(account,/requireRole\(\)/);
 assert.match(account,/Modifier mon mot de passe/);
 assert.match(shell,/academy-mobile-bottom/);
 assert.match(shell,/label="Navigation mobile de l'espace personnel"/);
 assert.match(shell,/Mes objectifs/);
 assert.match(shell,/XP autres/);
 assert.match(shell,/Autres missions/);
});
