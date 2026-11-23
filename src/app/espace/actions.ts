"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import { backendRequest } from "@/lib/auth/backend";
import { parseLearnerPreferences } from "@/lib/learner-preferences";

const idPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const learnerPath = "/espace/apprenant";
const trainerPath = "/espace/formateur";

export async function submitMission(formData: FormData) {
  const {db, user} = await requireRole("learner");
  const missionId = String(formData.get("missionId") || "");
  const source = String(formData.get("source") || "");
  const backTo = idPattern.test(missionId) && source==="atelier"
    ? "/espace/atelier/"+missionId : learnerPath;
  const url = String(formData.get("url") || "").trim();
  const note = String(formData.get("note") || "").trim();
  if (!idPattern.test(missionId) || url.length > 800 || note.length > 1200) {
    redirect(backTo+"?error=invalid");
  }
  let link: URL;
  try { link = new URL(url); } catch { redirect(backTo+"?error=invalid"); }
  if (!["http:","https:"].includes(link.protocol)) redirect(backTo+"?error=invalid");
  const {error} = await db.from("submissions").insert({
    mission_id: missionId, learner_id: user.id, url: link.href, note
  });
  if (error) redirect(backTo+"?error=submission");
  revalidatePath(learnerPath);
  revalidatePath(backTo);
  redirect(backTo+"?success=sent");
}

export async function completeWorkshopStep(formData: FormData) {
  const {db,user}=await requireRole("learner");
  const missionId=String(formData.get("missionId")||"");
  const stepText=String(formData.get("step")||"");
  if(!idPattern.test(missionId)|| !/^[1-8]$/.test(stepText)) {
    redirect(learnerPath+"?error=invalid");
  }
  const workshopPath="/espace/atelier/"+missionId;
  const {error}=await db.from("workshop_steps").insert({
    mission_id:missionId, learner_id:user.id, step_number:Number(stepText)
  });
  if(error && error.code!=="23505") redirect(workshopPath+"?error=step");
  revalidatePath(workshopPath);
  redirect(workshopPath+"?success=step");
}

export async function reviewMission(formData: FormData) {
  const {db} = await requireRole("trainer");
  const submissionId=String(formData.get("submissionId")||"");
  const feedback=String(formData.get("feedback")||"").trim();
  if(!idPattern.test(submissionId)||feedback.length<3||feedback.length>1500) {
    redirect(trainerPath+"?onglet=evaluations&error=invalid");
  }
  const {data:submission,error:submissionError}=await db.from("submissions")
    .select("mission_id").eq("id",submissionId).eq("status","pending").maybeSingle();
  if(submissionError||!submission) redirect(trainerPath+"?onglet=evaluations&error=review");

  const {data:guide,error:guideError}=await db.from("mission_guides")
    .select("rubric").eq("mission_id",submission.mission_id).maybeSingle();
  if(guideError) redirect(trainerPath+"?onglet=evaluations&error=review");

  if(guide && Array.isArray(guide.rubric) && guide.rubric.length===4) {
    const raw=[0,1,2,3].map(index=>String(formData.get("criterion"+index)??""));
    if(raw.some(value=>!/^\d{1,2}$/.test(value)||Number(value)>25)) {
      redirect(trainerPath+"?onglet=evaluations&error=invalid");
    }
    const scores=raw.map(Number);
    const {error}=await db.rpc("review_submission_with_rubric",{
      p_submission_id:submissionId,p_scores:scores,p_feedback:feedback
    });
    if(error) redirect(trainerPath+"?onglet=evaluations&error=review");
  } else {
    // Custom trainer-created missions may not have a guided rubric yet.
    const raw=String(formData.get("score")??"");
    if(!/^\d{1,3}$/.test(raw)||Number(raw)>100) {
      redirect(trainerPath+"?onglet=evaluations&error=invalid");
    }
    const {error}=await db.rpc("review_submission",{
      p_submission_id:submissionId,p_score:Number(raw),p_feedback:feedback
    });
    if(error) redirect(trainerPath+"?onglet=evaluations&error=review");
  }
  revalidatePath(trainerPath);
  revalidatePath(learnerPath);
  revalidatePath("/espace/atelier/"+submission.mission_id);
  redirect(trainerPath+"?onglet=evaluations&success=reviewed");
}

export async function createMission(formData: FormData) {
  const {db} = await requireRole("trainer");
  const title = String(formData.get("title") || "").trim();
  const domain = String(formData.get("domain") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const deliverable = String(formData.get("deliverable") || "").trim();
  const week = Number(formData.get("week"));
  const xp = Number(formData.get("xp"));
  if (title.length < 3 || title.length > 110 || domain.length < 2 || domain.length > 80 ||
      description.length < 10 || description.length > 1500 || deliverable.length < 3 || deliverable.length > 500 ||
      !Number.isInteger(week) || week < 1 || week > 8 || !Number.isInteger(xp) || xp < 10 || xp > 1000) {
    redirect(trainerPath+"?onglet=programme&error=invalid");
  }
  const rawPrerequisite=String(formData.get("prerequisiteId")||"");
  if(rawPrerequisite&&!idPattern.test(rawPrerequisite)) redirect(trainerPath+"?onglet=programme&error=invalid");
  const {error} = await db.rpc("create_trainer_mission",{
    p_title:title,p_domain:domain,p_description:description,p_deliverable:deliverable,
    p_week:week,p_xp:xp,p_prerequisite_id:rawPrerequisite||null
  });
  if (error) redirect(trainerPath+"?onglet=programme&error=create");
  revalidatePath(trainerPath);
  redirect(trainerPath+"?onglet=programme&success=created");
}


export async function publishMission(formData: FormData) {
  const {db} = await requireRole("trainer");
  const missionId = String(formData.get("missionId") || "");
  if (!idPattern.test(missionId)) redirect(trainerPath+"?onglet=programme&error=invalid");
  const {error} = await db.from("missions").update({published:true})
    .eq("id",missionId).eq("published",false);
  if (error) redirect(trainerPath+"?onglet=programme&error=publish");
  revalidatePath(trainerPath);
  revalidatePath(learnerPath);
  redirect(trainerPath+"?onglet=programme&success=published");
}

export async function completeDailyPractice() {
  const {db,user}=await requireRole("learner");
  // The database sets the date using Africa/Douala and rejects forged past/future days.
  const {error}=await db.from("practice_checkins").insert({learner_id:user.id});
  if(error && error.code !== "23505") redirect(learnerPath+"?onglet=progression&error=practice");
  revalidatePath(learnerPath);
  redirect(learnerPath+"?onglet=progression&success=practice");
}

export async function saveTrainingStartDate(formData:FormData) {
  const {db,user}=await requireRole("trainer");
  const startDate=String(formData.get("startDate")||"");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) redirect(trainerPath+"?onglet=programme&error=date");
  const candidate=new Date(startDate+"T12:00:00Z");
  if(!Number.isFinite(candidate.getTime())||candidate.toISOString().slice(0,10)!==startDate||
     startDate<"2024-01-01"||startDate>"2100-12-31") {
    redirect(trainerPath+"?onglet=programme&error=date");
  }
  const {data,error}=await db.from("training_settings").update({
    start_date:startDate,updated_at:new Date().toISOString(),updated_by:user.id
  }).eq("id",true).select("id").single();
  if(error||!data) redirect(trainerPath+"?onglet=programme&error=date");
  revalidatePath(trainerPath);
  revalidatePath(learnerPath);
  redirect(trainerPath+"?onglet=programme&success=calendar");
}

export async function postCoachMessage(formData:FormData) {
  const {db,user}=await requireRole("trainer");
  const learnerId=String(formData.get("learnerId")||"");
  const body=String(formData.get("body")||"").trim();
  if(!idPattern.test(learnerId)||body.length<10||body.length>1200) {
    redirect(trainerPath+"?onglet=apprenants&error=message");
  }
  const {data:learner,error:lookupError}=await db.from("profiles")
    .select("id").eq("id",learnerId).eq("role","learner").maybeSingle();
  if(lookupError||!learner) redirect(trainerPath+"?onglet=apprenants&error=message");
  const {error}=await db.from("coach_messages").insert({
    trainer_id:user.id,learner_id:learnerId,body
  });
  if(error) redirect(trainerPath+"?onglet=apprenants&error=message");
  revalidatePath(trainerPath);
  revalidatePath(learnerPath);
  redirect(trainerPath+"?onglet=apprenants&success=message");
}

export async function saveDraftGuide(formData: FormData) {
  const {db}=await requireRole("trainer");
  const missionId=String(formData.get("missionId")||"");
  const backPath=idPattern.test(missionId)?"/espace/formateur/atelier/"+missionId:trainerPath;
  if(!idPattern.test(missionId)) redirect(trainerPath+"?error=invalid");
  const brief=String(formData.get("brief")||"").trim();
  const hint=String(formData.get("hint")||"").trim();
  const resource=String(formData.get("resourceUrl")||"").trim();
  const steps=[0,1,2,3].map(i=>({
    title:String(formData.get("stepTitle"+i)||"").trim(),
    instruction:String(formData.get("stepInstruction"+i)||"").trim(),
    deliverable:String(formData.get("stepDeliverable"+i)||"").trim()
  }));
  const rubric=[0,1,2,3].map(i=>String(formData.get("rubric"+i)||"").trim());
  if(brief.length<40||brief.length>1200||hint.length<10||hint.length>400||
    steps.some(x=>x.title.length<3||x.title.length>100||x.instruction.length<15||x.instruction.length>500||
      x.deliverable.length<5||x.deliverable.length>250)||
    rubric.some(x=>x.length<10||x.length>220)) redirect(backPath+"?error=invalid");
  let url:URL;
  try {url=new URL(resource);} catch {redirect(backPath+"?error=invalid");}
  if(url.protocol!=="https:"||resource.length>600) redirect(backPath+"?error=invalid");
  const {data:mission,error:missionError}=await db.from("missions")
    .select("id").eq("id",missionId).eq("published",false).maybeSingle();
  if(missionError||!mission) redirect(backPath+"?error=published");
  const {error}=await db.from("mission_guides").upsert({
    mission_id:missionId,brief,steps,rubric,hint,resource_url:resource,
    updated_at:new Date().toISOString()
  },{onConflict:"mission_id"});
  if(error) redirect(backPath+"?error=save");
  revalidatePath(backPath);
  revalidatePath(trainerPath);
  redirect(backPath+"?saved=1");
}

export async function saveLearnerPreferences(formData:FormData) {
  const {db,user}=await requireRole("learner");
  const parsed=parseLearnerPreferences({
    name:String(formData.get("preferredName")||""),
    goal:String(formData.get("goal")||""),
    experience:String(formData.get("experience")||""),
    minutes:String(formData.get("minutesPerDay")||""),
    dayChoices:Array.from({length:7},(_,i)=>String(formData.get("day"+(i+1))||"off"))
  });
  if(!parsed.valid) redirect("/espace/bienvenue?error=invalid");
  // The primary key is the existing Node-authenticated account ID. This updates only
  // optional learning preferences, never their profile role, missions or XP.
  const {error}=await db.from("learner_preferences").upsert({
    learner_id:user.id,...parsed.value,updated_at:new Date().toISOString()
  },{onConflict:"learner_id"});
  if(error) redirect("/espace/bienvenue?error=save");
  revalidatePath("/espace/apprenant");
  revalidatePath("/espace/bienvenue");
  revalidatePath("/espace/formateur");
  redirect("/espace/apprenant?welcome=1");
}

/** V2 pilot is strictly free, opted-in and server-authorized. */
export async function enrollInV2Pilot() {
  await requireRole("learner");
  const destination="/espace/parcours/ingenierie-produit-ia";
  const response=await backendRequest(
    "/v1/training/catalog/ingenierie-produit-ia/enroll",
    {method:"POST",headers:{"content-type":"application/json"},
      body:JSON.stringify({acceptFreePilot:true})}
  ).catch(()=>null);
  if(!response?.ok)redirect(destination+"?inscription=indisponible");
  revalidatePath(destination);
  redirect(destination+"?inscription=confirmee");
}

/** Submission is accepted only by the CT420 API after checking enrollment. */
export async function submitV2Lesson(formData:FormData) {
  await requireRole("learner");
  const path="/espace/parcours/ingenierie-produit-ia";
  const lessonId=String(formData.get("lessonId")||"");
  const url=String(formData.get("url")||"").trim();
  const note=String(formData.get("note")||"").trim();
  if(!idPattern.test(lessonId)||url.length>800||note.length>1200)
    redirect(path+"?livrable=erreur");
  let parsed:URL;
  try{parsed=new URL(url)}catch{redirect(path+"?livrable=erreur")}
  if(!["http:","https:"].includes(parsed.protocol))
    redirect(path+"?livrable=erreur");
  const res=await backendRequest(
    "/v1/training/catalog/ingenierie-produit-ia/lessons/"+lessonId+"/submissions",
    {method:"POST",headers:{"content-type":"application/json"},
      body:JSON.stringify({url:parsed.href,note})}
  ).catch(()=>null);
  if(!res?.ok)redirect(path+"?livrable=erreur");
  revalidatePath(path);
  revalidatePath("/espace/formateur/corrections-v2");
  redirect(path+"?livrable=envoye");
}

/** Review and XP award are one transaction performed by the backend. */
export async function reviewV2Lesson(formData:FormData) {
  await requireRole("trainer");
  const path="/espace/formateur/corrections-v2";
  const id=String(formData.get("submissionId")||"");
  const scoreText=String(formData.get("score")||"");
  const feedback=String(formData.get("feedback")||"").trim();
  if(!idPattern.test(id)|| !/^\d{1,3}$/.test(scoreText)||
    Number(scoreText)>100||feedback.length<3||feedback.length>1500)
    redirect(path+"?correction=erreur");
  const res=await backendRequest(
    "/v1/training/catalog/ingenierie-produit-ia/submissions/"+id+"/review",
    {method:"POST",headers:{"content-type":"application/json"},
      body:JSON.stringify({score:Number(scoreText),feedback})}
  ).catch(()=>null);
  if(!res?.ok)redirect(path+"?correction=erreur");
  revalidatePath(path);
  revalidatePath("/espace/parcours/ingenierie-produit-ia");
  redirect(path+"?correction=validee");
}
