"use client";
import {formatWorkload} from "@/lib/ai-training-plans";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {BookOpen,CheckCircle2,ClipboardCheck,Clock3,Eye,FilePenLine,History,LockKeyhole,Save,Sparkles,TriangleAlert} from "lucide-react";
import {missingAuthoring,type CurriculumContent,type AuthoringDetail,type AuthoringHistory} from "@/lib/curriculum-authoring";
import {saveCurriculumRevision} from "@/app/espace/formateur/formations/authoring-actions";
const sections=[
 {label:"Cadrage",icon:FilePenLine,fields:["title","objective","minutes"]},
 {label:"Production",icon:BookOpen,fields:["demonstration","guided_work","independent_work"]},
 {label:"Méthodes IA",icon:Sparkles,fields:["ai_context","ai_procedure","ai_verification"]},
 {label:"Évaluation",icon:ClipboardCheck,fields:["resources","evidence","rubric"]},
 {label:"Aperçu",icon:Eye,fields:[]}
] as const;
const fields={
 title:["Titre","Intitulé orienté résultat.",160],objective:["Objectif","Ce que l’apprenant doit savoir faire et expliquer.",1500],
 demonstration:["Démonstration formateur","Décrire les étapes, les entrées, le résultat attendu et les points de vigilance.",6000],
 guided_work:["Exercice guidé","Préciser les actions à réaliser avec le formateur et les contrôles.",6000],
 independent_work:["Exercice autonome","Décrire la réalisation sur le projet, les cas limites et les preuves.",6000],
 ai_context:["Contexte et choix du modèle","Sources autorisées, contraintes, exemples, outils, confidentialité et budget.",4000],
 ai_procedure:["Procédure IA","Instructions structurées, étapes de production, alternatives et décisions humaines.",6000],
 ai_verification:["Vérification et sécurité","Tests, sources, erreurs, limites, permissions et corrections à documenter.",4000],
 resources:["Ressources (facultatif)","Références et outils à vérifier avant diffusion. Aucun secret ni donnée personnelle.",4000],
 evidence:["Livrable attendu","Preuves concrètes, démonstration et éléments permettant la correction.",3000]
} as const;
const errors:Record<string,string>={revision_conflict:"Une version plus récente existe. Tes saisies sont conservées : copie-les avant de recharger la dernière version.",incomplete:"Les champs requis et les quatre descripteurs doivent être complétés.",invalid_content:"Vérifie les limites des champs et le volume horaire.",unavailable:"Le serveur n’a pas confirmé l’enregistrement. Tes saisies restent affichées."};
const date=(value:string)=>new Intl.DateTimeFormat("fr-FR",{dateStyle:"medium",timeStyle:"short",timeZone:"Africa/Douala"}).format(new Date(value));
export function CurriculumEditor({slug,detail,initial,historical,proposal}:{slug:string;detail:AuthoringDetail;initial:CurriculumContent;historical:boolean;proposal?:CurriculumContent}){
 const [content,setContent]=useState(initial),[saved,setSaved]=useState(initial),[revision,setRevision]=useState(detail.current?.revision??0),[state,setState]=useState(detail.current?.state??"draft"),[history,setHistory]=useState<AuthoringHistory[]>(detail.history),[tab,setTab]=useState(0),[pending,setPending]=useState(false),[notice,setNotice]=useState<{error:boolean;text:string}|null>(null);
 const busy=useRef(false);
 const dirty=JSON.stringify(content)!==JSON.stringify(saved),missing=missingAuthoring(content);
 const validMinutes=Number.isInteger(content.minutes)&&content.minutes>=30&&content.minutes<=6000;
 const ready=missing.length===0&&validMinutes;
 const base="/espace/formateur/formations/"+encodeURIComponent(slug)+"/atelier/"+detail.lesson.id;
 useEffect(()=>{if(!dirty&&!pending)return;const guard=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue="";};window.addEventListener("beforeunload",guard);return()=>window.removeEventListener("beforeunload",guard);},[dirty,pending]);
 function field<K extends keyof CurriculumContent>(key:K,value:CurriculumContent[K]){setContent(c=>({...c,[key]:value}));}
 function allowLeave(){return !busy.current&&(!dirty||window.confirm("Quitter sans enregistrer les modifications ?"));}
 async function save(intent:"save"|"ready"){
  if(historical||busy.current||!validMinutes||intent==="ready"&&!ready)return;
  if(intent==="ready"&&!window.confirm("Marquer cette copie prête pour revue ? Elle restera privée et ne sera pas publiée."))return;
  busy.current=true;setPending(true);setNotice(null);
  try{const result=await saveCurriculumRevision(slug,detail.lesson.id,revision,intent,content);if(result.ok===true){const row=result.current;setContent(row.content);setSaved(row.content);setRevision(row.revision);setState(row.state);setHistory(h=>[{revision:row.revision,state:row.state,created_at:row.created_at},...h]);setNotice({error:false,text:intent==="ready"?"Révision enregistrée, prête pour revue. Aucune publication.":"Brouillon enregistré."});}else setNotice({error:true,text:errors[result.error]||errors.unavailable});}catch{setNotice({error:true,text:errors.unavailable});}finally{busy.current=false;setPending(false);}
 }
 function textField(key:keyof typeof fields){const [label,help,max]=fields[key];return <label className="ca-field" key={key}><span>{label}</span><small>{help}</small>{key==="title"?<input value={content[key]} maxLength={max} onChange={e=>field(key,e.target.value)} disabled={pending||historical}/>:<textarea rows={key==="objective"?3:6} value={content[key]} maxLength={max} onChange={e=>field(key,e.target.value)} disabled={pending||historical}/>}<small className="ca-count">{content[key].length}/{max}</small></label>;}
 return <>
 <Link className="ca-back" href={"/espace/formateur/formations?parcours="+encodeURIComponent(slug)} onClick={e=>{if(!allowLeave())e.preventDefault();}}>← Retour au programme</Link>
 <header className="ca-hero"><div><span><Sparkles size={16}/> CURRICULUM AUTHORING STUDIO</span><h1>{detail.lesson.title}</h1><p>{detail.lesson.module_title} · Leçon source v{detail.lesson.version} · {detail.lesson.status==="published"?"Publiée":"Brouillon"}</p></div><div className="ca-version"><LockKeyhole size={19}/><strong>{historical?"Historique":dirty?"Modifications locales":revision?state==="ready"?"Prêt pour revue":"Brouillon enregistré":"Nouvelle copie"}</strong><small>Révision {revision||"non enregistrée"}</small></div></header>
 {proposal&&!historical&&revision===0&&!dirty&&<section className="ca-proposal"><div><strong>Fiche de production disponible</strong><p>Démonstration, exercice guidé, prompt métier et critères observables. Proposition éditoriale non validée : adapte-la à ta séance avant de l’enregistrer.</p></div><button type="button" disabled={pending} onClick={()=>{if(!dirty&&revision===0&&window.confirm("Charger la fiche proposée dans cette copie non enregistrée ?")){setContent(proposal);setTab(1);}}}>Charger la fiche <Sparkles size={16}/></button></section>}
 <div className="ca-layout"><section className="ca-work"><nav className="ca-tabs" aria-label="Sections de rédaction">{sections.map(({label,icon:Icon},i)=><button type="button" key={label} aria-pressed={tab===i} onClick={()=>setTab(i)}><Icon size={18}/><span>{label}</span></button>)}</nav>
 <div className="ca-section"><h2>{sections[tab].label}</h2>
 {tab===4?<div className="ca-preview"><span>APERÇU PRIVÉ · NON PUBLIÉ</span><h2>{content.title||"Titre à renseigner"}</h2><p>{content.objective||"Objectif à renseigner"}</p><div className="ca-preview-hours"><Clock3 size={17}/> {formatWorkload(content.minutes)} de travail indicatif</div>{(["demonstration","guided_work","independent_work","ai_context","ai_procedure","ai_verification","resources","evidence"] as const).map(key=><section key={key}><h3>{fields[key][0]}</h3><p>{content[key]||"À compléter"}</p></section>)}<section><h3>Grille proposée · 100 points</h3>{content.rubric.map((c,i)=><div key={i}><strong>{c.label||"Critère "+(i+1)} · 25 pts</strong><p>{c.descriptor||"Descripteur à compléter"}</p></div>)}</section></div>:
 <>{sections[tab].fields.map(key=>key==="minutes"?<label className="ca-field" key={key}><span>Charge de travail (minutes)</span><small>De 30 à 6000 minutes. Durée calendaire calculée selon le rythme de l’apprenant, pas imposée.</small><input type="number" min={30} max={6000} step={15} value={content.minutes||""} onChange={e=>field("minutes",Number(e.target.value))} disabled={pending||historical}/><small>{validMinutes?formatWorkload(content.minutes):"Durée invalide"}</small></label>:key==="rubric"?<div className="ca-rubric" key={key}><h3>Quatre critères · 25 points chacun</h3>{content.rubric.map((c,i)=><div className="ca-criterion" key={i}><strong>Critère {i+1}</strong><label className="ca-field"><span>Intitulé</span><input value={c.label} maxLength={160} disabled={pending||historical} onChange={e=>field("rubric",content.rubric.map((x,j)=>j===i?{...x,label:e.target.value}:x))}/></label><label className="ca-field"><span>Descripteur de correction</span><textarea rows={3} value={c.descriptor} maxLength={1200} disabled={pending||historical} onChange={e=>field("rubric",content.rubric.map((x,j)=>j===i?{...x,descriptor:e.target.value}:x))}/></label></div>)}</div>:textField(key))}</>}
 </div>
 {!historical&&<footer className="ca-save"><div aria-live="polite">{notice?<span className={notice.error?"ca-error":"ca-success"}>{notice.text}</span>:<span>{pending?"Enregistrement en cours…":dirty?"Modifications non enregistrées":revision?"Dernière révision confirmée":"Aucune révision enregistrée"}</span>}</div><div><button type="button" disabled={pending||!validMinutes} onClick={()=>save("save")}><Save size={17}/> Enregistrer</button><button className="ca-primary" type="button" disabled={pending||!ready} onClick={()=>save("ready")}><CheckCircle2 size={17}/> Prêt pour revue</button></div></footer>}
 </section><aside className="ca-sidebar"><section><span className="ca-overline">PRÉPARATION</span><h2>Contrôle éditorial</h2><p>La préparation ne constitue pas une validation pédagogique ni une publication.</p><div className="ca-progress"><span style={{width:((10-missing.length)/10*100)+"%"}}/></div><strong>{10-missing.length}/10 groupes de contenu renseignés</strong><ul>{missing.map(k=><li key={k}><TriangleAlert size={14}/>{k==="rubric"?"Grille et descripteurs":fields[k as keyof typeof fields]?.[0]||k}</li>)}</ul>{!validMinutes&&<p className="ca-error">Charge de travail invalide.</p>}<p>Vérifie les méthodes, les ressources et les preuves avant de marquer la copie prête.</p></section><section><span className="ca-overline"><History size={16}/> HISTORIQUE</span><h2>Révisions conservées</h2>{historical&&<Link href={base}>Revenir à la dernière version</Link>}{history.length?history.map(row=><Link className="ca-history" key={row.revision} href={base+"?revision="+row.revision} onClick={e=>{if(!allowLeave())e.preventDefault();}}><strong>Révision {row.revision}</strong><small>{row.state==="ready"?"Prêt pour revue":"Brouillon"} · {date(row.created_at)}</small></Link>):<p>Aucune sauvegarde pour cet atelier.</p>}</section><section><LockKeyhole size={19}/><h2>Leçon officielle protégée</h2><p>Le studio conserve une copie de rédaction indépendante. Les consignes publiées, inscriptions, corrections et XP ne sont pas modifiés.</p></section></aside></div></>;
}
