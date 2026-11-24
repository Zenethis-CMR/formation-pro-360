"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {MessageSquare,Clipboard,Send,ShieldCheck} from "lucide-react";

type Mode="debloquer"|"verifier"|"preparer";
const modes:{id:Mode;label:string}[]=[
 {id:"debloquer",label:"Identifier un blocage"},
 {id:"verifier",label:"Préparer un test"},
 {id:"preparer",label:"Reformuler une question pour mon formateur"}
];
export function ProductPracticeAssistance({aiAvailable}:{aiAvailable:boolean}){
 const [work,setWork]=useState("");
 const [attempt,setAttempt]=useState("");
 const [question,setQuestion]=useState("");
 const [mode,setMode]=useState<Mode>("preparer");
 const [consent,setConsent]=useState(false);
 const [answer,setAnswer]=useState("");
 const [notice,setNotice]=useState("");
 const [pending,setPending]=useState(false);
 const [copied,setCopied]=useState(false);
 const running=useRef<AbortController|null>(null);
 useEffect(()=>()=>running.current?.abort(),[]);
 const summary=[work.trim(),attempt.trim()].filter(Boolean).join(" — ").slice(0,400);
 const brief=["Point pour ma séance avec le formateur","Ce que j'ai réalisé : "+(work.trim()||"À préciser"),"Ce que j'ai déjà essayé : "+(attempt.trim()||"À préciser"),"Ma question : "+(question.trim()||"À préciser")].join("\n");
 async function copyBrief(){
  try{await navigator.clipboard.writeText(brief);setCopied(true);}
  catch{setNotice("La copie automatique est indisponible. Sélectionne le texte du récapitulatif.");}
 }
 async function ask(){
  if(running.current||!aiAvailable||!consent||question.trim().length<8)return;
  const controller=new AbortController();running.current=controller;
  setPending(true);setAnswer("");setNotice("");setConsent(false);
  let finished=false;
  try{
   const response=await fetch("/api/coach",{method:"POST",credentials:"same-origin",headers:{"content-type":"application/json"},
    body:JSON.stringify({scope:"project",consent:true,mode,question:question.trim(),...(summary?{work_summary:summary}:{})}),signal:controller.signal});
   if(!response.ok||!response.body)throw new Error("unavailable");
   const reader=response.body.getReader();const decoder=new TextDecoder();
   let buffer="";
   const packet=(value:string)=>{
    const lines=value.split("\n");
    const event=lines.find(l=>l.startsWith("event: "))?.slice(7);
    const data=lines.filter(l=>l.startsWith("data: ")).map(l=>l.slice(6)).join("\n");
    if(!data)return;
    const result=JSON.parse(data) as {answer?:string;message?:string};
    if(event==="answer"&&typeof result.answer==="string"&&result.answer.trim()){
      setAnswer(result.answer.slice(0,4000));finished=true;
    }
    if(event==="failure"){setNotice(typeof result.message==="string"?result.message.slice(0,600):"Assistance indisponible.");finished=true;}
   };
   while(true){
    const {done,value}=await reader.read();if(done)break;
    buffer=(buffer+decoder.decode(value,{stream:true})).replace(/\r\n/g,"\n");
    let boundary=buffer.indexOf("\n\n");
    while(boundary>=0){packet(buffer.slice(0,boundary));buffer=buffer.slice(boundary+2);boundary=buffer.indexOf("\n\n");}
    if(buffer.length>16000)throw new Error("stream_too_large");
   }
   if(!finished)setNotice("L'assistance n'a pas renvoyé de réponse exploitable. Prépare ta question pour la séance.");
  }catch{if(!controller.signal.aborted)setNotice("L'assistance locale est indisponible. Ton récapitulatif reste utilisable sans IA.");}
  finally{running.current=null;setPending(false);}
 }
 return <section className="practice-assistance" aria-labelledby="practice-title">
  <div className="practice-intro"><MessageSquare size={22}/><div><h2 id="practice-title">Préparer ma prochaine séance</h2>
   <p>Ton formateur dirige les séances pratiques. Note ce que tu as fait et les difficultés à lui présenter. Aucun recours à l'IA n'est obligatoire.</p></div></div>
  <div className="practice-fields">
   <label>Ce que j'ai déjà réalisé<textarea rows={3} maxLength={200} value={work} disabled={pending} onChange={e=>{setWork(e.target.value);setCopied(false);setConsent(false);}} placeholder="Le résultat concret de mon travail…"/></label>
   <label>Ce que j'ai essayé ou observé<textarea rows={3} maxLength={197} value={attempt} disabled={pending} onChange={e=>{setAttempt(e.target.value);setCopied(false);setConsent(false);}} placeholder="Une manipulation, un test, un message d'erreur non sensible…"/></label>
   <label>Ma question pour le formateur<textarea rows={3} maxLength={600} value={question} disabled={pending} onChange={e=>{setQuestion(e.target.value);setCopied(false);setConsent(false);}} placeholder="Qu'aimerais-je comprendre ou vérifier pendant la séance ?"/></label>
  </div>
  <div className="practice-brief"><h3>Mon récapitulatif de séance</h3><pre>{brief}</pre>
   <button type="button" onClick={()=>void copyBrief()}><Clipboard size={15}/>{copied?"Récapitulatif copié":"Copier pour mon formateur"}</button>
   <p>Ce texte n'est ni envoyé ni enregistré automatiquement. Présente-le à ton formateur pendant la séance.</p></div>
  <details className="practice-ai"><summary>Besoin d'une aide ponctuelle de Qwen3 ? (facultatif)</summary>
   <p>Une piste ou un test à réaliser toi-même, pas un cours ni une correction. Les consignes humaines priment toujours.</p>
   {!aiAvailable?<p role="status">L'assistance IA est désactivée ou indisponible. Tu peux continuer ton travail et préparer ta séance ci-dessus.</p>:<>
    <label>Type d'aide<select value={mode} disabled={pending} onChange={e=>{setMode(e.target.value as Mode);setConsent(false);}}>{modes.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}</select></label>
    <p>Seuls ta question et le résumé volontaire ci-dessous sont transmis à Qwen3 local. Aucun dossier, backlog, carnet ou retour du formateur n'est chargé automatiquement.</p>
    <div className="practice-preview"><strong>Texte à transmettre</strong><p>{summary||"Aucun résumé"} </p><p>{question.trim()||"Aucune question"}</p></div>
    <label className="practice-consent"><input type="checkbox" checked={consent} disabled={pending} onChange={e=>setConsent(e.target.checked)}/> J'accepte de transmettre ces textes au modèle local, sans mot de passe, clé API ni donnée personnelle sensible.</label>
    <button type="button" disabled={pending||!consent||question.trim().length<8} onClick={()=>void ask()}><Send size={15}/>{pending?"Réponse locale en cours…":"Demander une piste"}</button>
    {pending&&<p role="status">Qwen3 prépare une courte piste. Ton travail n'est pas modifié.</p>}
   </>}
   {answer&&<div className="practice-answer" role="status"><strong>Piste IA non validée</strong><p>{answer}</p><small>À vérifier avec ton formateur. Aucune action n'a été exécutée.</small></div>}
  </details>
  {notice&&<p role="status">{notice}</p>}
  <footer><ShieldCheck size={16}/> Le formateur décide des consignes, corrections et validations. Aucun XP n'est attribué ici. <Link href="/espace/projet">Revenir à mon projet</Link></footer>
 </section>;
}
