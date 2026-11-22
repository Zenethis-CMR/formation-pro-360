"use client";
import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function AuthPasswordField({name,label,autoComplete,confirm=false}:{
  name:string;label:string;autoComplete:"current-password"|"new-password";confirm?:boolean;
}){
  const [visible,setVisible]=useState(false);
  const inputId=useId();
  return <div className="auth-password-field">
    <label htmlFor={inputId}>{label}</label>
    <div className="auth-password-wrap">
      <input id={inputId} type={visible?"text":"password"} name={name} required
        minLength={autoComplete==="new-password"?10:1} maxLength={128}
        autoComplete={autoComplete} placeholder={confirm?"Confirme ton mot de passe":"Saisis ton mot de passe"}/>
      <button type="button" onClick={()=>setVisible(!visible)}
        aria-label={visible?"Masquer le mot de passe":"Afficher le mot de passe"}
        aria-pressed={visible} title={visible?"Masquer":"Afficher"}>
        {visible?<EyeOff size={17}/>:<Eye size={17}/>}
      </button>
    </div>
  </div>;
}
