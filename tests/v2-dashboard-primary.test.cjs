const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
test("V2 pilot is the primary learner hero and V1 metrics stay separate",()=>{
  const home=read("src/app/espace/apprenant/page.tsx");
  const view=read("src/components/secure-learner-overview.tsx");
  assert.match(home,/getV2DashboardPilot\(\)/);
  assert.match(home,/pilot=\{pilot\}/);
  assert.match(view,/Ingénierie produit/);
  assert.match(view,/Rejoindre le pilote gratuit/);
  assert.match(view,/Continuer mes ateliers/);
  assert.match(view,/XP historiques V1/);
  assert.match(view,/XP GAGNÉS EN V2/);
  assert.ok(view.indexOf("academy-feature-v2")<view.indexOf("v2-legacy-heading"));
  assert.doesNotMatch(view,/Développement web<br\/>/);
});
test("progression and enrollment are session-derived and fail closed",()=>{
  const s=read("src/lib/v2-dashboard-pilot.ts");
  assert.match(s,/backendRequest\("\/v1\/training\/catalog\/ingenierie-produit-ia"\)/);
  assert.match(s,/data.enrollment_open===true/);
  assert.match(s,/data.track\?\.status!=="published"/);
  assert.match(s,/catch\{return unavailable;\}/);
  assert.doesNotMatch(s,/xp_ledger/);
});
