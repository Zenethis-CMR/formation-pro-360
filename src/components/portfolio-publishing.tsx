"use client";
import {useEffect,useState} from "react";
import {BadgeCheck,CheckCircle2,Clipboard,ExternalLink,EyeOff,Globe2,
  Link2,LockKeyhole,RefreshCcw,ShieldCheck,Trash2} from "lucide-react";
import type {VerifiedProject} from "@/components/learner-verified-portfolio";

type Publication={
  token:string;title:string;selected_submission_ids:string[];
  include_scores:boolean;include_links:boolean;
  published_at:string;updated_at:string;currently_accessible?:boolean;
};
const endpoint="/api/portfolio-publication";

/**
 * An owner must deliberately choose individual, verified projects and exactly
 * which additional details to disclose. No publishing on mount or by default.
 */
export function PortfolioPublishing({projects}:{projects:VerifiedProject[]}){
  const [publication,setPublication]=useState<Publication|null>(null);
  const [loaded,setLoaded]=useState(false);
  const [loadFailed,setLoadFailed]=useState(false);
  const [reloadKey,setReloadKey]=useState(0);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [saving,setSaving]=useState(false);
  const [chosen,setChosen]=useState<string[]>([]);
  const [title,setTitle]=useState("Mes réalisations en ingénierie produit et IA");
  const [scores,setScores]=useState(false);
  const [links,setLinks]=useState(false);
  const [copied,setCopied]=useState(false);
  const projectIdsKey=projects.map(item=>item.id).join("|");
  const url=publication?
    "https://formation.zenithis.tech/p/"+publication.token:"";
  useEffect(()=>{
    const controller=new AbortController();
    void(async()=>{
      try{
        const response=await fetch(endpoint,{signal:controller.signal,cache:"no-store"});
        if(!response.ok)throw Error("publication_unavailable");
        const state=await response.json() as {publication:Publication|null};
        if(controller.signal.aborted)return;
        const p=state.publication;
        setPublication(p);
        if(p){
          setChosen(p.selected_submission_ids.filter(id=>projects.some(item=>item.id===id)));
          setTitle(p.title);
          setScores(p.include_scores);
          setLinks(p.include_links);
        }
        setLoadFailed(false);
        setLoaded(true);
      }catch{
        if(!controller.signal.aborted){
          setLoadFailed(true);
          setLoaded(true);
        }
      }
    })();
    return ()=>controller.abort();
  },[projectIdsKey,reloadKey]);

  const toggle=(id:string)=>{
    setChosen(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id]);
    setNotice("");setCopied(false);
  };
  const changed=publication&&(
    title.trim()!==publication.title||
    scores!==publication.include_scores||
    links!==publication.include_links||
    chosen.length!==publication.selected_submission_ids.length||
    chosen.some(id=>!publication.selected_submission_ids.includes(id))
  );
  const publish=async()=>{
    if(saving||!loaded||loadFailed)return;
    if(chosen.length===0||chosen.length>16||title.trim().length<3||title.trim().length>80){
      setError("Sélectionne au moins un projet vérifié et saisis un titre entre 3 et 80 caractères.");
      return;
    }
    setSaving(true);setError("");setNotice("");
    try{
      const response=await fetch(endpoint,{method:"POST",credentials:"same-origin",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({submission_ids:chosen,title:title.trim(),
          include_scores:scores,include_links:links})});
      const body=await response.json() as {publication?:Publication;error?:string};
      if(!response.ok||!body.publication)throw Error(body.error||"failed");
      setPublication(body.publication);
      setChosen(body.publication.selected_submission_ids);
      setCopied(false);
      setNotice("Publication enregistrée. Le lien précédent, s'il existait, est maintenant désactivé.");
    }catch{
      setError("Publication impossible. Vérifie ton inscription et les projets sélectionnés.");
    }finally{setSaving(false);}
  };
  const revoke=async()=>{
    if(saving||!publication)return;
    if(!window.confirm("Désactiver ce lien public ? Tous ses destinataires perdront immédiatement l'accès."))return;
    setSaving(true);setError("");setNotice("");
    try{
      const response=await fetch(endpoint,{method:"DELETE",credentials:"same-origin"});
      if(!response.ok)throw Error("revoke_failed");
      setPublication(null);setChosen([]);setCopied(false);
      setScores(false);setLinks(false);
      setNotice("Lien désactivé. Ton portfolio privé et tous tes acquis sont conservés.");
    }catch{
      setError("La révocation n'a pas pu être confirmée. Réessaie.");
    }finally{setSaving(false);}
  };
  const copy=async()=>{
    if(!url)return;
    try{await navigator.clipboard.writeText(url);setCopied(true);}
    catch{setError("Copie manuellement le lien affiché ci-dessous.");}
  };

  return <section className="portfolio-sharing" aria-labelledby="portfolio-sharing-title">
    <header><span><Globe2 size={16}/> PARTAGE CONTRÔLÉ · FACULTATIF</span>
      <h2 id="portfolio-sharing-title">Présente tes projets à un recruteur ou un client.</h2>
      <p>Tu décides des projets visibles et tu peux retirer l'accès quand tu veux.
        Une personne qui possède le lien peut aussi le transmettre à d'autres personnes.</p>
    </header>
    {!loaded?<p className="portfolio-sharing-message" role="status">Vérification de ta configuration de partage…</p>:
    loadFailed?
      <div className="portfolio-sharing-error" role="alert">
        Impossible de vérifier ton partage actuel. Aucune publication n'a été modifiée.
        <button type="button" onClick={()=>{setLoadFailed(false);setLoaded(false);
          setReloadKey(k=>k+1);}}>Réessayer</button>
      </div>:
    projects.length===0?
      <div className="portfolio-sharing-empty"><LockKeyhole size={20}/>
        Publie après la validation de ton premier atelier par le formateur.
        Aucun projet fictif ne sera affiché.</div>:
    <>
      <fieldset className="portfolio-sharing-choices" disabled={saving}>
        <legend><BadgeCheck size={15}/> Choisis les réalisations à montrer</legend>
        {projects.map(project=><label key={project.id}>
          <input type="checkbox" checked={chosen.includes(project.id)}
            onChange={()=>toggle(project.id)}/>
          <span><strong>{project.lesson_title}</strong>
            <small>Module {project.week} · Projet validé</small></span>
        </label>)}
      </fieldset>
      <label className="portfolio-sharing-title">Titre public de ta présentation
        <input type="text" maxLength={80} minLength={3} value={title}
          onChange={e=>setTitle(e.target.value)} disabled={saving}/>
        <small>Évite d'indiquer ton nom, tes coordonnées ou des informations personnelles si tu souhaites rester anonyme.</small>
      </label>
      <fieldset className="portfolio-sharing-options" disabled={saving}>
        <legend><ShieldCheck size={15}/> Ce qui peut être visible publiquement</legend>
        <label><input type="checkbox" checked readOnly disabled/>
          Titres, compétences travaillées et validation réelle du formateur</label>
        <label><input type="checkbox" checked={scores}
          onChange={e=>setScores(e.target.checked)}/>
          Montrer les notes sur 100</label>
        <label><input type="checkbox" checked={links}
          onChange={e=>setLinks(e.target.checked)}/>
          Montrer les liens externes de mes projets</label>
        <p>Jamais publiés : email, identité de compte, carnet privé, commentaires du formateur, descriptions déposées et échanges avec Qwen3.</p>
      </fieldset>
      <div className="portfolio-sharing-actions">
        <button type="button" className="portfolio-sharing-publish" disabled={saving||chosen.length===0}
          onClick={publish}><Globe2 size={16}/>
          {saving?"Enregistrement…":publication?"Mettre à jour et changer de lien":"Créer mon lien public"}
        </button>
        {publication&&<button type="button" className="portfolio-sharing-revoke"
          disabled={saving} onClick={revoke}><Trash2 size={16}/> Désactiver le lien</button>}
      </div>
      {publication&&<div className="portfolio-sharing-link">
        <span><CheckCircle2 size={15}/>
          {publication.currently_accessible===false?
            "Lien actuellement inaccessible (inscription suspendue ou parcours archivé)":
            "Lien public actif"}
          {" · "}{publication.selected_submission_ids.length} projet(s)
        </span>
        {changed&&<p>Modifications non publiées : le lien actuel conserve ta précédente sélection. Publie pour appliquer tes choix.</p>}
        <div><input aria-label="Lien public du portfolio" value={url} readOnly onFocus={e=>e.target.select()}/>
          <button type="button" onClick={copy}><Clipboard size={15}/>{copied?"Copié":"Copier"}</button>
          <a href={url} target="_blank" rel="noopener noreferrer"><ExternalLink size={15}/> Aperçu</a>
        </div>
      </div>}
    </>}
    {notice&&<p className="portfolio-sharing-notice" role="status"><RefreshCcw size={15}/>{notice}</p>}
    {error&&!loadFailed&&<p className="portfolio-sharing-error" role="alert">{error}</p>}
    <p className="portfolio-sharing-footnote"><EyeOff size={14}/>
      Lien non indexé et révocable, mais toute personne à qui il est transmis peut le consulter tant qu'il est actif.</p>
  </section>;
}
