const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.join(__dirname,"..");
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");

test("authenticated pages use dedicated Academy shell rather than old secure top navbar",()=>{
 const app=read("src/components/app-shell.tsx");
 const layout=read("src/app/espace/layout.tsx");
 assert.doesNotMatch(app,/DemoProvider|useDemo|SecureShell/);
 const home=read("src/app/page.tsx");
 assert.match(home,/redirect\("\/espace"\)/);
 assert.match(layout,/SecureAcademyShell/);
 assert.doesNotMatch(layout,/DemoProvider|useDemo/);
});

test("real sidebar and rail are independent of simulated demo data",()=>{
 const shell=read("src/components/secure-academy-shell.tsx");
 assert.match(shell,/academy-sidebar/);
 assert.match(shell,/academy-rail/);
 assert.match(shell,/academy-mobile-bottom/);
 assert.match(shell,/\/espace\/compte/);
 assert.match(shell,/signOut/);
 assert.doesNotMatch(shell,/useDemo|DemoProvider|Mode démonstration/);
});

test("connected learner overview uses demo sections and real supplied data",()=>{
 const page=read("src/app/espace/apprenant/page.tsx");
 const overview=read("src/components/secure-learner-overview.tsx");
 assert.match(page,/SecureLearnerOverview/);
 assert.match(overview,/academy-feature/);
 assert.match(overview,/academy-metrics/);
 assert.match(overview,/academy-class-list/);
 assert.match(overview,/academy-donut/);
 assert.match(overview,/\/espace\/atelier\//);
 assert.match(overview,/dependencies\.some/);
 assert.doesNotMatch(overview,/useDemo|DemoProvider|Math\.random/);
});

test("trainer design still retains grading and mission authoring forms",()=>{
 const page=read("src/app/espace/formateur/page.tsx");
 assert.match(page,/SecureTrainerOverview/);
 for(const action of ["reviewMission","createMission","publishMission"])
   assert.match(page,new RegExp("action={"+action+"}"));
 assert.match(page,/id="evaluations"/);
 assert.match(page,/id="creation"/);
 assert.match(page,/id="cohorte"/);
});

test("lesson pages continue using secure backend actions",()=>{
 const page=read("src/app/espace/atelier/[id]/page.tsx");
 assert.match(page,/requireRole\("learner"\)/);
 assert.match(page,/action={submitMission}/);
 assert.match(page,/action={completeWorkshopStep}/);
});
