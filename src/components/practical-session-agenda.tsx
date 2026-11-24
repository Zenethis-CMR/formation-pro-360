"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {ArrowRight,CalendarDays,Clock3,MapPin,Video,Users,UserRound,Plus,ChevronRight,ClipboardList,BookOpen,CheckCircle2,Save,Send,ExternalLink,AlertCircle} from "lucide-react";
import {formats,statuses,newSession,sessionFields,localDateTime,toDoualaTimestamp,publicationIssues,safeMeetingLink,upcomingSession,sessionDate,sessionTime,type PracticalSession,type SessionFields,type SessionIntent,type SessionAgenda,type Participant} from "@/lib/practical-sessions";
import {savePracticalSession} from "@/app/espace/formateur/seances/actions";

type Filter="all"|"upcoming"|"draft"|"history";
const errors:Record<string,string>={revision_conflict:"Une version plus récente existe. Ton brouillon reste affiché : copie les modifications avant de recharger.",invalid_transition:"Cette séance ne peut plus changer de statut.",audience_locked:"Les participants d'une séance publiée ne peuvent plus être modifiés.",participant_not_eligible:"Cet apprenant n'est plus inscrit au parcours.",publication_requirements:"Vérifie les objectifs, le travail, le résultat, le lieu ou lien et la date future.",session_not_ended:"La séance doit être terminée avant de la clôturer.",invalid_session:"Vérifie les champs et leurs limites.",unavailable:"Le service est momentanément indisponible. Tes modifications restent affichées."};
const longFields=[{key:"objectives",label:"Objectifs pédagogiques",hint:"Ce que les apprenants sauront réaliser",max:1800},{key:"demonstration",label:"Démonstration en direct",hint:"Les étapes que tu vas montrer",max:2400},{key:"preparation",label:"À préparer avant la séance",hint:"Installation, documents ou prototype à apporter",max:1800},{key:"exercise",label:"Travail pratique",hint:"Les actions que les apprenants réaliseront avec toi",max:2400},{key:"resources",label:"Ressources et références",hint:"Liens ou références à consulter",max:1800},{key:"expected_result",label:"Résultat attendu",hint:"La preuve concrète à présenter à la fin",max:1800}] as const;
function Audience({session,trainer}:{session:PracticalSession;trainer:boolean}){
 const individual=trainer?!!session.learner_id:!!session.individual;
 return <span className="ps-audience">{individual?<UserRound size={14}/>:<Users size={14}/>} {individual?(trainer?session.learner_name||"Séance individuelle":"Individuelle"):"Collective"}</span>;
}
function SessionDetail({session,trainer}:{session:PracticalSession;trainer:boolean}){
 const link=safeMeetingLink(session.meeting_url);
 return <article className="ps-detail" aria-label="Détail de la séance">
  <div className="ps-detail-head"><div><span className={"ps-status "+session.status}>{statuses[session.status]}</span><h2>{session.title}</h2><p className="ps-meta"><CalendarDays size={15}/>{sessionDate(session)} <span>·</span> {sessionTime(session)} (Douala)</p><div className="ps-meta"><Audience session={session} trainer={trainer}/><span>·</span>{formats[session.format]}</div></div></div>
  {session.status==="cancelled"?<p className="ps-alert"><AlertCircle size={17}/> Séance annulée. {session.recap||"Attends les prochaines consignes du formateur."}</p>:<>
   {session.status==="published"&&<div className="ps-join"><div>{session.location&&<p><MapPin size={16}/>{session.location}</p>}<p><Clock3 size={16}/>{session.duration_minutes} minutes · Heure de Douala</p></div>{link&&<a className="ps-btn primary" href={link} target="_blank" rel="noopener noreferrer"><Video size={16}/> Ouvrir le lien <ExternalLink size={14}/></a>}</div>}
   <div className="ps-phases">
    <section><div className="ps-phase-label"><BookOpen size={17}/><span>01 · Avant la séance</span></div><h3>Préparation et objectifs</h3><strong>Objectifs</strong><p>{session.objectives||"À préciser par le formateur."}</p>{session.preparation&&<><strong>À préparer</strong><p>{session.preparation}</p></>}</section>
    <section><div className="ps-phase-label"><Users size={17}/><span>02 · Avec le formateur</span></div><h3>Démonstration et pratique</h3>{session.demonstration&&<><strong>Démonstration</strong><p>{session.demonstration}</p></>}<strong>Exercice</strong><p>{session.exercise||"À préciser par le formateur."}</p></section>
    <section><div className="ps-phase-label"><ClipboardList size={17}/><span>03 · Après la séance</span></div><h3>Réalisation attendue</h3><p>{session.expected_result||"À préciser par le formateur."}</p>{session.resources&&<><strong>Ressources</strong><p>{session.resources}</p></>}{session.recap&&<><strong>Compte rendu du formateur</strong><p>{session.recap}</p></>}</section>
   </div>
   {!trainer&&session.status!=="draft"&&<Link className="ps-inline-link" href="/espace/projet/accompagnement">Préparer mes questions pour le formateur <ArrowRight size={15}/></Link>}
  </>}
 </article>;
}
export function PracticalSessionAgenda({agenda,trainer,participants,participantsTruncated}:{agenda:SessionAgenda;trainer:boolean;participants:Participant[];participantsTruncated:boolean}){
 const router=useRouter();
 const [filter,setFilter]=useState<Filter>("all");
 const [search,setSearch]=useState("");
 const [selected,setSelected]=useState<string|null>(null);
 const [editor,setEditor]=useState<{id:string|null;revision:number;status:PracticalSession["status"];fields:SessionFields}|null>(null);
 const [date,setDate]=useState("");
 const [notice,setNotice]=useState("");
 const [pending,setPending]=useState(false);
 const [confirm,setConfirm]=useState<SessionIntent|null>(null);
 const [showPreview,setShowPreview]=useState(false);
 const active=useRef(false);
 const [now,setNow]=useState(0);
 useEffect(()=>{setNow(Date.now());const interval=setInterval(()=>setNow(Date.now()),60000);return ()=>clearInterval(interval);},[]);
 useEffect(()=>{if(!editor)return;const guard=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue="";};window.addEventListener("beforeunload",guard);return ()=>window.removeEventListener("beforeunload",guard);},[editor]);
 const sessions=agenda.sessions;
 const next=now?upcomingSession(sessions,now):null;
 const visible=sessions.filter(s=>{
  const upcoming=s.status==="published"&&(!now||Date.parse(s.starts_at)+s.duration_minutes*60000>now);
  return (filter==="all"||(filter==="upcoming"&&upcoming)||(filter==="draft"&&s.status==="draft")||(filter==="history"&&s.status!=="draft"&&!upcoming))&&
    [s.title,s.objectives,s.learner_name||""].some(v=>v.toLowerCase().includes(search.trim().toLowerCase()));
 });
 const current=visible.find(s=>s.id===selected)||visible[0]||null;
 const startEdit=(session?:PracticalSession)=>{
  if(editor||pending)return;
  const fields=session?sessionFields(session):newSession();
  setEditor({id:session?.id??null,revision:session?.revision??0,status:session?.status??"draft",fields});
  setDate(localDateTime(fields.starts_at));setNotice("");setConfirm(null);setShowPreview(false);
  requestAnimationFrame(()=>document.getElementById("ps-editor-title")?.focus());
 };
 const patch=(values:Partial<SessionFields>)=>{setEditor(e=>e?{...e,fields:{...e.fields,...values}}:null);setConfirm(null);setNotice("");};
 const fields=editor?{...editor.fields,starts_at:toDoualaTimestamp(date)||""}:null;
 const issues=fields?publicationIssues(fields):[];
 const canPublish=!!fields&&issues.length===0&&
  (editor?.status==="published"||!now||Date.parse(fields.starts_at)>now);
 async function save(intent:SessionIntent){
  if(!editor||!fields||active.current)return;
  if(intent==="publish"&&!canPublish){setNotice("Complète les éléments de publication et choisis une date future.");return;}
  if(!fields.starts_at||fields.title.trim().length<3||!Number.isInteger(fields.duration_minutes)||fields.duration_minutes<15||fields.duration_minutes>600){setNotice("Le titre, la date et la durée doivent être valides.");return;}
  active.current=true;setPending(true);setNotice("");
  try{
   const result=await savePracticalSession(editor.id,editor.revision,intent,fields);
   if(result.ok===true){
    setEditor(null);setConfirm(null);setShowPreview(false);setSelected(result.session.id);setFilter("all");setSearch("");
    setNotice(intent==="draft"?"Brouillon enregistré.":intent==="publish"?"Séance publiée.":intent==="complete"?"Séance clôturée.":"Séance annulée.");
    router.refresh();
   }else setNotice(errors[result.error]||"Enregistrement refusé. Vérifie les informations.");
  }catch{setNotice(errors.unavailable);}
  finally{active.current=false;setPending(false);}
 }
 const preview=editor&&fields?{...fields,id:editor.id||"preview",revision:editor.revision,updated_at:"",status:"published" as const,individual:!!fields.learner_id}:null;
 const filters:{id:Filter;label:string}[]=[{id:"all",label:"Toutes"},{id:"upcoming",label:"À venir"},...(trainer?[{id:"draft" as const,label:"Brouillons"}]:[]),{id:"history",label:"Historique"}];
 return <div className="ps-workspace">
  {notice&&!editor&&<p role="status" className="ps-notice"><CheckCircle2 size={17}/>{notice}</p>}
  <section className="ps-feature">
   <div className="ps-feature-main"><span className="ps-eyebrow"><CalendarDays size={15}/> {trainer?"TON PLANNING PÉDAGOGIQUE":"AVEC TON FORMATEUR"}</span>
    <h2>{next?next.title:now?"Aucune séance à venir sur cette page":"Ton agenda pratique"}</h2>
    {next?<><p>{sessionDate(next)} · {sessionTime(next)} · {formats[next.format]}</p><div className="ps-feature-actions"><button type="button" className="ps-btn light" onClick={()=>{setFilter("all");setSearch("");setSelected(next.id);document.getElementById("ps-agenda")?.scrollIntoView({behavior:"smooth"});}}>Voir la séance <ArrowRight size={16}/></button></div></>:<p>{trainer?"Prépare une nouvelle séance, puis publie-la lorsque les consignes sont prêtes.":"Les séances publiées par ton formateur apparaîtront ici."}</p>}
   </div><div className="ps-feature-date" aria-hidden="true">{next?<><span>{new Intl.DateTimeFormat("fr-FR",{month:"short",timeZone:"Africa/Douala"}).format(new Date(next.starts_at))}</span><strong>{localDateTime(next.starts_at).slice(8,10)}</strong><small>Heure de Douala</small></>:<CalendarDays size={58} strokeWidth={1.2}/>}</div>
  </section>
  <div className="ps-summary">{[{label:"Séances affichées",value:sessions.length},{label:"À venir / en cours",value:now?sessions.filter(s=>s.status==="published"&&Date.parse(s.starts_at)+s.duration_minutes*60000>now).length:"—"},{label:trainer?"Brouillons":"Clôturées",value:sessions.filter(s=>s.status===(trainer?"draft":"completed")).length}].map(m=><div key={m.label}><span>{m.label}</span><strong>{m.value}</strong></div>)}</div>
  {editor&&fields&&<section className="ps-editor" aria-labelledby="ps-editor-title">
   <div className="ps-section-heading"><div><span className="ps-kicker">ESPACE DE PRÉPARATION</span><h2 tabIndex={-1} id="ps-editor-title">{editor.id?"Modifier la séance":"Nouvelle séance"}</h2><p>Prépare les informations essentielles, puis les activités pédagogiques.</p></div><span className={"ps-status "+editor.status}>{statuses[editor.status]}</span></div>
   <fieldset disabled={pending} className="ps-fields">
    <section className="ps-form-block"><h3><span>01</span> Informations générales</h3><div className="ps-form-grid">
     <label className="ps-full">Titre<input value={fields.title} maxLength={140} onChange={e=>patch({title:e.target.value})} placeholder="Ex. Construire et tester le premier flux"/></label>
     <label>Jour et heure · Douala<input type="datetime-local" min="2000-01-01T00:00" max="2099-12-31T23:59" value={date} onChange={e=>{setDate(e.target.value);setConfirm(null);setNotice("");}}/></label>
     <label>Durée (minutes)<input type="number" min={15} max={600} step={15} value={fields.duration_minutes} onChange={e=>patch({duration_minutes:Number(e.target.value)})}/></label>
     <label>Participants<select value={fields.learner_id??""} disabled={editor.status==="published"} onChange={e=>patch({learner_id:e.target.value||null})}><option value="">Collective · inscrits actifs</option>{fields.learner_id&&!participants.some(p=>p.learner_id===fields.learner_id)&&<option value={fields.learner_id}>Apprenant déjà sélectionné</option>}{participants.map(p=><option key={p.learner_id} value={p.learner_id}>{p.preferred_name||"Apprenant "+p.learner_id.slice(0,8)}</option>)}</select></label>
     <label>Modalité<select value={fields.format} onChange={e=>patch({format:e.target.value as SessionFields["format"]})}>{Object.entries(formats).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
     {participantsTruncated&&<p className="ps-full ps-muted">Liste limitée aux 200 premiers inscrits actifs. Les autres ne peuvent pas être ciblés depuis cette version.</p>}
     {fields.format!=="online"&&<label className="ps-full">Lieu<input maxLength={300} value={fields.location} onChange={e=>patch({location:e.target.value})} placeholder="Salle ou adresse"/></label>}
     {fields.format!=="onsite"&&<label className="ps-full">Lien de réunion HTTPS<input type="url" maxLength={800} value={fields.meeting_url} onChange={e=>patch({meeting_url:e.target.value})} placeholder="https://…"/></label>}
    </div></section>
    <section className="ps-form-block"><h3><span>02</span> Contenu pédagogique</h3><div className="ps-form-grid">{longFields.map(f=><label key={f.key}>{f.label}<textarea rows={3} maxLength={f.max} value={fields[f.key]} onChange={e=>patch({[f.key]:e.target.value})} placeholder={f.hint}/></label>)}</div></section>
    <section className="ps-form-block"><h3><span>03</span> Compte rendu ou motif d'annulation</h3><label><textarea rows={3} maxLength={2400} value={fields.recap} onChange={e=>patch({recap:e.target.value})} placeholder="Retours, recommandations et prochaine étape…"/></label></section>
   </fieldset>
   <div className="ps-publication"><div><strong>{issues.length?"Éléments à compléter avant publication":"Informations de publication complétées"}</strong><p>{issues.length?issues.join(" · "):"Vérifie la date, les participants et l'aperçu apprenant."}</p></div><button className="ps-btn secondary" disabled={pending||!preview||!fields.starts_at} onClick={()=>setShowPreview(v=>!v)}>{showPreview?"Masquer l'aperçu":"Aperçu apprenant"}</button></div>
   {showPreview&&preview&&fields.starts_at&&<div className="ps-preview"><span className="ps-kicker">APERÇU · NON PUBLIÉ</span><SessionDetail session={preview} trainer={false}/></div>}
   {notice&&<p role="alert" className="ps-alert"><AlertCircle size={16}/>{notice}</p>}
   {confirm&&<div className="ps-confirm" role="status"><p>{confirm==="cancel"?"Confirmer l'annulation ? Les apprenants concernés verront le statut annulé.":confirm==="complete"?"Confirmer la clôture ? Seul le compte rendu sera enregistré avec le statut.":"Confirmer la publication ? La séance sera visible par les apprenants concernés."}</p><button disabled={pending} className="ps-btn primary" onClick={()=>void save(confirm)}>Confirmer</button><button disabled={pending} className="ps-btn secondary" onClick={()=>setConfirm(null)}>Retour</button></div>}
   <div className="ps-editor-actions"><button className="ps-btn secondary" disabled={pending} onClick={()=>{if(window.confirm("Fermer l'éditeur et perdre les modifications non enregistrées ?")){setEditor(null);setNotice("");setConfirm(null);}}}>Fermer</button>
    {editor.status==="draft"&&<button className="ps-btn secondary" disabled={pending} onClick={()=>void save("draft")}><Save size={15}/> Enregistrer le brouillon</button>}
    {editor.status==="published"&&<><button className="ps-btn secondary" disabled={pending} onClick={()=>setConfirm("cancel")}>Annuler la séance</button><button className="ps-btn secondary" disabled={pending} onClick={()=>setConfirm("complete")}>Clôturer</button></>}
    <button className="ps-btn primary" disabled={pending||!canPublish} onClick={()=>setConfirm("publish")}><Send size={15}/>{pending?"Enregistrement…":editor.status==="published"?"Publier les modifications":"Publier la séance"}</button></div>
  </section>}
  <section id="ps-agenda" className="ps-agenda">
   <div className="ps-section-heading"><div><span className="ps-kicker">AGENDA</span><h2>{trainer?"Toutes mes séances":"Mes séances pratiques"}</h2><p>Page {agenda.page} · dates en heure de Douala</p></div>{trainer&&<button className="ps-btn primary" disabled={!!editor||pending} onClick={()=>startEdit()}><Plus size={17}/> Nouvelle séance</button>}</div>
   <div className="ps-toolbar"><div className="ps-filters" aria-label="Filtrer les séances">{filters.map(f=><button key={f.id} className={filter===f.id?"on":""} aria-pressed={filter===f.id} onClick={()=>{setFilter(f.id);setSelected(null);}}>{f.label}</button>)}</div><input aria-label="Rechercher les séances de cette page" type="search" value={search} onChange={e=>{setSearch(e.target.value);setSelected(null);}} placeholder="Rechercher…"/></div>
   {!visible.length?<div className="ps-empty"><CalendarDays size={36}/><h3>Aucune séance affichée</h3><p>{search||filter!=="all"?"Modifie les filtres ou consulte une autre page.":trainer?"Crée une séance pour commencer.":"Attends les prochaines publications de ton formateur."}</p></div>:
    <div className="ps-agenda-grid"><div className="ps-list">{visible.map(s=><button key={s.id} className={"ps-session-card "+(current?.id===s.id?"selected":"")} aria-pressed={current?.id===s.id} onClick={()=>setSelected(s.id)}>
     <div className="ps-date-tile"><span>{new Intl.DateTimeFormat("fr-FR",{month:"short",timeZone:"Africa/Douala"}).format(new Date(s.starts_at))}</span><strong>{localDateTime(s.starts_at).slice(8,10)}</strong></div>
     <div className="ps-card-content"><span className={"ps-status "+s.status}>{statuses[s.status]}</span><strong>{s.title}</strong><small>{sessionTime(s)} · {formats[s.format]}</small><Audience session={s} trainer={trainer}/></div><ChevronRight size={17} className="ps-chevron"/>
    </button>)}</div><div className="ps-selection">{current&&<><SessionDetail session={current} trainer={trainer}/>{trainer&&["draft","published"].includes(current.status)&&<button className="ps-btn secondary" disabled={!!editor||pending} onClick={()=>startEdit(current)}>Modifier / gérer la séance <ArrowRight size={15}/></button>}</>}</div></div>}
   <nav className="ps-pagination" aria-label="Pages des séances">{agenda.page>1&&<Link href={"?page="+(agenda.page-1)}>← Précédente</Link>}<span>Page {agenda.page}</span>{agenda.has_next&&agenda.page<1000&&<Link href={"?page="+(agenda.page+1)}>Suivante →</Link>}</nav>
  </section>
 </div>;
}
