import type { Mission } from "@/data/missions";

export type ReviewStatus = "pending" | "changes_requested" | "approved";
export type Submission = {
  id: string;
  missionId: string;
  url: string;
  note: string;
  submittedAt: string;
  status: ReviewStatus;
  score?: number;
  feedback?: string;
};
export type MissionState = "locked" | "available" | "in_review" | "changes_requested" | "approved";

export function latestSubmission(missionId: string, submissions: Submission[]): Submission | undefined {
  return [...submissions].reverse().find((entry) => entry.missionId === missionId);
}
export function missionState(mission: Mission, submissions: Submission[]): MissionState {
  const approvedIds = new Set(submissions.filter((entry) => entry.status === "approved").map((entry) => entry.missionId));
  const recent = latestSubmission(mission.id, submissions);
  if (recent?.status === "approved") return "approved";
  if (recent?.status === "pending") return "in_review";
  if (recent?.status === "changes_requested") return "changes_requested";
  if (!mission.prerequisites.every((required) => approvedIds.has(required))) return "locked";
  return "available";
}
export function approvedXp(missions: Mission[], submissions: Submission[]): number {
  return missions.filter((mission) => missionState(mission, submissions) === "approved")
    .reduce((total, mission) => total + mission.xp, 0);
}
export function learnerLevel(xp: number): number { return Math.floor(xp / 300) + 1; }
export const reviewCriteria = [
  { label:"Fonctionnement du livrable", points:30 },
  { label:"Compréhension technique", points:25 },
  { label:"Autonomie et débogage", points:20 },
  { label:"Qualité et présentation", points:15 },
  { label:"Tests et documentation", points:10 }
] as const;
export const stateLabels: Record<MissionState,string> = {
  locked:"Verrouillée", available:"Disponible", in_review:"En évaluation",
  changes_requested:"À corriger", approved:"Validée"
};
