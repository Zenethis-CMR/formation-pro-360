"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";

const idPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const learnerPath = "/espace/apprenant";
const trainerPath = "/espace/formateur";

export async function submitMission(formData: FormData) {
  const {supabase, user} = await requireRole("learner");
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
  const {error} = await supabase.from("submissions").insert({
    mission_id: missionId, learner_id: user.id, url: link.href, note
  });
  if (error) redirect(backTo+"?error=submission");
  revalidatePath(learnerPath);
  revalidatePath(backTo);
  redirect(backTo+"?success=sent");
}

export async function completeWorkshopStep(formData: FormData) {
  const {supabase,user}=await requireRole("learner");
  const missionId=String(formData.get("missionId")||"");
  const stepText=String(formData.get("step")||"");
  if(!idPattern.test(missionId)|| !/^[1-8]$/.test(stepText)) {
    redirect(learnerPath+"?error=invalid");
  }
  const workshopPath="/espace/atelier/"+missionId;
  const {error}=await supabase.from("workshop_steps").insert({
    mission_id:missionId, learner_id:user.id, step_number:Number(stepText)
  });
  if(error && error.code!=="23505") redirect(workshopPath+"?error=step");
  revalidatePath(workshopPath);
  redirect(workshopPath+"?success=step");
}

export async function reviewMission(formData: FormData) {
  const {supabase} = await requireRole("trainer");
  const submissionId = String(formData.get("submissionId") || "");
  const scoreText = String(formData.get("score") ?? "");
  const score = Number(scoreText);
  const feedback = String(formData.get("feedback") || "").trim();
  if (!idPattern.test(submissionId) || !/^\d{1,3}$/.test(scoreText) || !Number.isInteger(score) ||
      score < 0 || score > 100 || feedback.length < 3 || feedback.length > 1500) {
    redirect(trainerPath+"?error=invalid");
  }
  const {error} = await supabase.rpc("review_submission", {
    p_submission_id: submissionId, p_score: score, p_feedback: feedback
  });
  if (error) redirect(trainerPath+"?error=review");
  revalidatePath(trainerPath);
  revalidatePath(learnerPath);
  redirect(trainerPath+"?success=reviewed");
}

export async function createMission(formData: FormData) {
  const {supabase} = await requireRole("trainer");
  const title = String(formData.get("title") || "").trim();
  const domain = String(formData.get("domain") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const deliverable = String(formData.get("deliverable") || "").trim();
  const week = Number(formData.get("week"));
  const xp = Number(formData.get("xp"));
  if (title.length < 3 || title.length > 110 || domain.length < 2 || domain.length > 80 ||
      description.length < 10 || description.length > 1500 || deliverable.length < 3 || deliverable.length > 500 ||
      !Number.isInteger(week) || week < 1 || week > 52 || !Number.isInteger(xp) || xp < 10 || xp > 1000) {
    redirect(trainerPath+"?error=invalid");
  }
  const {error} = await supabase.from("missions").insert({
    title, domain, description, deliverable, week, xp, published:false,
    objectives:[], duration:"À définir"
  });
  if (error) redirect(trainerPath+"?error=create");
  revalidatePath(trainerPath);
  redirect(trainerPath+"?success=created");
}


export async function publishMission(formData: FormData) {
  const {supabase} = await requireRole("trainer");
  const missionId = String(formData.get("missionId") || "");
  if (!idPattern.test(missionId)) redirect(trainerPath+"?error=invalid");
  const {error} = await supabase.from("missions").update({published:true})
    .eq("id",missionId).eq("published",false);
  if (error) redirect(trainerPath+"?error=publish");
  revalidatePath(trainerPath);
  revalidatePath(learnerPath);
  redirect(trainerPath+"?success=published");
}

export async function completeDailyPractice() {
  const {supabase,user}=await requireRole("learner");
  // The database sets the date using Africa/Douala and rejects forged past/future days.
  const {error}=await supabase.from("practice_checkins").insert({learner_id:user.id});
  if(error && error.code !== "23505") redirect(learnerPath+"?error=practice");
  revalidatePath(learnerPath);
  redirect(learnerPath+"?success=practice");
}
