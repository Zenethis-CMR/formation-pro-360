import { NextRequest } from "next/server";
import { backendRequest, currentUser } from "@/lib/auth/backend";

export const dynamic="force-dynamic";
export const runtime="nodejs";

type CoachBody={
  lessonId?:string;question:string;
  scope?:"project";consent?:boolean;
  domain?:"projet"|"backlog"|"ux"|"technique"|"qualite"|"business";
  mode?:"commencer"|"debloquer"|"verifier"|"preparer";
  work_summary?:string;
  previous_exchange?:{question:string;answer:string}
};
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const errorJson=(status:number,error:string)=>
  Response.json({error},{status,headers:{"cache-control":"private, no-store"}});

/**
 * A long-running llama.cpp response must never block a Next Server Action.
 * Start an SSE response immediately and keep it alive with real heartbeat
 * events while CT420 waits for its local Qwen3 model. This route cannot read
 * other learners' notes, award XP, or accept a client-defined upstream URL.
 */
export async function POST(request:NextRequest){
  // Browser POSTs include Origin; reject cross-site form posts before reading a session.
  const origin=request.headers.get("origin");
  const allowed=process.env.NODE_ENV==="production"
    ?"https://formation.zenithis.tech":new URL(request.url).origin;
  if(origin!==allowed)return errorJson(403,"invalid_origin");
  if(request.headers.get("content-type")?.split(";")[0]?.trim()!=="application/json")
    return errorJson(415,"json_required");
  const length=Number(request.headers.get("content-length")||"0");
  if(!Number.isFinite(length)||length>5000)return errorJson(413,"request_too_large");

  const user=await currentUser();
  if(!user)return errorJson(401,"unauthenticated");
  if(user.role!=="learner")return errorJson(403,"learner_required");

  let body:CoachBody;
  try{body=await request.json() as CoachBody;}catch{return errorJson(400,"invalid_json");}
  const project=body?.scope==="project";
  if(!body||typeof body!=="object"||Array.isArray(body)||
    (body.scope!==undefined&&!project)||
    (!project&&!uuid.test(String(body.lessonId||"")))||
    typeof body.question!=="string"||
    body.question.trim().length<8||body.question.trim().length>(project?600:1200))
    return errorJson(400,"invalid_question");
  if(project&&(body.consent!==true||body.previous_exchange!==undefined||body.lessonId!==undefined||!body.mode||Object.keys(body).some(key=>!["scope","consent","mode","domain","question","work_summary"].includes(key))))
    return errorJson(400,"invalid_project_consent");
  if(body.mode!==undefined&&
    !(project?["debloquer","verifier","preparer"]:["commencer","debloquer","verifier"]).includes(body.mode))
    return errorJson(400,"invalid_mode");
  if(body.work_summary!==undefined&&
    (typeof body.work_summary!=="string"||body.work_summary.trim().length>400))
    return errorJson(400,"invalid_work_summary");
  const previous=body.previous_exchange;
  if(previous!==undefined&&(
    !previous||typeof previous.question!=="string"||
    typeof previous.answer!=="string"||
    previous.question.trim().length<8||previous.question.trim().length>400||
    previous.answer.trim().length<1||previous.answer.trim().length>800))
    return errorJson(400,"invalid_context");

  if(body.domain!==undefined&&(!project||!["projet","backlog","ux","technique","qualite","business"].includes(body.domain)))return errorJson(400,"invalid_domain");
  const payload={
    ...(project?{consent:true,domain:body.domain??"projet"}:{}),
    question:body.question.trim(),
    ...(body.mode?{mode:body.mode}:{}),
    ...(body.work_summary?.trim()?{work_summary:body.work_summary.trim()}:{}),
    ...(previous?{previous_exchange:{
      question:previous.question.trim(),answer:previous.answer.trim()
    }}:{})
  };
  const encoder=new TextEncoder();
  const controllerAbort=new AbortController();
  let timer:ReturnType<typeof setInterval>|null=null;
  let disconnected=false;
  const stream=new ReadableStream<Uint8Array>({
    start(controller){
      const emit=(event:string,data:Record<string,unknown>)=>{
        if(disconnected)return;
        try{
          controller.enqueue(encoder.encode(
            "event: "+event+"\ndata: "+JSON.stringify(data)+"\n\n"
          ));
        }catch{disconnected=true;controllerAbort.abort();}
      };
      const started=Date.now();
      emit("ready",{status:"connected"});
      timer=setInterval(()=>{
        emit("heartbeat",{elapsed_seconds:Math.floor((Date.now()-started)/1000)});
      },8000);
      void (async()=>{
        try{
          const upstream=await backendRequest(
            project?"/v1/training/catalog/ingenierie-produit-ia/project/coach":
            "/v1/training/catalog/ingenierie-produit-ia/lessons/"+
              body.lessonId+"/coach",
            {
              method:"POST",
              body:JSON.stringify(payload),
              signal:AbortSignal.any([
                controllerAbort.signal,AbortSignal.timeout(125000)
              ])
            }
          );
          if(!upstream.ok){
            if(upstream.status===429){
              const reason=await upstream.json().catch(()=>null) as {error?:string}|null;
              const busy=reason?.error==="coach_busy";
              emit("failure",{status:busy?"busy":"limit",
                message:busy
                  ?"Qwen3 traite déjà une autre demande. Réessaie dans environ 30 secondes."
                  :"La limite de questions rapprochées est atteinte."});
            }else{
              emit("failure",{status:upstream.status===403?"access":"unavailable",
                message:upstream.status===403
                  ?"Ton inscription ne donne pas accès à cette assistance."
                  :"Le modèle local ne répond pas actuellement. Tu peux réessayer plus tard."});
            }
            return;
          }
          const result=await upstream.json() as {answer?:unknown};
          const answer=typeof result?.answer==="string"?result.answer.trim():"";
          if(!answer){
            emit("failure",{status:"unavailable",message:"Le coach n'a pas renvoyé de réponse exploitable."});
            return;
          }
          emit("answer",{answer:answer.slice(0,4000)});
        }catch{
          emit("failure",{status:"unavailable",
            message:"La connexion au coach a été interrompue. Ton atelier reste accessible."});
        }finally{
          if(timer)clearInterval(timer);
          if(!disconnected){
            disconnected=true;
            try{controller.close();}catch{/* client disconnected */}
          }
        }
      })();
    },
    cancel(){
      disconnected=true;
      if(timer)clearInterval(timer);
      controllerAbort.abort();
    }
  });
  return new Response(stream,{headers:{
    "content-type":"text/event-stream; charset=utf-8",
    "cache-control":"private, no-store, no-transform",
    "x-accel-buffering":"no",
    "x-content-type-options":"nosniff"
  }});
}
