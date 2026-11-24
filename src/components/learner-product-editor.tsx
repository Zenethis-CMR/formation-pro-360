"use client";
import {useEffect,useState,useRef} from "react";
import {Download,Save,ArrowRight,CheckCircle2} from "lucide-react";
import {emptyDossier,projectSections,type ProductDossier,type ProductProject,type ProjectKey,safeProjectLink} from "@/lib/learner-product-project";
import {saveProductProject} from "@/app/espace/projet/actions";

const errors={invalid:"Un champ dépasse la limite ou contient un lien incorrect. Utilise des liens HTTPS sans identifiants.",conflict:"Une autre session a enregistré une version plus récente. Ton texte est conservé ici : exporte-le avant de recharger la page pour comparer les versions.",access:"Ton accès ne permet plus l'enregistrement. Tu peux exporter ton brouillon.",unavailable:"La sauvegarde est momentanément indisponible. Ton brouillon reste dans cet écran : réessaie ou exporte-le."};
export function LearnerProductEditor({initial,editable}:{initial:ProductProject|null;editable:boolean}){
 const [draft,setDraft]=useState<ProductDossier>(()=>initial?.dossier??emptyDossier());
 const [baseline,setBaseline]=useState<ProductDossier>(()=>initial?.dossier??emptyDossier());
 const [revision,setRevision]=useState(initial?.revision??0);
 const [savedAt,setSavedAt]=useState(initial?.updated_at??null);
 const [status,setStatus]=useState<{kind:"ok"|"error";message:string}|null>(null);
 const [pending,setPending]=useState(false);
 const saving=useRef(false);
 const dirty=Object.keys(draft).some(key=>draft[key as ProjectKey]!==baseline[key as ProjectKey]);
 useEffect(()=>{
  if(!dirty)return;
  const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue="";};
  window.addEventListener("beforeunload",warn);
  return ()=>window.removeEventListener("beforeunload",warn);
 },[dirty]);
 const change=(key:ProjectKey,value:string)=>{setDraft(old=>({...old,[key]:value}));setStatus(null);};
 const save=async()=>{
  if(saving.current||!editable)return;
  saving.current=true;setPending(true);setStatus(null);
  try{
   const result=await saveProductProject(revision,draft);
   if(result.ok){setDraft(result.project.dossier);setBaseline(result.project.dossier);setRevision(result.project.revision);setSavedAt(result.project.updated_at);setStatus({kind:"ok",message:"Ton dossier a été enregistré."});}
   else setStatus({kind:"error",message:errors[result.error]});
  }catch{setStatus({kind:"error",message:errors.unavailable});}
  finally{saving.current=false;setPending(false);}
 };
 const exportDraft=()=>{
  const lines=["# Dossier produit — "+(draft.name||"Sans titre"),"", "Document privé : informations déclarées par l'apprenant, non certifiées.",...projectSections.flatMap(section=>["","## "+section.title,...section.fields.flatMap(field=>["","### "+field.label,draft[field.key]||"À compléter"])])];
  const url=URL.createObjectURL(new Blob([lines.join("\n")],{type:"text/markdown;charset=utf-8"}));
  const a=document.createElement("a");a.href=url;a.download="mon-projet-formation-pro.md";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 const fieldsCount=projectSections.reduce((n,s)=>n+s.fields.length,0);
 const filled=projectSections.reduce((n,s)=>n+s.fields.filter(f=>draft[f.key]?.trim()).length,0);
 return <section className="product-editor" aria-labelledby="product-editor-title">
  <div className="product-workspace-heading">
   <div><span className="journey-overline">DOSSIER DE CONCEPTION · PRIVÉ</span><h2 id="product-editor-title">{draft.name||"Mon dossier produit"}</h2>
    <p>{draft.pitch||"Construis progressivement ton dossier au fil des ateliers."}</p></div>
   <div className="product-editor-metric"><strong>{filled}/{fieldsCount}</strong><span>champs renseignés</span></div>
  </div>
  <progress value={filled} max={fieldsCount} aria-label="Champs du dossier renseignés"/>
  <p className="product-note">Le remplissage du dossier ne valide aucun atelier. Ne saisis ni clé API, ni mot de passe, ni donnée personnelle de client.</p>
  <nav className="product-section-nav" aria-label="Sections du dossier produit">{projectSections.map(s=><a key={s.id} href={"#project-"+s.id}>{s.title}<span>{s.fields.filter(f=>draft[f.key]?.trim()).length}/{s.fields.length}</span></a>)}</nav>
  {!editable&&<p className="product-note" role="status">Ton parcours est terminé : le dossier reste consultable et exportable en lecture seule.</p>}
  <form onSubmit={e=>{e.preventDefault();void save();}}>
   <fieldset disabled={!editable||pending} className="product-fields">
    {projectSections.map((section,index)=><section className="product-form-section" id={"project-"+section.id} key={section.id}>
     <div className="product-form-heading"><span>{String(index+1).padStart(2,"0")}</span><div><h3>{section.title}</h3><p>{section.description}</p></div></div>
     <div className="product-form-grid">{section.fields.map(field=>{
      const isLink="link" in field;
      const link=isLink?safeProjectLink(draft[field.key]||""):null;
      return <div key={field.key} className={"product-field"+(isLink?" product-link-field":"")}>
       <label htmlFor={"product-"+field.key}>{field.label}</label>
       {isLink||field.max<=400?<input id={"product-"+field.key} name={field.key} type={isLink?"url":"text"} value={draft[field.key]||""} maxLength={field.max} placeholder={isLink?"https://…":"À compléter"} onChange={e=>change(field.key,e.target.value)}/>:
        <textarea id={"product-"+field.key} name={field.key} rows={4} value={draft[field.key]||""} maxLength={field.max} placeholder="À compléter au fil de ton projet…" onChange={e=>change(field.key,e.target.value)}/>}
       {link&&<a href={link} target="_blank" rel="noopener noreferrer">Ouvrir la référence <ArrowRight size={13}/></a>}
      </div>;
     })}</div>
    </section>)}
   </fieldset>
   <div className="product-save-bar">
    <div><strong>{dirty?"Modifications non enregistrées":savedAt?"Dossier enregistré":"Premier enregistrement à effectuer"}</strong>
     {savedAt&&<small>Version {revision} · {new Intl.DateTimeFormat("fr-FR",{dateStyle:"short",timeStyle:"short",timeZone:"Africa/Douala"}).format(new Date(savedAt))}</small>}
     {status&&<p role={status.kind==="error"?"alert":"status"} className={status.kind==="error"?"product-error":"product-success"}>{status.message}</p>}
    </div>
    <div className="product-save-actions"><button type="button" onClick={exportDraft} className="product-export"><Download size={16}/> Exporter le dossier</button>
    {editable&&<button type="submit" disabled={pending||!dirty} className="product-save">{pending?"Enregistrement…":<><Save size={16}/> Enregistrer</>}</button>}</div>
   </div>
  </form>
 </section>;
}
