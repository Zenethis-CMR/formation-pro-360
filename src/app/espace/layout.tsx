import "./workspace-v3.css";
import "./dashboard-v5.css";
import "./workspace-sidebars.css";
import "./workspace-excellence.css";
import { loadLearningContext,loadLearningDetail } from "@/lib/active-learning-context";
import {loadTrainerCockpit} from "@/lib/trainer-cockpit";
import { requireRole } from "@/lib/auth/require-role";
import { SecureAcademyShell, type SecureWorkspaceStats } from "@/components/secure-academy-shell";

type Mission={id:string;title:string};
type Dependency={mission_id:string;prerequisite_id:string};
type Submission={mission_id:string;status:string;created_at:string};
export default async function SecureWorkspaceLayout({children}:{children:React.ReactNode}) {
  const {role,db,user}=await requireRole();
  let stats:SecureWorkspaceStats={
    role,displayName:null,missionCount:0,approvedCount:0,xp:0,pending:0,learners:0,nextTitle:null,nextHref:null
  };
  if(role==="learner"){
    const [missionsR,awardsR,subsR,depsR,prefsR,learning]=await Promise.all([
      db.from("missions").select("id,title").eq("published",true).order("week").order("created_at"),
      db.from("xp_ledger").select("mission_id,xp").eq("learner_id",user.id),
      db.from("submissions").select("mission_id,status,created_at").eq("learner_id",user.id).order("created_at",{ascending:false}),
      db.from("mission_prerequisites").select("mission_id,prerequisite_id"),
      db.from("learner_preferences").select("preferred_name").eq("learner_id",user.id).maybeSingle(),
      loadLearningContext()
    ]);
    const legacyAvailable=!missionsR.error&&!awardsR.error&&!subsR.error&&!depsR.error;
    const detail=learning.active?await loadLearningDetail(learning.active.slug):null;
    const missions=(missionsR.data||[]) as Mission[];
    const approved=new Set((awardsR.data||[]).map(a=>a.mission_id));
    const submissions=(subsR.data||[]) as Submission[];
    const deps=(depsR.data||[]) as Dependency[];
    const latest=new Map<string,Submission>();
    for(const s of submissions)if(!latest.has(s.mission_id))latest.set(s.mission_id,s);
    const available=missions.find(m=>!approved.has(m.id)&&
      !deps.some(d=>d.mission_id===m.id&&!approved.has(d.prerequisite_id))&&
      latest.get(m.id)?.status!=="pending");
    const awaiting=missions.find(m=>latest.get(m.id)?.status==="pending");
    const next=available||awaiting;
    stats={
      ...stats,
      legacyAvailable,
      courseStats:detail?.progress.summary?{...detail.progress.summary,xp:detail.progress.xp}:null,
      displayName:prefsR.error?null:prefsR.data?.preferred_name??null,
      activeTrack:learning.active?{slug:learning.active.slug,title:learning.active.title}:null,
      missionCount:missions.length,
      approvedCount:approved.size,
      xp:(awardsR.data||[]).reduce((sum,a)=>sum+Number(a.xp),0),
      pending:submissions.filter(s=>s.status==="pending").length,
      nextTitle:next?.title??null,
      nextHref:next?"/espace/atelier/"+next.id:"/espace/apprenant?onglet=missions"
    };
  }else{
    const [countR,missionR,subsR,cockpit]=await Promise.all([
      db.from("profiles").select("id",{head:true,count:"exact"}).eq("role","learner"),
      db.from("missions").select("id",{head:true,count:"exact"}).eq("published",true),
      db.from("submissions").select("id",{head:true,count:"exact"}).eq("status","pending"),loadTrainerCockpit()
    ]);
    const legacyAvailable=!countR.error&&!missionR.error&&!subsR.error;
    const officialPending=cockpit?cockpit.reduce((n,t)=>n+(t.metrics?.pending??0),0):null;
    stats={...stats,legacyAvailable,officialPending,learners:countR.count??0,missionCount:missionR.count??0,pending:subsR.count??0,
      nextTitle:(subsR.count??0)>0?(subsR.count??0)+" livrable(s) à corriger":"Aucune correction en attente",
      nextHref:"/espace/formateur?onglet=evaluations"};
  }
  return <SecureAcademyShell stats={stats}>{children}</SecureAcademyShell>;
}
