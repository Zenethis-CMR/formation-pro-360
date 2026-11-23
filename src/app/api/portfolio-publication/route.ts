import {NextRequest} from "next/server";
import {backendRequest,currentUser} from "@/lib/auth/backend";
export const dynamic="force-dynamic";
export const runtime="nodejs";
const api="/v1/training/catalog/ingenierie-produit-ia/portfolio-publication";
const headers={"cache-control":"private, no-store","x-robots-tag":"noindex, nofollow, noarchive"};
const error=(status:number,code:string)=>Response.json({error:code},{status,headers});
const owner=async()=>{
  const user=await currentUser();
  return user?.role==="learner";
};
const sameOrigin=(request:NextRequest)=>
  request.headers.get("origin")===
  (process.env.NODE_ENV==="production"?"https://formation.zenithis.tech":
    new URL(request.url).origin);
export async function GET(){
  if(!await owner())return error(401,"session_required");
  const response=await backendRequest(api).catch(()=>null);
  if(!response)return error(503,"backend_unavailable");
  const body=await response.json().catch(()=>null);
  return Response.json(body||{error:"backend_unavailable"},
    {status:response.status,headers});
}
export async function POST(request:NextRequest){
  if(!sameOrigin(request))return error(403,"invalid_origin");
  if(!await owner())return error(401,"session_required");
  if(request.headers.get("content-type")?.split(";")[0]?.trim()!=="application/json")
    return error(415,"json_required");
  const length=Number(request.headers.get("content-length")||"0");
  if(!Number.isFinite(length)||length>4096)return error(413,"payload_too_large");
  let body:unknown;
  try{body=await request.json();}catch{return error(400,"invalid_json");}
  const response=await backendRequest(api,{method:"POST",body:JSON.stringify(body)}).catch(()=>null);
  if(!response)return error(503,"backend_unavailable");
  const result=await response.json().catch(()=>null);
  return Response.json(result||{error:"backend_unavailable"},{status:response.status,headers});
}
export async function DELETE(request:NextRequest){
  if(!sameOrigin(request))return error(403,"invalid_origin");
  if(!await owner())return error(401,"session_required");
  const response=await backendRequest(api,{method:"DELETE"}).catch(()=>null);
  if(!response)return error(503,"backend_unavailable");
  const result=await response.json().catch(()=>null);
  return Response.json(result||{error:"backend_unavailable"},{status:response.status,headers});
}
