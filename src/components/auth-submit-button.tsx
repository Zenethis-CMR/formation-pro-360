"use client";
import { useFormStatus } from "react-dom";
import { ArrowRight, LoaderCircle } from "lucide-react";

export function AuthSubmitButton({label,pendingLabel}:{label:string;pendingLabel:string}){
  const {pending}=useFormStatus();
  return <button className="auth-new-submit" type="submit" disabled={pending} aria-disabled={pending}>
    {pending?<LoaderCircle size={17} className="auth-loader" aria-hidden="true"/>:<ArrowRight size={17} aria-hidden="true"/>}
    <span>{pending?pendingLabel:label}</span>
  </button>;
}
