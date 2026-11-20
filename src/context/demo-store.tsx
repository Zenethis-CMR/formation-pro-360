"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { initialMissions, type Mission } from "@/data/missions";
import { type Submission, approvedXp, learnerLevel, missionState } from "@/lib/mission-engine";

type DemoState = { missions: Mission[]; submissions: Submission[] };
type NewMission = Omit<Mission, "id">;
type DemoContextValue = DemoState & {
  ready: boolean; xp: number; level: number; approvedCount: number;
  submit: (missionId: string, url: string, note: string) => boolean;
  review: (submissionId: string, score: number, feedback: string) => boolean;
  addMission: (data: NewMission) => void;
  reset: () => void;
};
const key = "formation-pro-360-demo-v1";
const initial: DemoState = { missions: initialMissions, submissions: [] };
const DemoContext = createContext<DemoContextValue | null>(null);

function validState(value: unknown): value is DemoState {
  if (!value || typeof value !== "object") return false;
  const s = value as Partial<DemoState>;
  return Array.isArray(s.missions) && Array.isArray(s.submissions);
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const loaded: unknown = JSON.parse(raw);
        if (validState(loaded)) setState(loaded);
      }
    } catch { /* localStorage may be unavailable. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(key, JSON.stringify(state)); }
    catch { /* Demo continues without storage. */ }
  }, [state, ready]);

  function submit(missionId: string, url: string, note: string): boolean {
    const safeUrl = url.trim();
    if (!/^https?:\/\//i.test(safeUrl) || safeUrl.length > 800 || note.length > 1200) return false;
    const mission = state.missions.find((item) => item.id === missionId);
    if (!mission || !["available", "changes_requested"].includes(missionState(mission, state.submissions))) return false;
    const submission: Submission = {
      id: "SUB-" + Date.now() + "-" + Math.floor(Math.random() * 10000),
      missionId, url: safeUrl, note: note.trim(), submittedAt: new Date().toISOString(), status: "pending"
    };
    setState((before) => ({ ...before, submissions: [...before.submissions, submission] }));
    return true;
  }
  function review(submissionId: string, score: number, feedback: string): boolean {
    if (!Number.isInteger(score) || score < 0 || score > 100 || feedback.trim().length < 3) return false;
    if (!state.submissions.some((entry) => entry.id === submissionId && entry.status === "pending")) return false;
    setState((before) => ({
      ...before,
      submissions: before.submissions.map((entry) => entry.id === submissionId
        ? { ...entry, score, feedback: feedback.trim(), status: score >= 80 ? "approved" : "changes_requested" }
        : entry)
    }));
    return true;
  }
  function addMission(data: NewMission) {
    setState((before) => ({ ...before, missions: [...before.missions, { ...data, id: "C-" + Date.now() }] }));
  }
  function reset() { setState(initial); }
  const xp = approvedXp(state.missions, state.submissions);
  return <DemoContext.Provider value={{
    ...state, ready, xp, level: learnerLevel(xp),
    approvedCount: state.missions.filter((m) => missionState(m, state.submissions) === "approved").length,
    submit, review, addMission, reset
  }}>{children}</DemoContext.Provider>;
}
export function useDemo(): DemoContextValue {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used inside DemoProvider");
  return value;
}
