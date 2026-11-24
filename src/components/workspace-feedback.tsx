"use client";
import {useLinkStatus} from "next/link";
import {resolveSaveState} from "@/lib/workspace-feedback";
import {CheckCircle2,Clock3,AlertCircle,LoaderCircle} from "lucide-react";
export function WorkspaceLinkPending(){
 const {pending}=useLinkStatus();
 return <span className="ux-link-indicator" aria-hidden="true" data-pending={pending?"true":"false"}>{pending&&<LoaderCircle size={15} className="ux-spin"/>}</span>;
}
export function WorkspaceSaveStatus({pending,dirty,saved,error,readOnly=false}:{pending:boolean;dirty:boolean;saved:boolean;error:boolean;readOnly?:boolean}){
 const state=resolveSaveState({pending,dirty,saved,error,readOnly});
 const labels={readonly:"Lecture seule",saving:"Enregistrement en cours…",error:"Enregistrement non confirmé",dirty:"Modifications non enregistrées",saved:"Enregistrement confirmé",idle:"Premier enregistrement à effectuer"};
 const Icon=state==="saving"?LoaderCircle:state==="saved"?CheckCircle2:state==="error"?AlertCircle:Clock3;
 return <span className={"ux-save-state ux-save-"+state} role="status" aria-live="polite" aria-atomic="true"><Icon size={16} aria-hidden="true" className={state==="saving"?"ux-spin":undefined}/><span>{labels[state]}</span></span>;
}
