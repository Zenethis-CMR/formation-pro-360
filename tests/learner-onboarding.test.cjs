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
const {parseLearnerPreferences,learnerGoals,learnerLevels,learnerDurations,
  goalLabel,formatWeekdays,plannedWeeklyHours}=mod.exports;
const exampleDays=["off","regular","off","regular","off","regular","optional"];
const sample={name:"  Alex  ",goal:"web_app",experience:"beginner",minutes:"300",dayChoices:exampleDays};
test("valid intensive profile requires three recurring days and normalizes the name",()=>{
  const parsed=parseLearnerPreferences(sample);
  assert.equal(parsed.valid,true);
  assert.equal(parsed.value.preferred_name,"Alex");
  assert.equal(parsed.value.minutes_per_day,300);
  assert.equal(parsed.value.goal,"web_app");
  assert.equal(parsed.value.regular_days.join(","),"2,4,6");
  assert.equal(parsed.value.optional_days.join(","),"7");
});
test("an existing learner may supply a 60-character nickname",()=>{
  assert.equal(parseLearnerPreferences({...sample,name:"A".repeat(60)}).valid,true);
});
test("reject missing or oversized display names",()=>{
  assert.equal(parseLearnerPreferences({...sample,name:" "}).valid,false);
  assert.equal(parseLearnerPreferences({...sample,name:"X".repeat(61)}).valid,false);
});
test("never accept invented learning goals or skill levels",()=>{
  assert.equal(parseLearnerPreferences({...sample,goal:"trainer"}).valid,false);
  assert.equal(parseLearnerPreferences({...sample,experience:"admin"}).valid,false);
});
test("daily work session is at least five hours",()=>{
  for(const min of ["0","30","60","90","120","240","299","-60","Infinity","NaN"])
    assert.equal(parseLearnerPreferences({...sample,minutes:min}).valid,false,min);
  for(const min of ["300","360","480","600"])
    assert.equal(parseLearnerPreferences({...sample,minutes:min}).valid,true,min);
  assert.equal(learnerDurations.join(","),"300,360,480,600");
});
test("three weekdays are mandatory for a recurring schedule",()=>{
  assert.equal(parseLearnerPreferences({...sample,dayChoices:["regular","off","off","off","off","off","off"]}).valid,false);
  assert.equal(parseLearnerPreferences({...sample,dayChoices:["regular","regular","off","off","off","off","off"]}).valid,false);
  assert.equal(parseLearnerPreferences({...sample,dayChoices:["regular","regular","regular","off","off","off","off"]}).valid,true);
});
test("allows every weekday as regular and Sunday as optional",()=>{
  assert.equal(parseLearnerPreferences({...sample,dayChoices:Array(7).fill("regular")}).valid,true);
  assert.equal(parseLearnerPreferences(sample).value.optional_days[0],7);
});
test("disallow malformed weekday option or missing fields",()=>{
  assert.equal(parseLearnerPreferences({...sample,dayChoices:["regular","regular","regular","off","off","off","hijack"]}).valid,false);
  assert.equal(parseLearnerPreferences({...sample,dayChoices:["regular","regular","regular"]}).valid,false);
});
test("all documented goal and experience choices are valid",()=>{
  for(const goal of learnerGoals)for(const level of learnerLevels)
    assert.equal(parseLearnerPreferences({...sample,goal:goal.value,experience:level.value}).valid,true);
});
test("weekly hours and weekdays are calculated from real selected recurring days",()=>{
  const value=parseLearnerPreferences(sample).value;
  assert.equal(plannedWeeklyHours(value),15);
  assert.equal(formatWeekdays(value.regular_days),"Mar., Jeu., Sam.");
  assert.equal(plannedWeeklyHours({...value,regular_days:null}),null);
});
test("fallback label remains safe",()=>{
  assert.equal(goalLabel("unknown"),"Construire un produit");
});
test("new registrations still preserve existing login accounts",()=>{
  const auth=fs.readFileSync(path.join(__dirname,"..","src","app","auth","actions.ts"),"utf8");
  const callback=fs.readFileSync(path.join(__dirname,"..","src","app","auth","callback","route.ts"),"utf8");
  const role=fs.readFileSync(path.join(__dirname,"..","src","lib","auth","require-role.ts"),"utf8");
  assert.match(auth,/if\(data\.session\) redirect\("\/espace\/bienvenue"\)/);
  assert.match(callback,/flow==="signup" \? "\/espace\/bienvenue"/);
  assert.match(auth,/shouldCreateUser:false/);
  assert.match(role,/\.from\("profiles"\)/);
});
