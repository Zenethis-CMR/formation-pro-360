const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),ts=require("typescript"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const exportsObject={};
vm.runInNewContext(ts.transpileModule(read("src/lib/universal-learning.ts"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:exportsObject});
const {enrolledTracks,selectEnrolledTrack,parseTrackProgress}=exportsObject;
const tracks=enrolledTracks({tracks:[{slug:"a",title:"A",status:"published",enrollment:"active"},{slug:"b",title:"B",status:"published",enrollment:"completed"},{slug:"c",title:"C",status:"published",enrollment:"paused"},{slug:"d",title:"D",status:"draft",enrollment:"active"},{slug:"e",title:"E",status:"published",enrollment:null}]});
test("only real published enrollments are selectable; invalid URL never falls back",()=>{
 assert.equal(tracks.length,3);
 assert.equal(selectEnrolledTrack(tracks,undefined).slug,"a");
 assert.equal(selectEnrolledTrack(tracks,"b").slug,"b");
 for(const bad of ["c","d","e","../../admin",["a","b"],""])assert.equal(selectEnrolledTrack(tracks,bad),null);
});
test("progress uses only confirmed selected enrollment and exact counters",()=>{
 const data={track:{slug:"a",status:"published"},enrollment:"active",lesson_access:"granted",xp_total:100,progress_summary:{total:16,approved:1,pending:2,changes_requested:0}};
 assert.equal(parseTrackProgress(data,"a").summary.approved,1);
 assert.equal(parseTrackProgress(data,"b"),null);
 assert.equal(parseTrackProgress({...data,enrollment:"paused"},"a"),null);
 assert.equal(parseTrackProgress({...data,lesson_access:"locked"},"a"),null);
 assert.equal(parseTrackProgress({...data,progress_summary:undefined},"a").summary,null);
 assert.equal(parseTrackProgress({...data,progress_summary:{...data.progress_summary,approved:17}},"a").summary,null);
});
test("read-only selector is reachable and requests detail only after permission filtering",()=>{
 const page=read("src/app/espace/apprenant/formations/page.tsx");
 assert.ok(page.includes('await requireRole("learner")'));
 assert.ok(page.includes('selected?await backendRequest'));
 assert.ok(!page.includes('method:"POST"'));
 assert.ok(read("src/app/espace/apprenant/page.tsx").includes('href="/espace/apprenant/formations"'));
});
