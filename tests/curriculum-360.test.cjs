const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),ts=require("typescript"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
function load(p){const exports={};vm.runInNewContext(ts.transpileModule(read(p),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports});return exports;}
test("seven editorial programs, 56 modules and 112 workshop outlines; new programs have distinct criteria",()=>{
 const {pilotCourse,specializations}=load("src/lib/v2-public-catalog.ts");
 const {specializationPrograms,getSpecializationProgram}=load("src/lib/specialization-programs.ts");
 assert.equal(specializationPrograms.length,6);
 assert.equal(new Set(specializationPrograms.map(p=>p.slug)).size,6);
 let modules=pilotCourse.modules.length,lessons=pilotCourse.modules.reduce((n,m)=>n+m.lessons.length,0),criteria=0;
 for(const track of specializations){const p=getSpecializationProgram(track.slug);assert.ok(p);assert.ok(p.tools&&p.milestones);assert.equal(p.modules.length,8);assert.ok([1,2,3].includes(p.durationWeeks));assert.equal(Math.max(...p.modules.map(m=>m.week)),p.durationWeeks);assert.equal(new Set(p.modules.map(m=>m.week)).size,p.durationWeeks);assert.equal(p.daysPerWeek,5);assert.ok([6,8].includes(p.hoursPerDay));assert.ok(p.aiWorkflow.length>40);
 for(const [i,m] of p.modules.entries()){assert.ok(m.week>=1&&m.week<=p.durationWeeks);if(i>0)assert.ok(m.week>=p.modules[i-1].week);assert.ok(m.title&&m.outcome);assert.equal(m.lessons.length,2);modules++;for(const l of m.lessons){assert.ok(l.title&&l.objective&&l.evidence);assert.equal(l.criteria.length,4);assert.equal(new Set(l.criteria).size,4);lessons++;criteria+=l.criteria.length;}}
 assert.equal(new Set(p.modules.flatMap(m=>m.lessons.map(l=>l.slug))).size,16);}
 assert.equal(modules,56);assert.equal(lessons,112);assert.equal(criteria,384);assert.equal(getSpecializationProgram("unknown"),undefined);
});
test("public previews do not grant enrollment or XP",()=>{const page=read("src/app/catalogue/[slug]/page.tsx"),catalog=read("src/app/catalogue/page.tsx");assert.ok(page.includes("INSCRIPTIONS FERMÉES"));assert.ok(page.includes("notFound()"));assert.ok(!page.includes("/enroll"));assert.ok(!page.includes("submitV2Lesson"));assert.ok(catalog.includes('href={"/catalogue/"+track.slug}'));assert.ok(catalog.includes("Rejoindre le pilote"));});

test("intensive specializations use distinct target durations and real outcomes",()=>{const {getSpecializationProgram}=load("src/lib/specialization-programs.ts");for(const [slug,weeks] of Object.entries({"design-produit-ux-ui-motion":2,"copywriting-communication-contenu-ia":1,"marketing-acquisition-ia":2,"automatisation-integrations-agents-ia":2,"infrastructure-devops-cybersecurite":3,"entrepreneuriat-numerique-monetisation":1})){assert.equal(getSpecializationProgram(slug).durationWeeks,weeks);}const page=read("src/app/catalogue/[slug]/page.tsx");assert.ok(page.includes("trainingHours(plan)"));assert.ok(page.includes("program.aiWorkflow"));assert.ok(page.includes("moduleIndex*2+i+1"));assert.ok(!page.includes("8 semaines prévues"));});
