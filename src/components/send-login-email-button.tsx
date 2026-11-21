"use client";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Mail } from "lucide-react";

export function SendLoginEmailButton() {
  const {pending}=useFormStatus();
  return <button className="primary-btn auth-send-button" type="submit" disabled={pending} aria-disabled={pending}>
    {pending?<><LoaderCircle size={16} className="auth-loader" aria-hidden="true"/> Envoi en cours…</>:<><Mail size={16} aria-hidden="true"/> Recevoir mon lien de connexion</>}
  </button>;
}
