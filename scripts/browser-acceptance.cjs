// Isolated browser acceptance. No production accounts, secrets or writes.
const {chromium}=require("playwright");
const {createServer}=require("node:http");
const {spawn}=require("node:child_process");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const slug="design-produit-ux-ui-motion", title="Design produit · fixture QA";
const learnerId="10000000-0000-4000-8000-000000000001",trainerId="10000000-0000-4000-8000-000000000002";
const mid="20000000-0000-4000-8000-000000000001",lid="30000000-0000-4000-8000-000000000001";
const text="Consigne synthétique de recette : vérifier le résultat attendu.";
const track={slug,title,summary:"Programme synthétique pour la recette.",status:"published",enrollment:"active",enrollment_open:false,module_count:1,lesson_count:1};
const detail={track,enrollment:"active",lesson_access:"granted",xp_total:0,progress_summary:{total:1,approved:0,pending:0,changes_requested:0},workshop_states:[{module_id:mid,lesson_slug:"prototype",status:"not_started"}],modules:[{id:mid,slug:"module-design",title:"Module design",outcome:text,week:1,skills:["Prototype"]}],lessons:[{id:lid,module_id:mid,slug:"prototype",title:"Construire le prototype QA",version:1,status:"published",objective:text,guided_work:text,independent_work:text,evidence_required:text,rubric:["Qualité","Accessibilité","Tests","Documentation"],published_curriculum:{source:"sealed_release",release_version:1,minutes:60,demonstration:text,ai_context:text,ai_procedure:text,ai_verification:text,resources:""}}],submissions:[],notebook_available:true,coach_available:false,evaluation_open:true};
const cockpit={source:"official_training_cockpit",tracks:[{slug,title,status:"published",metrics:{enrollments:1,active:1,completed:0,workshops:1,pending:1,rework:0,verified:0,xp:0}}]};
const prefs={learner_id:learnerId,preferred_name:"Apprenant QA",goal:"first_site",experience:"beginner",regular_days:[1,3,5],optional_days:[],minutes_per_day:300};
const fixture=createServer((req,res)=>{
 const u=new URL(req.url,"http://127.0.0.1");
 const headers=String(req.headers.cookie||"")+" "+String(req.headers.authorization||"");
 const role=headers.includes("qa-trainer")?"trainer":headers.includes("qa-learner")?"learner":null;
 const user={id:role==="trainer"?trainerId:learnerId,email:"qa@example.invalid",role};
 const json=(body,status=200)=>{res.writeHead(status,{"content-type":"application/json"});res.end(JSON.stringify(body));};
 if(u.pathname==="/v1/auth/session-context")return role?json({user,accessToken:"qa-"+role}):json({error:"unauthenticated"},401);
 if(!role)return json({error:"unauthenticated"},401);
 if(u.pathname.startsWith("/rest/v1/")){
  const table=u.pathname.split("/").pop();
  const rows=table==="profiles"?[{id:user.id,role}]:table==="learner_preferences"&&role==="learner"?[prefs]:[];
  res.setHeader("content-range",rows.length?"0-0/"+rows.length:"*/0");
  if(req.method==="HEAD"){res.writeHead(200);return res.end();}
  if(String(req.headers.accept).includes("vnd.pgrst.object+json"))return json(rows[0]??null);
  return json(rows);
 }
 if(u.pathname==="/v1/training/catalog")return json({tracks:[{...track,enrollment:role==="learner"?"active":null}]});
 if(u.pathname==="/v1/training/trainer-cockpit")return role==="trainer"?json(cockpit):json({error:"forbidden"},403);
 if(u.pathname==="/v1/training/catalog/"+slug)return json(detail);
 if(u.pathname.startsWith("/v1/training/catalog/"+slug+"/")){
  const endpoint=u.pathname.slice(("/v1/training/catalog/"+slug+"/").length);
  if(endpoint.endsWith("/notebook"))return json({notebook:{notes:"",next_action:"",reference_url:null,completed_steps:[],updated_at:null}});
  const list={course_slug:slug,page:1,has_next:false};
  if(endpoint==="project")return json({editable:true,project:null});
  if(endpoint==="backlog")return json({course_slug:slug,editable:true,backlog:null});
  if(endpoint==="project-reviews")return json({...list,reviews:[],selected:null,can_share:false});
  if(endpoint==="portfolio")return json({source:"trainer_approved_with_xp_ledger",course:{slug,title,summary:text},projects:[],verified_count:0,verified_xp:0});
  if(endpoint==="portfolio-publication")return json({publication:null});
  if(endpoint==="sessions")return json({...list,sessions:[]});
  if(endpoint==="session-participants")return json({course_slug:slug,participants:[{learner_id:learnerId,preferred_name:prefs.preferred_name}],truncated:false});
  if(endpoint==="practice-briefs")return json({...list,briefs:[]});
  if(endpoint==="support")return json({...list,threads:[],can_create:true});
 }
 return json({error:"fixture_unavailable"},404);
});
const origin="http://127.0.0.1:4319";
const all=["ingenierie-produit-ia",slug,"copywriting-communication-contenu-ia","marketing-acquisition-ia","automatisation-integrations-agents-ia","infrastructure-devops-cybersecurite","entrepreneuriat-numerique-monetisation"];
const output=process.env.BROWSER_QA_OUTPUT||"browser-qa";
fs.mkdirSync(output,{recursive:true});
let child,browser;
async function visit(page,url,heading,shot){
 const response=await page.goto(origin+url,{waitUntil:"domcontentloaded"});
 assert.ok(response&&response.ok(),url+" returned "+response?.status());
 await page.getByRole("heading",{name:heading}).first().waitFor({state:"visible",timeout:20000});
 await page.evaluate(()=>document.fonts.ready);
 const width=await page.evaluate(()=>({actual:document.documentElement.scrollWidth,view:window.innerWidth}));
 assert.ok(width.actual<=width.view+3,url+" horizontal overflow "+JSON.stringify(width));
 if(shot)await page.screenshot({path:path.join(output,shot+".png")});
 console.log("PASS "+url+" "+page.viewportSize().width+"px");
}
async function context(width,role){
 const c=await browser.newContext({viewport:{width,height:900},reducedMotion:"reduce"});
 if(role)await c.addCookies([{name:"fp360_session",value:"qa-"+role,url:origin,httpOnly:true}]);
 return c;
}
(async()=>{
 await new Promise(resolve=>fixture.listen(4320,"127.0.0.1",resolve));
 child=spawn(process.execPath,[".next/standalone/server.js"],{env:{...process.env,PORT:"4319",HOSTNAME:"127.0.0.1",FORMATION_API_INTERNAL_URL:"http://127.0.0.1:4320",NEXT_PUBLIC_SITE_URL:origin},stdio:"inherit"});
 for(let i=0;i<60;i++){if(await fetch(origin+"/",{redirect:"manual"}).then(r=>r.ok).catch(()=>false))break;await new Promise(r=>setTimeout(r,500));}
 browser=await chromium.launch({headless:true});
 for(const width of [390,1440]){
  const c=await context(width),page=await c.newPage();
  await visit(page,"/",/Apprends en réalisant/, "home-"+width);
  await visit(page,"/catalogue",/Les formations 360/,"catalogue-"+width);
  for(const s of all)await visit(page,"/catalogue/"+s,/./,s+"-"+width);
  await visit(page,"/login?parcours="+slug,/Bienvenue à nouveau/,"login-"+width);
  await page.getByRole("link",{name:"Inscription",exact:true}).click();
  await page.waitForURL("**/login?mode=inscription&parcours="+slug);
  await page.locator('input[name="parcours"]').waitFor({state:"attached"});
  assert.equal(await page.locator('input[name="parcours"]').inputValue(),slug);
  for(const route of ["/espace/apprenant","/espace/formateur","/espace/bienvenue","/espace/apprenant/formations/"+slug+"/studio","/espace/projet/backlog","/espace/formateur/formations/qualite"]){
   await page.goto(origin+route);assert.equal(new URL(page.url()).pathname,"/login",route+" guard");
  }
  await c.close();
  const lc=await context(width,"learner"),lp=await lc.newPage(),base="/espace/apprenant/formations/"+slug;
  await visit(lp,"/espace/apprenant",/Mon apprentissage/,"learner-"+width);
  await lp.getByRole("heading",{name:title,exact:true}).first().waitFor();
  await visit(lp,"/espace/bienvenue",/Fais évoluer ton parcours/,"onboarding-"+width);
  await visit(lp,base+"/studio",/Construire le prototype QA/,"studio-"+width);
  if(width===390)assert.ok(await lp.locator("#us-workshop-select").isVisible());
  await visit(lp,base+"/projet",/Mon projet/,"project-"+width);
  await visit(lp,"/espace/projet/backlog?parcours="+slug,/Mon backlog/,"backlog-"+width);
  await visit(lp,base+"/portfolio",/Mon portfolio/,"portfolio-"+width);
  await lc.close();
  const tc=await context(width,"trainer"),tp=await tc.newPage();
  await visit(tp,"/espace/formateur",/Centre de pilotage pédagogique/,"trainer-"+width);
  await tp.getByRole("heading",{name:title,exact:true}).waitFor();
  await tc.close();
 }
 console.log("Browser acceptance: public, guarded routes and synthetic learner/trainer UI. No production mutation.");
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();child?.kill();fixture.close();});
