const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),ts=require("typescript");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const load=(file,deps={})=>{const e={};const output=ts.transpileModule(read(file),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(output,{exports:e,require:n=>{if(!(n in deps))throw Error(n);return deps[n];},URL});return e;};
const project=load("src/lib/learner-product-project.ts");
const {isVerified,reportMetrics,reportWeeks,reportMilestones,csvCell,reportCsv}=load("src/lib/learning-report.ts",{"./learner-product-project":project});
const base={slug:"valider-probleme",title:"Vérifier le problème",week:1,module_title:"Comprendre",skills:["UX"],status:"verified",score:88,xp:100,evidence_id:"proof",attempt_count:2};
test("official proof requires approved score and ledger evidence, not a declared or pending result",()=>{
 const missing={...base,slug:"prd-prototype",status:"not_started",score:null,xp:0,evidence_id:null,attempt_count:0};
 const invalid={...base,slug:"architecture-repo",week:2,evidence_id:null,score:99};
 const pending={...base,slug:"flux-deploye",week:2,status:"pending",score:null,xp:0,evidence_id:null,attempt_count:1};
 assert.equal(isVerified(base),true);assert.equal(isVerified(invalid),false);
 const m=reportMetrics([base,missing,invalid,pending]);
 assert.equal(m.verified,1);assert.equal(m.xp,100);assert.equal(m.average,88);assert.equal(m.total,4);assert.equal(m.pending,1);
 assert.equal(reportMetrics([missing]).average,null);
 assert.equal(reportWeeks([base,missing,invalid,pending])[0].verified,1);
 assert.equal(reportMilestones([base])[0].available,false);
 assert.equal(reportMilestones([base,missing,invalid,pending])[0].available,true);
 assert.equal(reportMilestones([base,missing,invalid,pending])[0].count,1);
});
test("CSV escapes formula-like values, preserves missing score and avoids unverified XP",()=>{
 assert.equal(csvCell("=1+1"),"\"'=1+1\"");assert.equal(csvCell("  @SUM(1)"),"\"'  @SUM(1)\"");
 assert.equal(csvCell(null),'""');assert.equal(csvCell('a"b'),'"a""b"');
 const output=reportCsv({course_title:"Parcours",learner:{name:"=TEST",id:"id"},generated_at:"2026-11-24",source:"official_workshop_submissions_and_xp",workshops:[{...base,score:null,status:"pending",evidence_id:null}],supplementary:null});
 assert.ok(output.includes("'=TEST"));assert.ok(output.includes('"En correction";"";"0"'));
});
test("private report UX includes role boundaries, full print and authoritative disclaimers",()=>{
 const trainer=read("src/app/espace/formateur/bilan/page.tsx"),learner=read("src/app/espace/apprenant/bilan/page.tsx"),ui=read("src/components/learning-report-view.tsx");
 assert.ok(trainer.includes('requireRole("trainer")'));assert.ok(learner.includes('requireRole("learner")'));
 assert.ok(!learner.includes("learning-report?learner_id"));
 for(const s of ["window.print()","reportCsv(report)","pas un niveau de maîtrise","Aucun dépôt","HORS XP","isVerified(w)"])assert.ok(ui.includes(s),s);
 assert.ok(read("src/app/espace/formateur/suivi/page.tsx").includes("Matrice des réalisations"));
 assert.ok(read("src/app/espace/bilan/report.css").includes(".lr-workshops .lr-filtered{display:flex!important}"));
});
