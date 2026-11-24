"use client";
import {useState,useRef,useEffect} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {ArrowRight,LifeBuoy,MessageCircle,CheckCircle2,AlertCircle,Plus,Send,BookOpen,UserRound,GraduationCap} from "lucide-react";
import {emptySupport,supportReady,supportOrder,supportCategories,supportStatuses,supportTimestamp,type SupportList,type SupportThread,type SupportFields,type SupportCategory,type SupportAction} from "@/lib/learner-support";
import {pilotCourse} from "@/lib/v2-public-catalog";
import {actOnSupport} from "@/app/espace/aide/actions";
const lessons=pilotCourse.modules.flatMap(m=>m.lessons.map(l=>({slug:l.slug,title:l.title,week:m.week})));
const errors:Record<string,string>={revision_conflict:"Un nouvel échange a été enregistré. Copie ton texte avant de recharger.",not_enrolled:"Ton inscription ne permet plus cette action.",invalid_transition:"Cette demande a changé d'état.",invalid_support:"Vérifie le contenu de ta demande.",message_limit:"Cette discussion a atteint sa limite. Crée une nouvelle demande si nécessaire.",unavailable:"Le service est indisponible. Ton texte reste affiché."};
export function LearnerSupportCenter({data,trainer,canCreate}:{data:SupportList;trainer:boolean;canCreate:boolean}){
 const router=useRouter();
 const [selected,setSelected]=useState<string|null>(null),[filter,setFilter]=useState("all"),[search,setSearch]=useState("");
 const [draft,setDraft]=useState<SupportFields|null>(null),[body,setBody]=useState(""),[pending,setPending]=useState(false);
 const [confirmation,setConfirmation]=useState<SupportAction|null>(null);
 const [notice,setNotice]=useState<{error:boolean;text:string}|null>(null);
 const running=useRef(false);
 const dirty=!!draft||!!body.trim();
 useEffect(()=>{if(!dirty)return;const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue="";};window.addEventListener("beforeunload",warn);return ()=>window.removeEventListener("beforeunload",warn);},[dirty]);
 const sorted=[...data.threads].sort((a,b)=>supportOrder(a,trainer)-supportOrder(b,trainer)||b.updated_at.localeCompare(a.updated_at));
 const actionStatus=trainer?"waiting_trainer":"waiting_learner";
 const visible=sorted.filter(t=>(filter==="all"||filter==="action"&&t.status===actionStatus||filter==="blocking"&&t.urgency==="blocking"&&t.status!=="resolved"||filter==="resolved"&&t.status==="resolved")&&[t.title,t.learner_name||"",supportCategories[t.category]].some(v=>v.toLowerCase().includes(search.trim().toLowerCase())));
 const current=visible.find(t=>t.id===selected)||visible[0]||null;
 const focus=(id:string)=>requestAnimationFrame(()=>{const el=document.getElementById(id);el?.focus();el?.scrollIntoView({block:"start",behavior:"auto"});});
 function leave(){return !dirty||window.confirm("Abandonner le texte non envoyé ?");}
 function reset(){setBody("");setConfirmation(null);setNotice(null);}
 function open(id:string){if(pending||draft||!leave())return;reset();setSelected(id);if(window.matchMedia("(max-width: 1000px)").matches)focus("sc-detail");}
 function changeFilter(f:string){if(pending||draft||!leave())return;reset();setFilter(f);setSelected(null);}
 function create(){if(!canCreate||pending||draft||!leave())return;reset();setDraft(emptySupport());focus("sc-create");}
 function patch(p:Partial<SupportFields>){setDraft(d=>d?{...d,...p}:null);setNotice(null);}
 async function run(action:SupportAction){
  if(running.current)return;running.current=true;setPending(true);setNotice(null);
  try{const result=await actOnSupport(action,trainer?"trainer":"learner");
   if(result.ok===true){setDraft(null);reset();setFilter("all");setSearch("");setSelected(result.thread.id);setNotice({error:false,text:action.intent==="create"?"Demande transmise à l'espace formateur.":action.intent==="resolve"?"Résolution confirmée.":action.intent==="reopen"?"Demande rouverte.":"Réponse enregistrée."});router.refresh();}
   else setNotice({error:true,text:errors[result.error]||"Action refusée. Vérifie les informations."});
  }catch{setNotice({error:true,text:errors.unavailable});}finally{running.current=false;setPending(false);}
 }
 const next=sorted.find(t=>t.status===actionStatus);
 const metrics=[{label:trainer?"À traiter":"En attente du formateur",value:sorted.filter(t=>t.status==="waiting_trainer").length},{label:trainer?"Retour à vérifier":"À vérifier",value:sorted.filter(t=>t.status==="waiting_learner").length},{label:"Résolus",value:sorted.filter(t=>t.status==="resolved").length}];
 const filters=[{id:"all",label:"Toutes"},{id:"action",label:trainer?"À traiter":"À vérifier"},{id:"blocking",label:"Bloquantes"},{id:"resolved",label:"Résolues"}];
 return <div className="sc-workspace">
  <section className="sc-hero"><div><span className="sc-overline">ACCOMPAGNEMENT HUMAIN · EN CONTINU</span><h2>{trainer?"Un regard sur les difficultés du parcours.":"Un blocage ? Tu n'es pas seul."}</h2><p>{trainer?"Retrouve les demandes déclarées, propose une piste et laisse l'apprenant confirmer la résolution.":"Explique ce que tu essaies de réaliser. Ton formateur pourra reprendre le problème avec toi."}</p><div className="sc-actions">{!trainer&&canCreate&&<button className="sc-btn light" disabled={pending||!!draft} onClick={create}><Plus size={17}/> Signaler un blocage</button>}{next&&<button className="sc-btn light" disabled={pending||!!draft} onClick={()=>{if(!leave())return;reset();setFilter("all");setSearch("");setSelected(next.id);focus("sc-detail");}}> {trainer?"Traiter une demande":"Consulter un retour"} <ArrowRight size={16}/></button>}</div></div><div className="sc-hero-icon" aria-hidden="true"><LifeBuoy size={54} strokeWidth={1.4}/></div></section>
  <div className="sc-metrics">{metrics.map(m=><div key={m.label}><small>{m.label}</small><strong>{m.value}</strong></div>)}</div>
  <p className="sc-note">Indicateurs de la page {data.page}. Les difficultés et priorités sont déclarées par les apprenants, pas déduites automatiquement.</p>
  {notice&&!draft&&<p role={notice.error?"alert":"status"} className={notice.error?"sc-error":"sc-success"}>{notice.text}</p>}
  {draft&&<section className="sc-panel sc-editor"><span className="sc-overline">DEMANDE VOLONTAIRE · CONFIDENTIELLE</span><h2 id="sc-create" tabIndex={-1}>Explique ton blocage</h2><p>Ton message sera accessible aux formateurs du parcours pilote. N'inclus aucune clé API, aucun mot de passe ni donnée client sensible.</p>
   <fieldset disabled={pending}><div className="sc-form"><label className="sc-full">Titre<input maxLength={140} value={draft.title} onChange={e=>patch({title:e.target.value})} placeholder="Ex. Mon test de connexion échoue"/></label><label>Domaine<select value={draft.category} onChange={e=>patch({category:e.target.value as SupportCategory})}>{Object.entries(supportCategories).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label><label>Impact sur mon travail<select value={draft.urgency} onChange={e=>patch({urgency:e.target.value as SupportFields["urgency"]})}><option value="normal">Je peux poursuivre une partie du travail</option><option value="blocking">Je ne peux plus avancer</option></select></label>
   <label className="sc-full">Atelier associé (facultatif)<select value={draft.workshop_slug??""} onChange={e=>patch({workshop_slug:e.target.value||null})}><option value="">Aucun atelier</option>{lessons.map(l=><option key={l.slug} value={l.slug}>S{l.week} · {l.title}</option>)}</select></label>
   <label className="sc-full">01 · Ce que je cherche à réaliser<textarea rows={3} maxLength={2400} value={draft.context} onChange={e=>patch({context:e.target.value})} placeholder="Décris le contexte et le résultat obtenu."/></label>
   <label className="sc-full">02 · Ce que j'ai déjà essayé<textarea rows={3} maxLength={1800} value={draft.attempted} onChange={e=>patch({attempted:e.target.value})} placeholder="Tests, observations, ou pourquoi tu n'as pas encore pu essayer."/></label>
   <label className="sc-full">03 · L'aide dont j'ai besoin<textarea rows={3} maxLength={1500} value={draft.expected} onChange={e=>patch({expected:e.target.value})} placeholder="Une explication, une démonstration ou un test à faire ensemble…"/></label></div></fieldset>
   {notice&&<p role="alert" className="sc-error">{notice.text}</p>}<div className="sc-actions"><button className="sc-btn secondary" disabled={pending} onClick={()=>{if(leave()){setDraft(null);reset();}}}>Annuler</button><button className="sc-btn primary" disabled={pending||!supportReady(draft)} onClick={()=>void run({intent:"create",...draft})}><Send size={16}/>{pending?"Envoi…":"Transmettre au formateur"}</button></div><p>La demande apparaîtra dans son espace de suivi. Aucune notification externe ni réponse instantanée n'est garantie.</p>
  </section>}
  <section className="sc-panel"><div className="sc-heading"><div><span className="sc-overline">SUIVI INDIVIDUEL</span><h2>{trainer?"Demandes d'accompagnement":"Mes demandes"}</h2></div><span className="sc-note">Page {data.page}</span></div>
   <div className="sc-toolbar"><div className="sc-filters" aria-label="Filtrer les demandes">{filters.map(f=><button key={f.id} className={filter===f.id?"on":""} aria-pressed={filter===f.id} disabled={pending||!!draft} onClick={()=>changeFilter(f.id)}>{f.label}</button>)}</div><input type="search" aria-label="Rechercher sur cette page" placeholder="Rechercher…" disabled={pending||dirty} value={search} onChange={e=>{setSearch(e.target.value);setSelected(null);reset();}}/></div>
   {!current?<div className="sc-empty"><MessageCircle size={36}/><h3>Aucune demande affichée</h3><p>{filter!=="all"||search?"Modifie les filtres.":trainer?"Les difficultés signalées apparaîtront ici.":"Tu peux signaler une difficulté lorsque tu en as besoin."}</p></div>:<div className="sc-grid"><div className="sc-list">{visible.map(t=><button key={t.id} className={"sc-card "+(current.id===t.id?"selected":"")} aria-pressed={current.id===t.id} disabled={pending||!!draft} onClick={()=>open(t.id)}><span className={"sc-status "+t.status}>{supportStatuses[t.status]}</span><strong>{t.title}</strong><small>{supportCategories[t.category]}{trainer?" · "+(t.learner_name||"Apprenant "+t.learner_id?.slice(0,8)):""}</small>{t.urgency==="blocking"&&t.status!=="resolved"&&<span className="sc-urgent"><AlertCircle size={13}/> Bloquant (déclaré)</span>}<small>{supportTimestamp(t.updated_at)}</small></button>)}</div>
    <article className="sc-detail" id="sc-detail" tabIndex={-1}><span className={"sc-status "+current.status}>{supportStatuses[current.status]}</span><h2>{current.title}</h2><p>{supportCategories[current.category]} · {current.urgency==="blocking"?"Blocage déclaré":"Difficulté déclarée"}</p>
     <div className="sc-context"><h3>La demande initiale</h3><strong>Contexte</strong><p>{current.context}</p><strong>Tentatives</strong><p>{current.attempted}</p><strong>Aide attendue</strong><p>{current.expected}</p>{current.workshop_slug&&<Link href={"/espace/parcours/ingenierie-produit-ia/atelier/"+current.workshop_slug}><BookOpen size={15}/> Atelier associé</Link>}</div>
     <h3 className="sc-conversation-title">Échanges avec le formateur</h3>
     {!current.messages.length&&<p>En attente d'un premier retour.</p>}
     <div className="sc-conversation">{current.messages.map(m=><section key={m.id} className={"sc-message "+m.author_role}><div className="sc-message-head">{m.author_role==="trainer"?<GraduationCap size={16}/>:<UserRound size={16}/>}<strong>{m.author_role==="trainer"?"Formateur":"Apprenant"}</strong><small>{supportTimestamp(m.created_at)}</small></div>{m.kind!=="reply"&&<strong className="sc-event">{m.kind==="resolved"?"Résolution confirmée":"Demande rouverte"}</strong>}<p>{m.body}</p></section>)}</div>
     {!draft&&(trainer?current.status!=="resolved"&&current.editable===true:current.editable)&&<section className="sc-response"><h3>{current.status==="resolved"?"Le blocage revient ?":trainer?"Apporter un retour concret":"Poursuivre l'échange"}</h3><label>{current.status==="resolved"?"Explique ce qui bloque à nouveau":trainer?"Ton retour pédagogique":"Ton message ou résultat du test"}<textarea rows={4} maxLength={2400} disabled={pending} value={body} onChange={e=>{setBody(e.target.value);setConfirmation(null);}} placeholder={trainer?"Une piste à tester, une démonstration à préparer…":"Décris ton observation concrète…"}/></label>
      <div className="sc-actions">{current.status!=="resolved"&&<button className="sc-btn primary" disabled={pending||body.trim().length<3} onClick={()=>void run({intent:"reply",id:current.id,revision:current.revision,body})}><Send size={16}/> Envoyer</button>}{!trainer&&<button className="sc-btn secondary" disabled={pending||body.trim().length<3} onClick={()=>setConfirmation({intent:current.status==="resolved"?"reopen":"resolve",id:current.id,revision:current.revision,body})}>{current.status==="resolved"?"Rouvrir la demande":<><CheckCircle2 size={16}/> Confirmer la résolution</>}</button>}</div>
     </section>}
     {confirmation&&confirmation.intent!=="create"&&confirmation.id===current.id&&<div className="sc-confirm"><strong>{confirmation.intent==="resolve"?"Ton blocage est-il réellement résolu ?":"Confirmer la réouverture ?"}</strong><p>Ton message et le changement d'état seront conservés dans l'historique.</p><div className="sc-actions"><button className="sc-btn primary" disabled={pending} onClick={()=>void run(confirmation)}>Confirmer</button><button className="sc-btn secondary" disabled={pending} onClick={()=>setConfirmation(null)}>Retour</button></div></div>}
     {trainer&&current.status==="resolved"&&<p><CheckCircle2 size={15}/> L'apprenant a confirmé la résolution. Il peut rouvrir la demande.</p>}
     {current.editable===false&&<p>Consultation seule : l’inscription n’est plus active.</p>}
    </article></div>}
   <nav className="sc-pagination" aria-label="Pages des demandes">{data.page>1&&<Link href={"?page="+(data.page-1)}>← Précédente</Link>}<span>Page {data.page}</span>{data.has_next&&data.page<1000&&<Link href={"?page="+(data.page+1)}>Suivante →</Link>}</nav>
  </section>
 </div>;
}
