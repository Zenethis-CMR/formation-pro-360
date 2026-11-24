const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("all pedagogical pages use explicit scoped selection and keyed editors",()=>{
 for(const role of ["formateur","apprenant"])for(const page of ["seances","defis","aide"]){
  const s=read("src/app/espace/"+role+"/"+page+"/page.tsx");
  assert.ok(s.includes("pedagogicalContext("));assert.ok(s.includes("key={slug} trackSlug={slug}"));assert.ok(s.includes("course_slug===slug")||s.includes("course_slug!==slug"));
 }
});
test("mutations validate explicit track and page navigation retains it",()=>{
 for(const path of ["formateur/seances","defis","aide"]){const s=read("src/app/espace/"+path+"/actions.ts");assert.ok(s.includes("validPedagogicalSlug(trackSlug)"));assert.ok(s.includes("encodeURIComponent(trackSlug)"));}
 for(const name of ["practical-session-agenda","personal-practice-board","learner-support-center"]){const s=read("src/components/"+name+".tsx");assert.ok(s.includes('"?parcours="+encodeURIComponent(trackSlug)+"&page="'));}
 const ctx=read("src/lib/pedagogical-context.ts");
 assert.ok(ctx.includes('l.status!=="published"'));assert.ok(ctx.includes("values.filter(x=>x.slug===l.slug).length===1"));
});
