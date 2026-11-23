const test=require("node:test");const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");

test("portfolio is private, learner-only and refuses invented data",()=>{
 const page=read("src/app/espace/portfolio/page.tsx");
 assert.match(page,/requireRole\("learner"\)/);
 assert.match(page,/backendRequest\(/);
 assert.match(page,/ingenierie-produit-ia\/portfolio/);
 assert.match(page,/source==="trainer_approved_with_xp_ledger"/);
 assert.match(page,/candidate\.verified_xp===candidate\.projects\.reduce/);
 assert.match(page,/project.xp===100/);
 assert.match(page,/project.score>=80/);
 assert.match(page,/portfolio_not_available|response\?\.status===403/);
 assert.doesNotMatch(page,/xp_ledger|db\.from\(|Math\.random/);
});
test("portfolio never claims automatic certification and only prints on explicit click",()=>{
 const ui=read("src/components/learner-verified-portfolio.tsx");
 assert.match(ui,/window.print\(\)/);
 assert.match(ui,/onClick=\{\(\)=>window.print\(\)\}/);
 assert.match(ui,/useState\(false\)/);
 assert.match(ui,/Inclure les adresses des projets/);
 assert.match(ui,/Inclure mes descriptions déposées/);
 assert.match(ui,/Portfolio personnel, non diplôme/);
 assert.match(ui,/uniquement les récompenses inscrites en base/i);
 assert.match(ui,/safeUrl\(project.url\)/);
 assert.match(ui,/noopener noreferrer/);
 assert.match(ui,/workshop_notebooks|carnet privé|carnet|coach IA/i);
 assert.doesNotMatch(ui,/fetch\(|localStorage|sessionStorage|setTimeout/);
});
test("portfolio is discoverable in learner navigation, dashboard and progress",()=>{
 const shell=read("src/components/secure-academy-shell.tsx");
 const overview=read("src/components/secure-learner-overview.tsx");
 const progress=read("src/components/v2-learner-progress-panel.tsx");
 assert.match(shell,/label:"Mon portfolio"/);
 assert.match(shell,/\/espace\/portfolio/);
 assert.match(overview,/enrolled&&<section className="portfolio-dashboard-shortcut"/);
 assert.match(progress,/Voir mes réalisations vérifiées/);
 assert.match(progress,/\/espace\/portfolio/);
 const styles=read("src/app/premium.css");
 assert.match(styles,/@media print/);
 assert.match(styles,/body:has\(\.portfolio-page\)/);
});
