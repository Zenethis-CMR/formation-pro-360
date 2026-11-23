const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("V2 workspace fetches the authenticated catalog and fails closed",()=>{
  const code=read("src/app/espace/parcours/ingenierie-produit-ia/page.tsx");
  assert.match(code,/requireRole\("learner"\)/);
  assert.match(code,/backendRequest\("\/v1\/training\/catalog\/ingenierie-produit-ia"\)/);
  assert.match(code,/const canRead=data\?\.lesson_access==="granted"/);
  assert.match(code,/canRead\?/);
  assert.match(code,/enrollment_open&&!status/);
  assert.match(code,/enrollInV2Pilot/);
  assert.match(code,/contenu détaillé|programme est consultable/i);
});
test("enrollment is mediated by Next.js server action and never writes XP",()=>{
  const actions=read("src/app/espace/actions.ts");
  const start=actions.indexOf("export async function enrollInV2Pilot");
  assert.ok(start>0);
  const block=actions.slice(start);
  assert.match(block,/requireRole\("learner"\)/);
  assert.match(block,/acceptFreePilot:true/);
  assert.match(block,/backendRequest/);
  assert.doesNotMatch(block,/db\.from\(|xp_ledger/);
});
