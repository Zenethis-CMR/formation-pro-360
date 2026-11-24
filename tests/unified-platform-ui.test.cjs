const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");

test("one learner-facing product without V1/V2 version labels",()=>{
 const names=[
  "src/components/secure-academy-shell.tsx",
  "src/components/secure-learner-overview.tsx",
  "src/components/v2-learner-progress-panel.tsx",
  "src/components/workspace-tab-heading.tsx",
  "src/app/catalogue/page.tsx",
  "src/app/catalogue/ingenierie-produit-ia/page.tsx",
  "src/app/espace/formateur/corrections-v2/page.tsx"
 ];
 for(const name of names){
  const s=read(name);
  // Identifier/route/stylesheet names can contain V1/V2 for data compatibility.
  // Public UI copy should use non-versioned phrases.
  assert.doesNotMatch(s,/(?:PARCOURS|PILOTE|FORMATION|PROGRAMME|CATALOGUE|CORRECTIONS|XP|MISSIONS|ACQUIS) (?:V1|V2)\b/);
 }
 const shell=read("src/components/secure-academy-shell.tsx");
 assert.match(shell,/label:"Mes formations"/);
 assert.match(shell,/activeCourseHref\(stats\)/);
 assert.match(shell,/label:"Corriger les ateliers"/);
 assert.match(shell,/label:"Mes réalisations"/);
 assert.match(shell,/label:"Catalogue"/);
 const overview=read("src/components/secure-learner-overview.tsx");
 assert.match(overview,/XP DU PARCOURS/);
 assert.match(overview,/XP CUMULÉS/);
 assert.ok(overview.indexOf("XP DU PARCOURS")<overview.indexOf("learner-legacy-details"));
 assert.ok(overview.indexOf("XP CUMULÉS")>overview.indexOf("learner-legacy-details"));
 assert.match(overview,/xp\+pilot.xp/);
 assert.match(overview,/XP de tes autres réalisations/);
});
test("canonical corrections route reuses protected workflow without removing old bookmarks",()=>{
 const route=read("src/app/espace/formateur/corrections/page.tsx");
 const old=read("src/app/espace/formateur/corrections-v2/page.tsx");
 assert.match(route,/export \{ default \} from "\.\.\/corrections-v2\/page"/);
 assert.match(old,/requireRole\("trainer"\)/);
 const actions=read("src/app/espace/actions.ts");
 assert.match(actions,/const path="\/espace\/formateur\/corrections"/);
});
