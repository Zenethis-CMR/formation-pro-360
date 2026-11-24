"use client";
import {WorkspaceSaveStatus} from "@/components/workspace-feedback";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {Plus,Save,Download,Pencil,Trash2,ArrowRight} from "lucide-react";
import {taskStatuses,taskPriorities,maxTasks,summarizeBacklog,sortTasks,canCompleteTask,localCalendarDate,type ProductTask,type ProductBacklog,type TaskStatus,type TaskPriority} from "@/lib/product-backlog";
import {pilotCourse} from "@/lib/v2-public-catalog";
import {saveProductBacklog} from "@/app/espace/projet/backlog/actions";
const course="/espace/parcours/ingenierie-produit-ia";
const lessons=pilotCourse.modules.flatMap(m=>m.lessons.map(l=>({slug:l.slug,title:l.title,week:m.week})));
const empty=():ProductTask=>({id:"",title:"",description:"",acceptance:"",status:"todo",priority:"normal",workshop:null,due_date:null,estimate_minutes:0});
const errors={invalid:"Vérifie les champs, les dates, les limites et les critères des tâches terminées.",conflict:"Une version plus récente existe. Ton brouillon est conservé ici : exporte-le avant de recharger pour comparer.",access:"Ton accès ne permet plus l'enregistrement.",unavailable:"Sauvegarde indisponible. Ton brouillon reste dans cet écran : réessaie ou exporte-le."};
const duration=(min:number)=>Math.floor(min/60)+" h"+(min%60?" "+String(min%60).padStart(2,"0")+" min":"");
export function ProductBacklogBoard({initial,editable}:{initial:ProductBacklog|null;editable:boolean}){
 const [tasks,setTasks]=useState<ProductTask[]>(()=>initial?.tasks??[]);
 const [baseline,setBaseline]=useState(()=>JSON.stringify(initial?.tasks??[]));
 const [revision,setRevision]=useState(initial?.revision??0);
 const [savedAt,setSavedAt]=useState(initial?.updated_at??null);
 const [editing,setEditing]=useState<ProductTask|null>(null);
 const [deleting,setDeleting]=useState<string|null>(null);
 const [search,setSearch]=useState("");
 const [priority,setPriority]=useState("all");
 const [workshop,setWorkshop]=useState("all");
 const [statusFilter,setStatusFilter]=useState<"all"|TaskStatus>("all");
 const [pending,setPending]=useState(false);
 const saving=useRef(false);
 const [notice,setNotice]=useState<{error:boolean;text:string}|null>(null);
 const [formError,setFormError]=useState("");
 const dirty=JSON.stringify(tasks)!==baseline;
 const today=localCalendarDate();
 const summary=summarizeBacklog(tasks,today);
 const filtered=sortTasks(tasks.filter(t=>(priority==="all"||t.priority===priority)&&(workshop==="all"||(workshop==="none"?!t.workshop:t.workshop===workshop))&&[t.title,t.description,t.acceptance].some(s=>s.toLowerCase().includes(search.trim().toLowerCase()))));
 useEffect(()=>{if(!dirty&&!editing)return;const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue="";};window.addEventListener("beforeunload",warn);return ()=>window.removeEventListener("beforeunload",warn);},[dirty,editing]);
 const begin=(task:ProductTask)=>{setEditing({...task});setFormError("");setDeleting(null);requestAnimationFrame(()=>document.getElementById("task-title")?.focus());};
 const change=(patch:Partial<ProductTask>)=>setEditing(old=>old?{...old,...patch}:null);
 const apply=()=>{
  if(!editing||!editable||pending)return;
  const task={...editing,title:editing.title.trim(),description:editing.description.trim(),acceptance:editing.acceptance.trim()};
  if(!task.title){setFormError("Ajoute un titre.");return;}
  if(task.status==="done"&&!canCompleteTask(task)){setFormError("Précise comment vérifier la tâche avant de la déclarer terminée.");return;}
  if(!Number.isInteger(task.estimate_minutes)||task.estimate_minutes<0||task.estimate_minutes>6000){setFormError("Estimation invalide.");return;}
  if(!task.id&&tasks.length>=maxTasks){setFormError("Limite de 80 tâches atteinte.");return;}
  setTasks(old=>task.id?old.map(t=>t.id===task.id?task:t):[...old,{...task,id:crypto.randomUUID()}]);
  setEditing(null);setNotice(null);setFormError("");
 };
 const move=(task:ProductTask,status:TaskStatus)=>{
  if(!editable||pending||editing)return;
  if(status==="done"&&!canCompleteTask(task)){begin({...task,status});setFormError("Définis le critère de vérification avant de terminer.");return;}
  setTasks(old=>old.map(t=>t.id===task.id?{...t,status}:t));setNotice(null);
 };
 const save=async()=>{
  if(!editable||!dirty||saving.current||editing)return;
  saving.current=true;setPending(true);setNotice(null);
  try{
   const result=await saveProductBacklog(revision,tasks);
   if(result.ok===true){setTasks(result.backlog.tasks);setBaseline(JSON.stringify(result.backlog.tasks));setRevision(result.backlog.revision);setSavedAt(result.backlog.updated_at);setNotice({error:false,text:"Backlog enregistré."});}
   else setNotice({error:true,text:errors[result.error]});
  }catch{setNotice({error:true,text:errors.unavailable});}
  finally{saving.current=false;setPending(false);}
 };
 const exportTasks=()=>{
  const url=URL.createObjectURL(new Blob([JSON.stringify({type:"formation-pro-private-backlog",tasks},null,2)],{type:"application/json;charset=utf-8"}));
  const a=document.createElement("a");a.href=url;a.download="mon-backlog.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 return <section className="backlog-workspace" aria-label="Tableau Kanban privé">
  <div className="backlog-stats">{[{label:"Tâches",value:summary.total},{label:"Terminées (déclarées)",value:summary.done},{label:"En cours",value:summary.active},{label:"À tester",value:summary.testing},{label:"Échéances dépassées",value:summary.overdue},{label:"Charge restante estimée",value:duration(summary.remainingMinutes)}].map(s=><div key={s.label}><small>{s.label}</small><strong>{s.value}</strong></div>)}</div>
  <p className="backlog-note">Les tâches et échéances sont tes propres repères. Aucun statut Kanban n'attribue d'XP et aucune estimation n'est une mesure du temps travaillé. Les ateliers sont validés uniquement par le formateur.</p>
  {!editable&&<p role="status">Ton tableau est consultable en lecture seule.</p>}
  <div className="backlog-toolbar"><label>Rechercher<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Titre ou description"/></label>
   <label>Priorité<select value={priority} onChange={e=>setPriority(e.target.value)}><option value="all">Toutes</option>{taskPriorities.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label>
   <label>Atelier<select value={workshop} onChange={e=>setWorkshop(e.target.value)}><option value="all">Tous</option><option value="none">Sans atelier</option>{lessons.map(l=><option key={l.slug} value={l.slug}>S{l.week} · {l.title}</option>)}</select></label>
   {editable&&<button className="backlog-primary" type="button" disabled={pending||!!editing||tasks.length>=maxTasks} onClick={()=>begin(empty())}><Plus size={16}/> Nouvelle tâche</button>}
  </div>
  {editing&&<form className="backlog-edit" onSubmit={e=>{e.preventDefault();apply();}}>
   <h2>{editing.id?"Modifier la tâche":"Créer une tâche"}</h2>
   <div className="backlog-edit-grid">
    <label>Titre<input id="task-title" value={editing.title} required maxLength={140} onChange={e=>change({title:e.target.value})}/></label>
    <label>Priorité<select value={editing.priority} onChange={e=>change({priority:e.target.value as TaskPriority})}>{taskPriorities.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label>
    <label>Description<textarea rows={3} maxLength={1000} value={editing.description} onChange={e=>change({description:e.target.value})}/></label>
    <label>Critère d'acceptation<textarea rows={3} maxLength={800} value={editing.acceptance} onChange={e=>change({acceptance:e.target.value})} placeholder="Comment prouver que cette tâche fonctionne ?"/></label>
    <label>Statut<select value={editing.status} onChange={e=>change({status:e.target.value as TaskStatus})}>{taskStatuses.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></label>
    <label>Atelier associé<select value={editing.workshop??""} onChange={e=>change({workshop:e.target.value||null})}><option value="">Aucun (facultatif)</option>{lessons.map(l=><option key={l.slug} value={l.slug}>S{l.week} · {l.title}</option>)}</select></label>
    <label>Échéance personnelle<input type="date" min="2000-01-01" max="2100-12-31" value={editing.due_date??""} onChange={e=>change({due_date:e.target.value||null})}/></label>
    <label>Estimation en minutes<input type="number" min={0} max={6000} step={1} value={editing.estimate_minutes} onChange={e=>change({estimate_minutes:Number(e.target.value)})}/></label>
   </div>
   {formError&&<p role="alert" className="backlog-error">{formError}</p>}
   <div className="backlog-buttons"><button type="submit" className="backlog-primary">Appliquer au brouillon</button><button type="button" onClick={()=>{setEditing(null);setFormError("");}}>Annuler</button></div>
  </form>}
  <div className="pw-board-heading"><div><h2>Tableau de travail</h2><p>{filtered.length} tâche(s) correspondant aux filtres.</p></div><label>Afficher une colonne<select value={statusFilter} onChange={e=>setStatusFilter(e.target.value as "all"|TaskStatus)}><option value="all">Toutes les colonnes</option>{taskStatuses.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></label></div>
  <div className={"backlog-board"+(statusFilter==="all"?"":" pw-board-single")}>{taskStatuses.filter(s=>statusFilter==="all"||s.id===statusFilter).map(column=>{
   const items=filtered.filter(t=>t.status===column.id);
   return <section key={column.id} className={"backlog-column "+column.id} aria-label={column.label}>
    <h2>{column.label} <span>{items.length}</span></h2>
    {!items.length&&<p className="backlog-empty">{tasks.length?"Aucune tâche dans cette colonne avec les filtres actuels.":"Ton tableau est vide. Crée une première tâche à partir de ton projet."}</p>}
    {items.map(task=><article className="backlog-task" key={task.id}>
     <div className="backlog-task-top"><span className={"backlog-priority "+task.priority}>{taskPriorities.find(p=>p.id===task.priority)?.label}</span>{task.due_date&&<time className={task.status!=="done"&&task.due_date<today?"backlog-error":""} dateTime={task.due_date}>{task.due_date.split("-").reverse().join("/")}</time>}</div>
     <h3>{task.title}</h3>{task.description&&<p>{task.description}</p>}
     {task.acceptance&&<p><strong>Vérification :</strong> {task.acceptance}</p>}
     {task.estimate_minutes>0&&<small>Estimée : {duration(task.estimate_minutes)}</small>}
     {task.workshop&&<Link href={course+"/atelier/"+task.workshop}>Atelier associé <ArrowRight size={13}/></Link>}
     {editable&&<><label className="backlog-status">Déplacer vers<select aria-label={"Statut de "+task.title} value={task.status} disabled={pending||!!editing} onChange={e=>move(task,e.target.value as TaskStatus)}>{taskStatuses.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></label>
     <div className="backlog-buttons"><button type="button" disabled={pending||!!editing} onClick={()=>begin(task)}><Pencil size={14}/> Modifier</button><button type="button" disabled={pending||!!editing} onClick={()=>setDeleting(task.id)} aria-label={"Supprimer "+task.title}><Trash2 size={14}/></button></div>
     {deleting===task.id&&<div className="backlog-delete"><p>Retirer cette tâche du brouillon ?</p><button type="button" disabled={pending||!!editing} onClick={()=>{setTasks(old=>old.filter(t=>t.id!==task.id));setDeleting(null);setNotice(null);}}>Confirmer</button><button type="button" onClick={()=>setDeleting(null)}>Annuler</button></div>}</>}
    </article>)}
   </section>;
  })}</div>
  <div className="backlog-save"><div><WorkspaceSaveStatus pending={pending} dirty={dirty||!!editing} saved={!!savedAt} error={!!notice?.error} readOnly={!editable}/>{savedAt&&<small>Version {revision}</small>}{editing&&<small>Applique ou annule la tâche en cours avant de sauvegarder.</small>}{notice&&<p role={notice.error?"alert":"status"} className={notice.error?"backlog-error":""}>{notice.text}</p>}</div>
   <div className="backlog-buttons"><button type="button" onClick={exportTasks}><Download size={16}/> Export JSON</button>{editable&&<button type="button" className="backlog-primary" disabled={pending||!dirty||!!editing} onClick={()=>void save()}><Save size={16}/>{pending?"Enregistrement…":"Enregistrer le tableau"}</button>}</div>
  </div>
 </section>;
}
