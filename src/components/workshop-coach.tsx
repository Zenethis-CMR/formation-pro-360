"use client";
import {useEffect,useRef,useState,type FormEvent} from "react";
import {CircleHelp,Clock3,MessageCircle,Send,Sparkles,Timer,CheckCircle2,AlertTriangle,Clipboard,Target,ShieldCheck,MessageSquare} from "lucide-react";

type CoachMode="commencer"|"debloquer"|"verifier";
const modes:{id:CoachMode;title:string;subtitle:string}[]=[
  {id:"commencer",title:"Commencer",subtitle:"Une première action concrète"},
  {id:"debloquer",title:"Me débloquer",subtitle:"Un diagnostic et un test"},
  {id:"verifier",title:"Vérifier mon travail",subtitle:"Deux tests et des preuves"}
];
const exampleQuestions:Record<CoachMode,string[]>={
  commencer:[
    "Quelle première étape puis-je terminer en 10 minutes ?",
    "Quel résultat concret dois-je produire aujourd'hui ?"
  ],
  debloquer:[
    "Je n'arrive pas à réaliser cette étape, comment identifier le blocage ?",
    "Quel test concret permettrait de détecter un défaut ?"
  ],
  verifier:[
    "Comment vérifier que mon livrable fonctionne vraiment ?",
    "Quels scénarios d'erreur et résultats attendus dois-je documenter ?"
  ]
};
type Reply={status:"ok"|"busy"|"limit"|"access"|"invalid"|"unavailable";
  answer:string;question:string};
type Success={question:string;answer:string;mode:CoachMode};

const fallback="La connexion au coach a été interrompue. Ton travail reste intact ; réessaie plus tard.";
/** A bounded SSE protocol carrying only status, heartbeat and the final answer. */
function parseSsePacket(packet:string):{event:string;data:Record<string,unknown>}|null{
  const lines=packet.replace(/\r/g,"").split("\n");
  const event=lines.find(l=>l.startsWith("event: "))?.slice(7);
  const json=lines.filter(l=>l.startsWith("data: ")).map(l=>l.slice(6)).join("");
  if(!event||!json)return null;
  try{
    const data=JSON.parse(json);
    if(!data||typeof data!=="object"||Array.isArray(data))return null;
    return {event,data};
  }catch{return null;}
}

/**
 * Keep long Qwen3 generations out of Next.js Server Actions. An authenticated
 * same-origin SSE route sends heartbeats so slow inference cannot silently
 * leave the learner with an unresponsive page.
 */
export function WorkshopCoach({lessonId,trainerFeedback}:{lessonId:string;trainerFeedback?:string|null}){
  const [draft,setDraft]=useState("");
  const [mode,setMode]=useState<CoachMode>("debloquer");
  const [workSummary,setWorkSummary]=useState("");
  const [copied,setCopied]=useState(false);
  const [reply,setReply]=useState<Reply|null>(null);
  const [lastSuccess,setLastSuccess]=useState<Success|null>(null);
  const [pending,setPending]=useState(false);
  const [seconds,setSeconds]=useState(0);
  const running=useRef<AbortController|null>(null);
  useEffect(()=>{
    if(!pending)return;
    const started=Date.now();
    setSeconds(0);
    const interval=setInterval(()=>setSeconds(Math.floor((Date.now()-started)/1000)),1000);
    return ()=>clearInterval(interval);
  },[pending]);
  useEffect(()=>()=>running.current?.abort(),[]);

  async function ask(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(running.current)return;
    const question=draft.trim();
    if(workSummary.trim().length>400){
      setReply({status:"invalid",question,answer:"Le résumé de ton travail ne doit pas dépasser 400 caractères."});
      return;
    }
    if(question.length<8||question.length>1200){
      setReply({status:"invalid",question,answer:"Précise ta question en 8 à 1 200 caractères."});
      return;
    }
    const controller=new AbortController();
    running.current=controller;
    setPending(true);
    setReply(null);
    setCopied(false);
    let complete=false;
    const receive=(packet:string)=>{
      const message=parseSsePacket(packet);
      if(!message)return;
      if(message.event==="answer"&&typeof message.data.answer==="string"){
        const answer=message.data.answer.slice(0,4000);
        if(!answer)return;
        setReply({status:"ok",question,answer});
        setLastSuccess({question,answer,mode});
        complete=true;
      }
      if(message.event==="failure"&&typeof message.data.message==="string"){
        const value=message.data.status;
        const status=value==="busy"||value==="limit"||value==="access"
          ?"busy"===value?"busy":value:value==="invalid"?"invalid":"unavailable";
        setReply({status,question,answer:message.data.message.slice(0,600)});
        complete=true;
      }
    };
    try{
      const previous_exchange=lastSuccess?.mode===mode?{
        question:lastSuccess.question.slice(0,400),
        answer:lastSuccess.answer.slice(0,800)
      }:undefined;
      const response=await fetch("/api/coach",{
        method:"POST",credentials:"same-origin",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({lessonId,question,mode,
          ...(workSummary.trim()?{work_summary:workSummary.trim()}:{}),
          ...(previous_exchange?{previous_exchange}:{})}),
        signal:controller.signal
      });
      if(!response.ok){
        const status=response.status===401||response.status===403?"access":"unavailable";
        setReply({status,question,answer:status==="access"
          ?"Ta session a expiré ou l'accès au coach a été refusé. Reconnecte-toi puis réessaie."
          :fallback});
        complete=true;
        return;
      }
      const reader=response.body?.getReader();
      if(!reader)throw new Error("missing_stream");
      const decoder=new TextDecoder();
      let buffer="";
      while(true){
        const {done,value}=await reader.read();
        if(done)break;
        buffer+=decoder.decode(value,{stream:true});
        // SSE packets are separated by a blank line; account for CRLF as well.
        buffer=buffer.replace(/\r\n/g,"\n");
        let boundary=buffer.indexOf("\n\n");
        while(boundary>=0){
          receive(buffer.slice(0,boundary));
          buffer=buffer.slice(boundary+2);
          boundary=buffer.indexOf("\n\n");
        }
        if(buffer.length>16000)throw new Error("stream_too_large");
      }
      if(!complete)setReply({status:"unavailable",question,answer:fallback});
    }catch{
      if(!controller.signal.aborted)
        setReply({status:"unavailable",question,answer:fallback});
    }finally{
      if(running.current===controller)running.current=null;
      setPending(false);
    }
  }

  return <section id="coach" className="studio-section studio-live-coach">
    <span className="studio-eyebrow"><Sparkles size={15}/> AIDE PONCTUELLE · QWEN3 LOCAL</span>
    <h2>Débloque ton atelier, une question à la fois.</h2>
    <p>Ton formateur dirige les séances pratiques et ses consignes priment toujours. Cette aide facultative propose une piste ou un test à réaliser toi-même, sans cours complet, livrable prêt à remettre, correction ni XP.</p>
    <fieldset className="studio-coach-modes">
      <legend>Quelle aide veux-tu recevoir ?</legend>
      <div className="studio-coach-mode-options">
        {modes.map(option=><label key={option.id} className={mode===option.id?"is-selected":""}>
          <input type="radio" name="coachMode" value={option.id} checked={mode===option.id}
            onChange={()=>setMode(option.id)} disabled={pending}/>
          <strong>{option.title}</strong><small>{option.subtitle}</small>
        </label>)}
      </div>
    </fieldset>
    <div className="studio-coach-suggestions" aria-label="Questions suggérées">
      {exampleQuestions[mode].map((question,i)=>
        <button type="button" key={i} disabled={pending}
          onClick={()=>setDraft(question)} aria-controls="studio-coach-question">
          <CircleHelp size={14}/>{question}
        </button>)}
    </div>
    <form onSubmit={ask} className="studio-coach-form">
      {trainerFeedback&&<button className="studio-coach-use-feedback" type="button"
        disabled={pending} onClick={()=>{
          const plain=trainerFeedback.split("\n\nGrille formative : ")[0].trim();
          setWorkSummary(plain.slice(0,400));
          setMode("verifier");
        }}>
        <MessageSquare size={15}/> Reprendre volontairement le retour du formateur
      </button>}
      <label htmlFor="studio-coach-work">Ce que j'ai déjà réalisé <small>facultatif · 400 caractères</small></label>
      <textarea id="studio-coach-work" name="workSummary" rows={2} maxLength={400}
        disabled={pending} value={workSummary} onChange={e=>setWorkSummary(e.target.value)}
        placeholder="Exemple : j'ai un prototype Figma avec un état d'erreur, mais le bouton ne fonctionne pas."/>
      <p className="studio-coach-work-hint"><Target size={14}/>
        {workSummary.length}/400 · Décris uniquement ton travail, sans nom ni information sensible. Ce texte n'est pas repris automatiquement de ton carnet.</p>
      <label htmlFor="studio-coach-question">Quelle difficulté veux-tu résoudre ?</label>
      <textarea id="studio-coach-question" name="question" minLength={8} maxLength={1200}
        rows={4} required value={draft} disabled={pending}
        onChange={e=>setDraft(e.target.value)}
        placeholder="Décris ton blocage, ce que tu as déjà essayé et ce que tu voudrais vérifier."/>
      <p>Ta question est transmise au modèle local Qwen3 par CT420. Évite les données personnelles, les mots de passe et les clés API. Les échanges ne sont pas enregistrés durablement.</p>
      {lastSuccess?.mode===mode&&<p className="studio-coach-context"><CheckCircle2 size={14}/>
        Ta prochaine question peut reprendre le contexte du dernier conseil uniquement.</p>}
      <button className="studio-coach-submit" type="submit" disabled={pending}>
        <Send size={16}/>{pending?"Réponse en cours…":"Demander un conseil"}
      </button>
      {pending&&<div className="studio-coach-pending" role="status" aria-live="polite">
        <span className="studio-coach-spinner" aria-hidden="true"/>
        <div><strong>Qwen3 prépare ta réponse…</strong>
          <p>Le modèle répond localement et peut prendre plusieurs dizaines de secondes. L'atelier reste ouvert.</p>
          <span className="studio-coach-time"><Timer size={14}/> {seconds} seconde{seconds===1?"":"s"} écoulée{seconds===1?"":"s"}</span>
        </div>
      </div>}
    </form>
    {reply&&<div className={"studio-coach-answer "+(reply.status==="ok"?"is-success":"is-unavailable")}
      role={reply.status==="ok"?"status":"alert"} aria-live="polite">
      <div><MessageCircle size={19}/><strong>{reply.status==="ok"?"Conseil personnalisé":
        reply.status==="busy"?"Qwen3 est déjà occupé":
        reply.status==="limit"?"Limite de demandes atteinte":
        reply.status==="invalid"?"Question à reformuler":
        reply.status==="access"?"Accès au coach refusé":"Coach momentanément indisponible"}</strong></div>
      {reply.status==="ok"&&<p className="studio-coach-original"><b>Ta question :</b> {reply.question}</p>}
      <p>{reply.answer}</p>
      {reply.status==="ok"&&<div className="studio-coach-response-actions">
        <button className="studio-coach-followup" type="button" onClick={async()=>{
          try{await navigator.clipboard.writeText(reply.answer);setCopied(true);}catch{setCopied(false);}
        }}><Clipboard size={14}/>{copied?"Conseil copié":"Copier le conseil"}</button>
        <span><ShieldCheck size={14}/> À vérifier dans ton projet avant toute remise</span>
      </div>}
      {reply.status==="ok"&&<button className="studio-coach-followup" type="button"
        onClick={()=>{setDraft("Peux-tu détailler la première étape et me donner un test concret ?");
          document.getElementById("studio-coach-question")?.focus();}}>
        <MessageCircle size={14}/> Poser une question de suivi
      </button>}
      {reply.status!=="ok"&&<p className="studio-coach-recovery">
        <AlertTriangle size={15}/> Aucun travail ni carnet n'a été modifié par cette erreur.</p>}
    </div>}
    <small><Clock3 size={13}/> L'assistance IA n'attribue aucun XP. Seul ton formateur valide les livrables.</small>
  </section>;
}
