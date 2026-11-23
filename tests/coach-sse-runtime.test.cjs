const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const ts=require("typescript");

const source=fs.readFileSync(path.join(__dirname,"..","src/app/api/coach/route.ts"),"utf8");
// Exercise the genuine production route function against deterministic fake CT420
// responses, including the streaming lifecycle, without any network or secrets.
const compiled=ts.transpileModule(source,{compilerOptions:{
  module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,
  esModuleInterop:true
}}).outputText;
const id="00000000-0000-4000-8000-000000000000";
const valid={lessonId:id,question:"Comment vérifier mon travail en ligne ?"};
const endpoint="/v1/training/catalog/ingenierie-produit-ia/lessons/"+id+"/coach";

function makeRoute({user={id:"ci-learner",role:"learner"},upstream}={}){
  const exports={};
  const dependency={
    currentUser:async()=>user,
    backendRequest:upstream||async()=>new Response(
      JSON.stringify({answer:"Piste : teste un scénario et documente la preuve."}),
      {status:200,headers:{"content-type":"application/json"}})
  };
  vm.runInNewContext(compiled,{
    exports,
    require(name){
      if(name==="@/lib/auth/backend")return dependency;
      if(name==="next/server")return {};
      throw new Error("Unexpected imported dependency: "+name);
    },
    process:{env:{NODE_ENV:"production"}},
    TextEncoder,ReadableStream,Response,Headers,URL,AbortSignal,
    setInterval,clearInterval
  },{filename:"src/app/api/coach/route.ts",timeout:2500});
  return exports.POST;
}
function fakeRequest(data=valid,{origin="https://formation.zenithis.tech",type="application/json"}={}){
  return {
    url:"https://formation.zenithis.tech/api/coach",
    headers:new Headers({"origin":origin,"content-type":type}),
    json:async()=>data
  };
}
test("SSE emits ready and a genuine backend answer through the private route",async()=>{
  let calls=0;
  const POST=makeRoute({upstream:async(path,init)=>{
    calls++;
    assert.equal(path,endpoint);
    assert.equal(init.method,"POST");
    assert.equal(JSON.parse(init.body).question,valid.question);
    return new Response(JSON.stringify({answer:"Piste : mesure ton résultat."}),{status:200});
  }});
  const r=await POST(fakeRequest());
  assert.equal(r.status,200);
  assert.match(r.headers.get("content-type"),/text\/event-stream/);
  assert.equal(r.headers.get("cache-control"),"private, no-store, no-transform");
  const s=await r.text();
  assert.match(s,/event: ready/);
  assert.match(s,/event: answer/);
  assert.match(s,/Piste : mesure ton résultat/);
  assert.equal(calls,1);
});
test("coach refuses wrong origin, missing login, wrong role, and invalid payload",async()=>{
  const never=async()=>{throw Error("Unauthorized coach called CT420");};
  const POST=makeRoute({upstream:never});
  assert.equal((await POST(fakeRequest(valid,{origin:"https://untrusted.example"}))).status,403);
  assert.equal((await makeRoute({user:null,upstream:never})(fakeRequest())).status,401);
  assert.equal((await makeRoute({user:{role:"trainer"},upstream:never})(fakeRequest())).status,403);
  assert.equal((await POST(fakeRequest({...valid,question:"short"}))).status,400);
  assert.equal((await POST(fakeRequest({...valid,
    previous_exchange:{question:"a".repeat(500),answer:"proof"}}))).status,400);
  assert.equal((await POST(fakeRequest(valid,{type:"text/plain"}))).status,415);
});
test("a busy model is a normal SSE failure, never a React crash or leaked body",async()=>{
  const POST=makeRoute({upstream:async()=>new Response(
    JSON.stringify({error:"coach_busy"}),{status:429})});
  const response=await POST(fakeRequest());
  assert.equal(response.status,200);
  const output=await response.text();
  assert.match(output,/event: ready/);
  assert.match(output,/event: failure/);
  assert.match(output,/"status":"busy"/);
  assert.doesNotMatch(output,/coach_busy/);
});
test("a broken CT420 connection emits a terminal failure instead of throwing",async()=>{
  const POST=makeRoute({upstream:async()=>{throw Error("Simulated upstream disconnect");}});
  const response=await POST(fakeRequest());
  assert.equal(response.status,200);
  const output=await response.text();
  assert.match(output,/event: failure/);
  assert.match(output,/La connexion au coach a été interrompue/);
  assert.doesNotMatch(output,/Simulated upstream disconnect/);
});
test("the SSE route forwards only one bounded previous exchange",async()=>{
  const previous_exchange={
    question:"Comment vérifier la première étape ?",
    answer:"Piste : commence avec un test concret."
  };
  const POST=makeRoute({upstream:async(_path,init)=>{
    const data=JSON.parse(init.body);
    assert.deepEqual(data,{question:valid.question,previous_exchange});
    return new Response(JSON.stringify({answer:"Piste : reteste."}),{status:200});
  }});
  const response=await POST(fakeRequest({...valid,previous_exchange}));
  assert.match(await response.text(),/event: answer/);
});
