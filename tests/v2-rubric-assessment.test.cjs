const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("V2 trainer scoring is based on real proof and published lesson details",()=>{
  const page=read("src/app/espace/formateur/corrections-v2/page.tsx");
  assert.match(page,/v2WorkshopGuides\[item.lesson_slug\]/);
  assert.match(page,/item.evidence_required/);
  assert.match(page,/item.rubric/);
  assert.match(page,/action=\{reviewV2Lesson\}/);
  assert.match(page,/4 × 25/);
});
test("four criterion values are recomputed and validated on the server",()=>{
  const action=read("src/app/espace/actions.ts");
  const part=action.slice(action.indexOf("export async function reviewV2Lesson"));
  assert.match(part,/criterionValues=\[0,1,2,3\]/);
  assert.match(part,/Number\(v\)>25/);
  assert.match(part,/points.reduce\(\(sum,value\)=>sum\+value,0\)/);
  assert.match(part,/recordedFeedback=feedback/);
  assert.match(part,/recordedFeedback.length>1500/);
  assert.match(part,/body:JSON.stringify\(\{score,feedback:recordedFeedback\}\)/);
  const client=read("src/components/v2-trainer-score-inputs.tsx");
  assert.match(client,/useState/);
  assert.match(client,/min=\{0\} max=\{25\}/);
  assert.match(client,/aria-live="polite"/);
  assert.doesNotMatch(client,/xp_ledger|v2_lesson_xp|fetch\(/);
});
