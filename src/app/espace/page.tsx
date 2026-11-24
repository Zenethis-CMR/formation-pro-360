import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/require-role";
import {publicCourseChoice,learnerCourseDestination} from "@/lib/public-course-choice";
import { isBackendConfigured } from "@/lib/database/server";

export default async function Espace({searchParams}:{searchParams:Promise<{parcours?:string|string[]}>}) {
  // Fail closed: the private workspace never renders public application content.
  if(!isBackendConfigured()) redirect("/login?error=setup");
  const {role}=await requireRole();
  const choice=publicCourseChoice((await searchParams).parcours);
  redirect(role==="trainer"?"/espace/formateur":learnerCourseDestination(choice));
}
