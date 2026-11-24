"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {ArrowRight,CalendarDays,CheckCircle2,ClipboardCheck,ExternalLink,FileText,Flag,Plus,Send,Save,Target,MessageSquare} from "lucide-react";
import {briefStatuses,briefPriority,briefIssues,briefFields,emptyBrief,isOverdue,localDay,safeEvidence,type BriefList,type PracticeBrief,type BriefFields,type BriefAction,type BriefStatus} from "@/lib/personal-practice";
import type {PedagogicalWorkshop} from "@/lib/pedagogical-types";
import {actOnBrief} from "@/app/espace/defis/actions";
type Participant={learner_id:string;preferred_name:string|null};

const errors:Record<string,string>={revision_conflict:"Une version plus récente existe. Copie tes modifications avant de recharger.",publication_requirements:"Complète l'objectif, les consignes et les critères.",not_enrolled:"L'inscription ne permet plus cette opération.",invalid_transition:"Ce travail a changé d'état.",invalid_brief:"Vérifie les champs et les liens HTTPS.",attempt_limit:"La limite de tentatives est atteinte. Contacte le formateur.",unavailable:"Le service est indisponible. Ton texte reste dans cet écran."};
const fields=[{key:"objective",label:"Objectif pédagogique",hint:"À la fin, l'apprenant doit savoir…",max:1500},{key:"instructions",label:"Travail à réaliser",hint:"Décris les étapes et le résultat concret à construire.",max:3000},{key:"criteria",label:"Critères de réussite",hint:"Quels résultats observables te permettront d'accepter le travail ?",max:2000},{key:"resources",label:"Ressources et références",hint:"Documents, liens ou pistes utiles (facultatif).",max:2000}] as const;
const pretty=(d:string)=>d.split("-").reverse().join("/");
const timestamp=(d:string)=>new Intl.DateTimeFormat("fr-FR",{dateStyle:"medium",timeStyle:"short",timeZone:"Africa/Douala"}).format(new Date(d));
function BriefContent({b,lessons}:{b:Pick<BriefFields,"objective"|"instructions"|"criteria"|"resources"|"workshop_slug">;lessons:PedagogicalWorkshop[]}){
 return <div className="pb-content">
 <section><span><Target size={17}/> 01 · OBJECTIF</span><h3>Ce que je dois apprendre</h3><p>{b.objective||"À préciser"}</p></section>
 <section><span><Flag size={17}/> 02 · PRATIQUE</span><h3>Ce que je dois réaliser</h3><p>{b.instructions||"À préciser"}</p></section>
 <section><span><ClipboardCheck size={17}/> 03 · VÉRIFICATION</span><h3>Comment réussir</h3><p>{b.criteria||"À préciser"}</p></section>
 {b.resources&&<section><span><FileText size={17}/> RESSOURCES</span><p>{b.resources}</p></section>}
 {b.workshop_slug&&lessons.find(l=>l.slug===b.workshop_slug)&&<Link href={lessons.find(l=>l.slug===b.workshop_slug)!.href}>Atelier associé <ArrowRight size={15}/></Link>}
 </div>;
}
export function PersonalPracticeBoard({data,trainer,participants,truncated,trackSlug="ingenierie-produit-ia",lessons=[]}:{data:BriefList;trainer:boolean;participants:Participant[];truncated:boolean;trackSlug?:string;lessons?:PedagogicalWorkshop[]}){
 const router=useRouter();
 const [selected,setSelected]=useState<string|null>(null);
 const [filter,setFilter]=useState("all");
 const [search,setSearch]=useState("");
 const [editor,setEditor]=useState<{id:string|null;revision:number;fields:BriefFields}|null>(null);
 const [preview,setPreview]=useState(false);
 const [evidence,setEvidence]=useState("");
 const [note,setNote]=useState("");
 const [feedback,setFeedback]=useState("");
 const [notice,setNotice]=useState<{error:boolean;text:string}|null>(null);
 const [confirmation,setConfirmation]=useState<BriefAction|null>(null);
 const [pending,setPending]=useState(false);
 const active=useRef(false);
 const [today,setToday]=useState("");
 useEffect(()=>setToday(localDay()),[]);
 const dirty=!!editor||!!evidence||!!note||!!feedback;
 useEffect(()=>{if(!dirty)return;const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue="";};window.addEventListener("beforeunload",warn);return ()=>window.removeEventListener("beforeunload",warn);},[dirty]);
 const sorted=[...data.briefs].sort((a,b)=>briefPriority(a.status,trainer)-briefPriority(b.status,trainer)||b.updated_at.localeCompare(a.updated_at));
 const list=sorted.filter(b=>(filter==="all"||(filter==="action"?trainer?b.status==="submitted"||b.status==="draft":b.status==="assigned"||b.status==="revision_requested":filter==="history"?["accepted","cancelled"].includes(b.status):b.status===filter))&&[b.title,b.learner_name||""].some(v=>v.toLowerCase().includes(search.trim().toLowerCase())));
 const current=list.find(b=>b.id===selected)||list[0]||null;
 const focus=(id:string)=>requestAnimationFrame(()=>{const el=document.getElementById(id);el?.focus();el?.scrollIntoView({block:"start"});});
 function clearResponse(){setEvidence("");setNote("");setFeedback("");setConfirmation(null);setNotice(null);}
 function select(id:string){if(pending||editor)return;if(dirty&&!window.confirm("Abandonner le texte non enregistré ?"))return;clearResponse();setSelected(id);if(window.matchMedia("(max-width: 1000px)").matches)focus("pb-detail");}
 function filterTo(value:string){if(pending||editor)return;if(dirty&&!window.confirm("Abandonner le texte non enregistré ?"))return;clearResponse();setFilter(value);setSelected(null);}
 function start(b?:PracticeBrief){if(pending||editor)return;if(dirty&&!window.confirm("Abandonner le texte non enregistré ?"))return;clearResponse();setEditor({id:b?.id??null,revision:b?.revision??0,fields:b?briefFields(b):emptyBrief()});setPreview(false);focus("pb-editor-title");}
 function patch(p:Partial<BriefFields>){setEditor(e=>e?{...e,fields:{...e.fields,...p}}:null);setNotice(null);}
 async function run(action:BriefAction){
  if(active.current)return;active.current=true;setPending(true);setNotice(null);
  try{const res=await actOnBrief(action,trackSlug);if(res.ok===true){setSelected(res.brief.id);setEditor(null);setFilter("all");setSearch("");clearResponse();setNotice({error:false,text:action.intent==="draft"?"Brouillon enregistré.":action.intent==="publish"?"Défi attribué.":action.intent==="submit"?"Preuve envoyée au formateur.":action.intent==="review"?"Retour pédagogique enregistré.":"Défi annulé."});router.refresh();}else setNotice({error:true,text:errors[res.error]||"L'opération a été refusée. Vérifie les informations."});}
  catch{setNotice({error:true,text:errors.unavailable});}finally{active.current=false;setPending(false);}
 }
 const f=editor?.fields;
 const counts=trainer?[{label:"À corriger",n:sorted.filter(b=>b.status==="submitted").length},{label:"Brouillons",n:sorted.filter(b=>b.status==="draft").length},{label:"Acceptés",n:sorted.filter(b=>b.status==="accepted").length}]:[{label:"À réaliser",n:sorted.filter(b=>["assigned","revision_requested"].includes(b.status)).length},{label:"En correction",n:sorted.filter(b=>b.status==="submitted").length},{label:"Acceptés",n:sorted.filter(b=>b.status==="accepted").length}];
 const next=sorted.find(b=>trainer?["submitted","draft"].includes(b.status):["assigned","revision_requested"].includes(b.status));
 const filters=[{id:"all",label:"Tous"},{id:"action",label:trainer?"À traiter":"À réaliser"},{id:"submitted",label:trainer?"À corriger":"En correction"},{id:"history",label:"Historique"}];
 return <div className="pb-workspace">
 <section className="pb-hero"><div><span>{trainer?"ACCOMPAGNEMENT SUR MESURE":"PRATIQUE PERSONNALISÉE"}</span><h2>{next?next.title:trainer?"Un défi, un objectif concret.":"Ton prochain défi t'attend ici."}</h2><p>{next?briefStatuses[next.status]+(next.due_date?" · Échéance "+pretty(next.due_date):""):trainer?"Crée un exercice adapté au projet et aux besoins de ton apprenant.":"Ton formateur te transmettra des consignes adaptées à ton projet."}</p><div className="pb-actions">{trainer&&<button className="pb-btn light" disabled={pending||!!editor} onClick={()=>start()}><Plus size={17}/> Nouveau défi</button>}{next&&<button className="pb-btn light" disabled={pending||!!editor} onClick={()=>{if(dirty&&!window.confirm("Abandonner le texte non enregistré ?"))return;clearResponse();setSearch("");setFilter("all");setSelected(next.id);focus("pb-detail");}}>Ouvrir le défi <ArrowRight size={16}/></button>}</div></div><div className="pb-hero-icon" aria-hidden="true"><Target size={52} strokeWidth={1.5}/></div></section>
 <div className="pb-metrics">{counts.map(c=><div key={c.label}><small>{c.label}</small><strong>{c.n}</strong></div>)}</div>
 <p className="pb-muted">Indicateurs de la page {data.page}. Ces exercices complémentaires sont distincts des 16 ateliers officiels et ne génèrent pas d'XP.</p>
 {notice&&!editor&&<p role={notice.error?"alert":"status"} className={notice.error?"pb-alert":"pb-success"}>{notice.text}</p>}
 {editor&&f&&<section className="pb-panel pb-editor"><div className="pb-heading"><div><span className="pb-kicker">PRÉPARATION · BROUILLON PRIVÉ</span><h2 tabIndex={-1} id="pb-editor-title">{editor.id?"Modifier mon brouillon":"Créer un défi personnalisé"}</h2></div></div>
 <fieldset disabled={pending}><div className="pb-form"><label className="pb-full">Titre<input value={f.title} maxLength={140} onChange={e=>patch({title:e.target.value})} placeholder="Ex. Tester le scénario de réservation"/></label>
 <label>Apprenant<select value={f.learner_id} onChange={e=>patch({learner_id:e.target.value})}><option value="">Choisir un apprenant actif</option>{f.learner_id&&!participants.some(p=>p.learner_id===f.learner_id)&&<option value={f.learner_id}>Apprenant déjà sélectionné</option>}{participants.map(p=><option key={p.learner_id} value={p.learner_id}>{p.preferred_name||"Apprenant "+p.learner_id.slice(0,8)}</option>)}</select></label>
 <label>Échéance indicative<input type="date" min="2000-01-01" max="2099-12-31" value={f.due_date??""} onChange={e=>patch({due_date:e.target.value||null})}/></label>
 <label className="pb-full">Atelier associé (facultatif)<select value={f.workshop_slug??""} onChange={e=>patch({workshop_slug:e.target.value||null})}><option value="">Aucun atelier</option>{lessons.map(l=><option key={l.slug} value={l.slug}>S{l.week} · {l.title}</option>)}</select></label>
 {truncated&&<p className="pb-full">Liste limitée à 200 inscrits actifs.</p>}
 {fields.map(field=><label key={field.key}>{field.label}<textarea rows={4} value={f[field.key]} maxLength={field.max} placeholder={field.hint} onChange={e=>patch({[field.key]:e.target.value})}/></label>)}</div></fieldset>
 <div className="pb-checklist"><strong>Avant publication</strong><p>{briefIssues(f).length?"À compléter : "+briefIssues(f).join(" · "):"Le contenu pédagogique est complet."}</p><button className="pb-btn secondary" onClick={()=>setPreview(v=>!v)}>{preview?"Masquer":"Aperçu apprenant"}</button></div>
 {preview&&<div className="pb-preview"><span className="pb-kicker">APERÇU · NON PUBLIÉ</span><h3>{f.title||"Sans titre"}</h3><BriefContent b={f} lessons={lessons}/></div>}
 {notice&&<p role="alert" className="pb-alert">{notice.text}</p>}
 <div className="pb-actions"><button className="pb-btn secondary" disabled={pending} onClick={()=>{if(window.confirm("Fermer sans enregistrer ?")){setEditor(null);setNotice(null);}}}>Fermer</button><button className="pb-btn primary" disabled={pending||!f.learner_id||f.title.trim().length<3} onClick={()=>void run({intent:"draft",id:editor.id,revision:editor.revision,brief:f})}><Save size={16}/> Enregistrer le brouillon</button></div><p>La publication s'effectue ensuite depuis le brouillon enregistré.</p></section>}
 <section className="pb-panel"><div className="pb-heading"><div><span className="pb-kicker">ESPACE DE TRAVAIL</span><h2>{trainer?"Mes consignes":"Mes défis pratiques"}</h2></div></div>
 <div className="pb-toolbar"><div className="pb-filters">{filters.map(f=><button key={f.id} disabled={pending||!!editor} className={filter===f.id?"on":""} aria-pressed={filter===f.id} onClick={()=>filterTo(f.id)}>{f.label}</button>)}</div><input type="search" aria-label="Rechercher sur cette page" placeholder="Rechercher…" value={search} disabled={pending||dirty} onChange={e=>{setSearch(e.target.value);setSelected(null);}}/></div>
 {!current?<div className="pb-empty"><ClipboardCheck size={38}/><h3>Aucun défi affiché</h3><p>{filter!=="all"||search?"Modifie les filtres.":trainer?"Crée un premier brouillon.":"Les consignes de ton formateur apparaîtront ici."}</p></div>:<div className="pb-grid">
 <div className="pb-list">{list.map(b=><button key={b.id} disabled={pending||!!editor} className={"pb-card "+(current.id===b.id?"selected":"")} aria-pressed={current.id===b.id} onClick={()=>select(b.id)}><span className={"pb-status "+b.status}>{briefStatuses[b.status]}</span><strong>{b.title}</strong>{trainer&&<small>{b.learner_name||"Apprenant "+b.learner_id?.slice(0,8)}</small>}{b.due_date&&<small className={today&&isOverdue(b,today)?"pb-late":""}><CalendarDays size={13}/> {pretty(b.due_date)}{today&&isOverdue(b,today)?" · Échéance dépassée":""}</small>}</button>)}</div>
 <article className="pb-detail" id="pb-detail" tabIndex={-1}><span className={"pb-status "+current.status}>{briefStatuses[current.status]}</span><h2>{current.title}</h2>{current.due_date&&<p>Échéance indicative · {pretty(current.due_date)}</p>}
 {current.status==="cancelled"?<p>Ce défi a été annulé par le formateur.</p>:<BriefContent b={current} lessons={lessons}/>}
 {current.attempts.length>0&&<section className="pb-history"><h3><MessageSquare size={17}/> Remises et retours du formateur</h3>{current.attempts.map((a,i)=><div key={a.id} className="pb-attempt"><small>Tentative {current.attempts.length-i} · {timestamp(a.created_at)}</small>{safeEvidence(a.evidence_url)&&<a href={safeEvidence(a.evidence_url)!} target="_blank" rel="noopener noreferrer">Consulter la preuve <ExternalLink size={14}/></a>}{a.note&&<p>{a.note}</p>}{a.feedback&&<div className="pb-feedback"><strong>{a.outcome==="accepted"?"Travail accepté":"À reprendre"} · Retour humain</strong><p>{a.feedback}</p></div>}{!a.outcome&&<p>En attente du retour du formateur.</p>}</div>)}</section>}
 {!editor&&trainer&&current.status==="draft"&&<div className="pb-actions"><button className="pb-btn secondary" disabled={pending} onClick={()=>start(current)}>Modifier</button><button className="pb-btn primary" disabled={pending||briefIssues(briefFields(current)).length>0} onClick={()=>setConfirmation({intent:"publish",id:current.id,revision:current.revision})}><Send size={16}/> Attribuer le défi</button></div>}
 {!editor&&trainer&&["assigned","revision_requested"].includes(current.status)&&<button className="pb-btn secondary" disabled={pending} onClick={()=>setConfirmation({intent:"cancel",id:current.id,revision:current.revision})}>Annuler le défi</button>}
 {!editor&&!trainer&&current.editable&&["assigned","revision_requested"].includes(current.status)&&<section className="pb-response"><h3>Remettre mon travail</h3><label>Lien de preuve HTTPS<input type="url" maxLength={800} value={evidence} disabled={pending} onChange={e=>{setEvidence(e.target.value);setConfirmation(null);}} placeholder="https://…"/></label><label>Ce que j'ai réalisé<textarea rows={4} maxLength={2000} value={note} disabled={pending} onChange={e=>{setNote(e.target.value);setConfirmation(null);}}/></label><button className="pb-btn primary" disabled={pending||!safeEvidence(evidence)} onClick={()=>setConfirmation({intent:"submit",id:current.id,revision:current.revision,evidence_url:evidence,note})}><Send size={16}/> Envoyer au formateur</button></section>}
 {!editor&&trainer&&current.status==="submitted"&&current.attempts[0]&&!current.attempts[0].outcome&&<section className="pb-response"><h3>Mon retour pédagogique</h3><label>Commentaire et prochaine action<textarea rows={4} maxLength={2400} value={feedback} disabled={pending} onChange={e=>{setFeedback(e.target.value);setConfirmation(null);}} placeholder="Ce qui fonctionne, ce qui doit être amélioré…"/></label><div className="pb-actions">{(["revision_requested","accepted"] as const).map(outcome=><button key={outcome} className={"pb-btn "+(outcome==="accepted"?"primary":"secondary")} disabled={pending||feedback.trim().length<3} onClick={()=>setConfirmation({intent:"review",id:current.id,revision:current.revision,attempt_id:current.attempts[0].id,outcome,feedback})}>{outcome==="accepted"?"Accepter le travail":"Demander une reprise"}</button>)}</div></section>}
 {!trainer&&current.editable===false&&<p>Consultation seule : ton parcours est terminé.</p>}
 {confirmation&&confirmation.id===current.id&&<div className="pb-confirm"><strong>Confirmer cette action ?</strong><p>{confirmation.intent==="publish"?"Le défi sera visible par l'apprenant. Les consignes publiées ne sont plus modifiables.":confirmation.intent==="review"?"Le commentaire sera enregistré dans l'historique.":confirmation.intent==="submit"?"Cette tentative sera transmise au formateur.":"Le défi sera annulé."}</p><div className="pb-actions"><button className="pb-btn primary" disabled={pending} onClick={()=>void run(confirmation)}>{pending?"Enregistrement…":"Confirmer"}</button><button className="pb-btn secondary" disabled={pending} onClick={()=>setConfirmation(null)}>Retour</button></div></div>}
 {notice?.error&&!editor&&<p role="alert" className="pb-alert">{notice.text}</p>}
 </article></div>}
 <nav className="pb-pagination" aria-label="Pages des défis">{data.page>1&&<Link href={"?parcours="+encodeURIComponent(trackSlug)+"&page="+(data.page-1)}>← Précédente</Link>}<span>Page {data.page}</span>{data.has_next&&data.page<1000&&<Link href={"?parcours="+encodeURIComponent(trackSlug)+"&page="+(data.page+1)}>Suivante →</Link>}</nav>
 </section></div>;
}
