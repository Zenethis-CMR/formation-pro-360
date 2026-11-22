const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const ts=require("typescript");
const file=path.join(__dirname,"..","src","lib","learner-preferences.ts");
const transpiled=ts.transpileModule(fs.readFileSync(file,"utf8"),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}
}).outputText;
const mod={exports:{}};
vm.runInNewContext(transpiled,{module:mod,exports:mod.exports});
const {parseLearnerPreferences,learnerGoals,learnerLevels,goalLabel}=mod.exports;
const sample={name:"  Alex  ",goal:"web_app",experience:"beginner",minutes:"60"};
test("valid learner preferences are normalized and whitelisted",()=>{
  const parsed=parseLearnerPreferences(sample);
  assert.equal(parsed.valid,true);
  assert.equal(parsed.value.preferred_name,"Alex");
  assert.equal(parsed.value.minutes_per_day,60);
  assert.equal(parsed.value.goal,"web_app");
});
test("an existing learner may supply a 60-character nickname",()=>{
  const parsed=parseLearnerPreferences({...sample,name:"A".repeat(60)});
  assert.equal(parsed.valid,true);
});
test("reject excessively long or missing display name",()=>{
  assert.equal(parseLearnerPreferences({...sample,name:" "}).valid,false);
  assert.equal(parseLearnerPreferences({...sample,name:"X".repeat(61)}).valid,false);
});
test("never accept invented learning goals or skill levels",()=>{
  assert.equal(parseLearnerPreferences({...sample,goal:"trainer"}).valid,false);
  assert.equal(parseLearnerPreferences({...sample,experience:"advanced-admin"}).valid,false);
});
test("daily learning minutes are constrained to allowed durations",()=>{
  for(const min of ["0","5","-60","360","Infinity","NaN"])
    assert.equal(parseLearnerPreferences({...sample,minutes:min}).valid,false,min);
  for(const min of ["30","60","90","120"])
    assert.equal(parseLearnerPreferences({...sample,minutes:min}).valid,true,min);
});
test("every allowed goal and experience is accepted",()=>{
  for(const goal of learnerGoals)for(const level of learnerLevels)
    assert.equal(parseLearnerPreferences({...sample,goal:goal.value,experience:level.value}).valid,true);
});
test("unsupported labels have a safe public fallback",()=>{
  assert.equal(goalLabel("unknown"),"Avancer dans mes compétences");
});
test("new registrations only are directed to welcome without changing existing login",()=>{
  const auth=fs.readFileSync(path.join(__dirname,"..","src","app","auth","actions.ts"),"utf8");
  const callback=fs.readFileSync(path.join(__dirname,"..","src","app","auth","callback","route.ts"),"utf8");
  const role=fs.readFileSync(path.join(__dirname,"..","src","lib","auth","require-role.ts"),"utf8");
  assert.match(auth,/if\(data\.session\) redirect\("\/espace\/bienvenue"\)/);
  assert.match(callback,/flow==="signup" \? "\/espace\/bienvenue"/);
  assert.match(auth,/shouldCreateUser:false/);
  assert.match(role,/\.from\("profiles"\)/);
});
