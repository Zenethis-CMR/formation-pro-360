const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");

test("V2 preview is opt-in and only queried from trainer programme tab",()=>{
  const source=read("src/app/espace/formateur/page.tsx");
  assert.ok(source.includes('await requireRole("trainer")'));
  assert.ok(source.includes('tab==="programme" && process.env.FORMATION_V2_PREVIEW_ENABLED==="true"'));
  assert.ok(source.includes('if(showV2Preview){'));
  assert.ok(source.includes('db.from("training_tracks")'));
  assert.ok(source.includes('db.from("track_modules")'));
  assert.ok(source.includes('db.from("module_lessons")'));
  assert.ok(source.includes('<V2TrainerCoursePreview course={v2Course} unavailable={v2Unavailable}/>'));
});

test("V2 preview never publishes or enrolls learners",()=>{
  const component=read("src/components/v2-trainer-course-preview.tsx");
  assert.ok(component.includes("Lecture seule"));
  assert.ok(component.includes("Brouillon non publié"));
  assert.ok(component.includes("aucune inscription"));
  assert.ok(!component.includes('action={'));
  assert.ok(!component.includes('use client'));
});

test("feature flag is disabled by default in deployment template",()=>{
  const env=read("deploy/frontend.env.example");
  assert.ok(env.includes("FORMATION_V2_PREVIEW_ENABLED=false"));
});
