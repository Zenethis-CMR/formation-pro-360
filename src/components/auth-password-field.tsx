"use client";
import { useId, useState } from "react";
import { Eye, EyeOff, Check, Minus } from "lucide-react";

export function AuthPasswordField({name,label,autoComplete,confirm=false}:{
  name:string;label:string;autoComplete:"current-password"|"new-password";confirm?:boolean;
}){
  const [visible,setVisible]=useState(false);
  const [value,setValue]=useState("");
  const rules=autoComplete==="new-password"&&!confirm?[{label:"12 caractères minimum",met:value.length>=12},{label:"Une majuscule",met:/[A-Z]/.test(value)},{label:"Une minuscule",met:/[a-z]/.test(value)},{label:"Un chiffre",met:/[0-9]/.test(value)}]:[];
  const inputId=useId();
  return <div className="auth-password-field">
    <label htmlFor={inputId}>{label}</label>
    <div className="auth-password-wrap">
      <input id={inputId} type={visible?"text":"password"} name={name} required onChange={e=>setValue(e.target.value)} aria-describedby={rules.length?inputId+"-rules":undefined}
        minLength={autoComplete==="new-password"?12:1} maxLength={128}
        pattern={autoComplete==="new-password"?"(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{12,128}":undefined}
        title={autoComplete==="new-password"?
          "12 caractères minimum, avec une majuscule, une minuscule et un chiffre":undefined}
        autoComplete={autoComplete} placeholder={confirm?"Confirme ton mot de passe":"Saisis ton mot de passe"}/>
      <button type="button" onClick={()=>setVisible(!visible)}
        aria-label={visible?"Masquer le mot de passe":"Afficher le mot de passe"}
        aria-pressed={visible} title={visible?"Masquer":"Afficher"}>
        {visible?<EyeOff size={17}/>:<Eye size={17}/>}
      </button>
    </div>
    {rules.length>0&&<ul id={inputId+"-rules"} className="auth-password-checks" aria-label="Conditions du mot de passe">{rules.map(r=><li key={r.label} className={r.met?"met":""}>{r.met?<Check size={14} aria-hidden="true"/>:<Minus size={14} aria-hidden="true"/>}<span>{r.label}<span className="sr-only"> : {r.met?"respectée":"non respectée"}</span></span></li>)}</ul>}
  </div>;
}
