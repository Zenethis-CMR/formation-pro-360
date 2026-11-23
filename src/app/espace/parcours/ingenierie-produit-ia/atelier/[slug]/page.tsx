import Link from "next/link";
import {notFound} from "next/navigation";
import {ArrowLeft,ArrowRight,ArrowUpRight,Award,BookOpen,CheckCircle2,ChevronRight,ClipboardCheck,Clock3,ExternalLink,Flag,LockKeyhole,MessageSquare,ShieldCheck,Sparkles,Target,TriangleAlert,Trophy} from "lucide-react";
import {requireRole} from "@/lib/auth/require-role";
import {backendRequest} from "@/lib/auth/backend";
import {pilotCourse} from "@/lib/v2-public-catalog";
import {v2WorkshopGuides} from "@/lib/v2-workshop-guides";
import {V2WorkshopChecklist,V2WorkshopCopyTools} from "@/components/v2-workshop-tools";
import {WorkshopNotebook} from "@/components/workshop-notebook";
import {WorkshopTrainerFeedback} from "@/components/workshop-trainer-feedback";
import type {WorkshopReview} from "@/lib/workshop-feedback";
import {WorkshopCoach} from "@/components/workshop-coach";
import {submitV2Lesson} from "@/app/espace/actions";

export const dynamic="force-dynamic";
type Module={id:string;slug:string;week:number;title:string;outcome:string;skills:string[]};
type Lesson={
  id:string;module_id:string;slug:string;version:number;status:"draft"|"published";
  title:string;objective:string;guided_work:string;independent_work:string;
  evidence_required:string;rubric:unknown[];
};
type Submission={
  id:string;lesson_id:string;module_id?:string;lesson_slug?:string;
  status:"pending"|"changes_requested"|"approved";
  url:string;note:string;score:number|null;feedback:string|null;
  created_at:string;reviewed_at:string|null;
};
type Detail={
  track:{slug:string;status:"draft"|"published"|"archived"};
  modules:Module[];lessons:Lesson[];submissions?:Submission[];
  lesson_access:"granted"|"locked";
  enrollment:"active"|"completed"|"paused"|"revoked"|null;
  enrollment_open:boolean;evaluation_open:boolean;xp_total:number;
  coach_available?:boolean;
};
const base="/espace/parcours/ingenierie-produit-ia";
const allLessons=pilotCourse.modules.flatMap(m=>m.lessons.map(l=>({
  slug:l.slug,title:l.title,objective:l.objective,evidence:l.evidence,
  moduleSlug:m.slug,moduleTitle:m.title,week:m.week,skills:m.skills
})));
const humanDate=(raw:string)=>{
  const date=new Date(raw);
  return Number.isFinite(date.getTime())?
    new Intl.DateTimeFormat("fr-FR",{dateStyle:"medium",timeZone:"Africa/Douala"}).format(date):
    "Date indisponible";
};
function rubricTitles(rubric:unknown[]):string[]{
  if(!Array.isArray(rubric))return [];
  return rubric.flatMap(item=>{
    if(typeof item==="string"&&item.trim())return [item.trim()];
    if(item&&typeof item==="object"&&"label" in item&&
      typeof item.label==="string")return [item.label];
    return [];
  }).slice(0,10);
}
export default async function V2WorkshopStudio({params,searchParams}:{
  params:Promise<{slug:string}>;
  searchParams:Promise<{livrable?:string;carnet?:string}>;
}){
  const {slug}=await params;
  const editorial=allLessons.find(item=>item.slug===slug);
  if(!editorial||!Object.hasOwn(v2WorkshopGuides,slug))notFound();
  await requireRole("learner");
  const query=await searchParams;
  const response=await backendRequest("/v1/training/catalog/ingenierie-produit-ia").catch(()=>null);
  const data:Detail|null=response?.ok?await response.json() as Detail:null;
  const module=data?.modules.find(m=>m.slug===editorial.moduleSlug);
  const entitlement=data?.track?.status==="published"&&
    data.lesson_access==="granted"&&
    (data.enrollment==="active"||data.enrollment==="completed");
  const matching=(entitlement&&module)?data.lessons.filter(l=>
    l.module_id===module.id&&l.slug===slug&&l.status==="published")
    .sort((a,b)=>b.version-a.version):[];
  const lesson=matching[0];
  const accessible=Boolean(entitlement&&lesson);
  const savedResponse=accessible&&lesson
    ?await backendRequest("/v1/training/catalog/ingenierie-produit-ia/lessons/"+
      lesson.id+"/notebook").catch(()=>null):null;
  const workbook= savedResponse?.ok?(
    (await savedResponse.json() as {notebook:{
      notes:string;next_action:string;reference_url:string|null;
      completed_steps:number[];updated_at:string|null
    }}).notebook
  ):null;
  // Editorial guides are server-only and are never rendered to unregistered users.
  const guide=accessible?v2WorkshopGuides[slug]:null;
  const history=accessible&&lesson?(data?.submissions||[]).filter(s=>
    (s.module_id===lesson.module_id&&s.lesson_slug===lesson.slug)||
    s.lesson_id===lesson.id).sort((a,b)=>Date.parse(b.created_at)-Date.parse(a.created_at)):[];
  const latest=history[0];
  const approved=history.some(s=>s.status==="approved");
  const canSubmit=Boolean(accessible&&data?.evaluation_open&&
    data?.enrollment==="active"&&!approved&&
    (!latest||latest.status==="changes_requested"));
  const position=allLessons.findIndex(l=>l.slug===slug);
  const previous=position>0?allLessons[position-1]:null;
  const next=position>=0&&position<allLessons.length-1?allLessons[position+1]:null;
  const verifiedLessons=new Set((data?.submissions||[]).filter(s=>s.status==="approved")
    .map(s=>s.module_id+":"+s.lesson_slug));
  const fullCourseValidated=accessible&&verifiedLessons.size===16&&Number(data?.xp_total??0)>=1600;
  const primaryHref=approved?"#retour-formateur":latest?.status==="pending"?"#livrable":
    latest?.status==="changes_requested"?"#retour-formateur":"#brief";
  const primaryLabel=approved?"Revoir ma correction":latest?.status==="pending"?"Suivre mon évaluation":
    latest?.status==="changes_requested"?"Reprendre après la correction":"Commencer par les consignes";
  const officialRubric=lesson?rubricTitles(lesson.rubric):[];
  // Only actual reviewed submissions, scoped to the signed-in learner, count.
  const latestReviewed=history.find(s=>s.status!=="pending"&&s.feedback&&
    s.reviewed_at!==null);
  const review:WorkshopReview|null=latestReviewed?{
    status:latestReviewed.status==="approved"?"approved":"changes_requested",
    score:latestReviewed.score,feedback:latestReviewed.feedback,
    reviewed_at:latestReviewed.reviewed_at
  }:null;
  const feedbackCriteria=officialRubric.length===4?
    officialRubric:(guide?.checks||[]);
  return <main className="page studio-page">
    <nav className="studio-breadcrumb" aria-label="Fil d'Ariane">
      <Link href="/espace/apprenant">Mon espace</Link><ChevronRight size={13}/>
      <Link href={base}>Ingénierie produit et IA</Link><ChevronRight size={13}/>
      <span>Semaine {editorial.week} · Atelier {(position%2)+1}</span>
    </nav>
    <header className="studio-hero">
      <div className="studio-hero-main">
        <span className="studio-eyebrow"><Sparkles size={14}/> STUDIO DE PRODUCTION · SEMAINE {editorial.week} / 8</span>
        <h1>{lesson?.title||editorial.title}<span>.</span></h1>
        <p>{lesson?.objective||editorial.objective}</p>
        <div className="studio-hero-tags"><span><BookOpen size={15}/> Atelier {position+1}/16</span>
          <span><Clock3 size={15}/> {v2WorkshopGuides[slug].minutes} min indicatives</span>
          <span><Award size={15}/> 100 XP après validation</span>
          {lesson&&<span><ShieldCheck size={15}/> Leçon officielle publiée</span>}
        </div>
        <div className="studio-hero-links"><a href={primaryHref} className="studio-hero-main-link">{primaryLabel} <ArrowRight size={16}/></a><Link href={base} className="studio-hero-secondary-link">Voir les 16 ateliers</Link></div>
      </div>
      <div className="studio-hero-side"><span>TON OBJECTIF DE LA SEMAINE</span>
        <strong>{editorial.moduleTitle}</strong>
        <small>{editorial.skills.join(" · ")}</small>
        <div className="studio-hero-progress"><span style={{width:((position+1)/16*100)+"%"}}/></div>
        <p>Position dans le programme, pas progression officiellement validée.</p>
      </div>
    </header>
    {query.carnet==="ok"&&<p className="alert success" role="status"><CheckCircle2 size={17}/> Carnet enregistré ! Les coches et notes sont maintenant synchronisées avec ton compte.</p>}
    {query.carnet==="invalide"&&<p className="alert danger" role="alert">Le carnet contient un champ incorrect. Vérifie le contenu et le lien.</p>}
    {query.carnet==="acces"&&<p className="alert danger" role="alert">Le carnet ne peut pas être enregistré : vérifie ton inscription.</p>}
    {query.carnet==="indisponible"&&<p className="alert danger" role="alert">La sauvegarde du carnet est temporairement indisponible. Copie tes notes avant de quitter.</p>}
    {query.livrable==="envoye"&&<p role="status" className="alert success"><CheckCircle2 size={17}/> Ton livrable a été transmis. Le formateur peut maintenant le corriger.</p>}
    {query.livrable==="erreur"&&<p role="alert" className="alert danger">Le dépôt n'a pas abouti. Vérifie ton lien et réessaie depuis ton atelier.</p>}
    {query.livrable==="acces"&&<p role="alert" className="alert danger">L'accès au dépôt est refusé. Vérifie que ton inscription est active et que la leçon est publiée.</p>}
    {query.livrable==="existant"&&<p role="alert" className="alert danger">Un dépôt est déjà en correction ou validé pour cet atelier. Consulte l'historique avant toute nouvelle tentative.</p>}
    {query.livrable==="limite"&&<p role="alert" className="alert danger">Trop de tentatives rapprochées. Réessaie plus tard.</p>}
    {!accessible?<section className="studio-access" role="status">
      <LockKeyhole size={27}/><div><h2>{data?.enrollment==="paused"||data?.enrollment==="revoked"?"Ton accès au pilote est suspendu":
        data?.enrollment===null?"Inscription requise pour ouvrir le studio":"Atelier momentanément indisponible"}</h2>
        <p>Les étapes détaillées, modèles de livrables et conseils de production sont réservés aux apprenants inscrits disposant d'un accès autorisé. La présentation publique des objectifs reste consultable.</p>
        <Link href={base}>Vérifier mon inscription et mes droits <ArrowRight size={16}/></Link>
      </div>
    </section>:
    <div className="studio-layout">
      <div className="studio-main">
        <section id="brief" className="studio-section studio-brief">
          <span className="studio-eyebrow"><Target size={15}/> 01 · COMPRENDRE LA MISSION</span>
          <h2>Ce que tu vas vraiment construire</h2>
          <p className="studio-leading">{guide?.brief}</p>
          <div className="studio-objective-card"><span>CONSIGNE OFFICIELLE · EXERCICE GUIDÉ</span><p>{lesson?.guided_work}</p></div>
          <div className="studio-objective-card is-independent"><span>CONSIGNE OFFICIELLE · TRAVAIL AUTONOME</span><p>{lesson?.independent_work}</p></div>
        </section>
        {guide&&(workbook&&lesson&&data?.enrollment==="active"?
          <WorkshopNotebook slug={slug} lessonId={lesson.id} steps={guide.steps}
            initial={workbook} review={review} criteria={feedbackCriteria}/>:
          <>
            {review&&<WorkshopTrainerFeedback review={review} criteria={feedbackCriteria}/>}
            <V2WorkshopChecklist steps={guide.steps}/>
            <section id="carnet" className="studio-section studio-workbook-fallback">
              <LockKeyhole size={20}/><div><h2>{data?.enrollment==="completed"?"Carnet en lecture seule":"La sauvegarde du carnet est indisponible"}</h2>
                <p>Tu peux consulter les consignes, mais les coches de cet écran ne sont pas synchronisées.</p>
                {workbook?.notes&&<blockquote>{workbook.notes}</blockquote>}
                {workbook?.next_action&&<p><strong>Prochaine action :</strong> {workbook.next_action}</p>}
              </div>
            </section>
          </>)}
        <section id="qualite" className="studio-section studio-quality">
          <span className="studio-eyebrow"><ShieldCheck size={15}/> 03 · AUTOÉVALUATION</span>
          <h2>Vérifie la qualité avant de soumettre</h2>
          <p>Utilise ces repères pour améliorer ton travail. Ils n'attribuent aucun point automatiquement : seule la note du formateur fait foi.</p>
          {officialRubric.length>0&&<div className="studio-official-rubric"><strong>Critères officiels de cette version</strong><ul>{officialRubric.map((criterion,i)=><li key={i}>{criterion}</li>)}</ul></div>}
          <div className="studio-quality-list">{guide?.checks.map((check,i)=><div key={i}>
            <span><CheckCircle2 size={18}/></span><div><small>CRITÈRE DE QUALITÉ {String(i+1).padStart(2,"0")}</small><p>{check}</p></div>
          </div>)}</div>
          <div className="studio-pitfalls"><h3><TriangleAlert size={17}/> Trois pièges à éviter</h3><ul>{guide?.errors.map((mistake,i)=><li key={i}>{mistake}</li>)}</ul></div>
        </section>
        <section id="boite-outils" className="studio-section">
          <span className="studio-eyebrow"><Sparkles size={15}/> 04 · BOÎTE À OUTILS</span>
          <h2>Des supports immédiatement réutilisables</h2>
          <p>Le modèle t'aide à produire une preuve concrète ; le prompt t'aide à réfléchir. Aucun contenu généré n'est une preuve de terrain.</p>
          {guide&&<V2WorkshopCopyTools prompt={guide.prompt} template={guide.template}/>}
        </section>
        {lesson&&data?.coach_available?
          <WorkshopCoach lessonId={lesson.id}
            trainerFeedback={review?.status==="changes_requested"?review.feedback:null}/>:
          <section id="coach" className="studio-section studio-coach-disabled">
            <span className="studio-eyebrow"><Sparkles size={15}/> ACCOMPAGNEMENT PERSONNALISÉ</span>
            <h2>Le coach interactif n'est pas encore activé.</h2>
            <p>Tu peux déjà utiliser le prompt de coaching et le modèle disponibles dans la boîte à outils, puis poser tes questions à ton formateur. Les réponses IA ne sont jamais simulées.</p>
          </section>}
        <section id="livrable" className="studio-section studio-delivery">
          <span className="studio-eyebrow"><Flag size={15}/> 05 · REMISE ET CORRECTION</span>
          <h2>Présente ton résultat au formateur</h2>
          <div className="studio-deliverable-required"><ClipboardCheck size={22}/><div>
            <strong>Preuve officiellement demandée</strong><p>{lesson?.evidence_required}</p>
          </div></div>
          {latest?.status==="pending"&&<div className="studio-evaluation-box">
            <Clock3 size={19}/><div><strong>Livrable en cours d'évaluation</strong><p>Le formateur examine ta preuve. Il n'est pas possible de déposer une deuxième version tant que cette correction est en attente.</p></div>
          </div>}
          {approved&&<div className="studio-evaluation-box is-approved">
            <CheckCircle2 size={19}/><div><strong>Atelier validé · 100 XP</strong><p>Le formateur a validé cet atelier. Tu peux consulter la correction et poursuivre le programme.</p></div>
          </div>}
          {latest?.status==="changes_requested"&&!approved&&<div className="studio-evaluation-box is-revision">
            <MessageSquare size={19}/><div><strong>Amélioration demandée</strong><p>Prends en compte le retour du formateur, corrige ta preuve et dépose une nouvelle version.</p></div>
          </div>}
          {canSubmit&&<form action={submitV2Lesson} className="studio-submission-form">
            <input type="hidden" name="lessonId" value={lesson?.id}/>
            <input type="hidden" name="workshopSlug" value={slug}/>
            <label htmlFor="studio-project-url">Lien HTTPS de ton livrable <span>obligatoire</span></label>
            <input id="studio-project-url" name="url" type="url" required maxLength={800}
              placeholder="https://github.com/… ou https://ton-produit.example"
              aria-describedby="studio-url-hint"/>
            <p id="studio-url-hint">Vérifie que le formateur pourra consulter le dépôt, la démonstration ou le dossier de preuve sans informations sensibles.</p>
            <label htmlFor="studio-project-note">Ce que tu as réalisé <span>jusqu'à 1 200 caractères</span></label>
            <textarea id="studio-project-note" name="note" rows={5} maxLength={1200}
              placeholder="Réalisation concrète, tests exécutés, résultats observés, points à améliorer. Ne mets pas de données personnelles dans cette note."/>
            <button type="submit"><ClipboardCheck size={18}/> Soumettre pour correction <ArrowRight size={16}/></button>
            <small>Une note d'au moins 80/100 attribue 100 XP, une seule fois pour cet atelier. Les coches d'autoévaluation ne sont pas transmises.</small>
          </form>}
          {!data?.evaluation_open&&<p className="studio-form-unavailable">Le dépôt est momentanément fermé ou ton compte ne possède pas le droit de soumettre. Les consignes restent accessibles en lecture.</p>}
          {history.length>0&&<div className="studio-review-history">
            <h3>Historique de mes tentatives ({history.length})</h3>
            {history.map((submission,i)=><article key={submission.id}>
              <div className="studio-review-top"><span>{submission.status==="approved"?"Validée":submission.status==="pending"?"En correction":"À améliorer"}</span><time dateTime={submission.created_at}>{humanDate(submission.created_at)}</time></div>
              <p>Tentative {history.length-i}{submission.score!==null?" · "+submission.score+"/100":""}</p>
              {submission.feedback&&<blockquote>{submission.feedback}</blockquote>}
              <a href={submission.url} target="_blank" rel="noopener noreferrer">Voir la preuve transmise <ExternalLink size={14}/></a>
            </article>)}
          </div>}
        </section>
        {fullCourseValidated&&<section className="studio-journey-finish" aria-label="Parcours entier validé">
          <Trophy size={29}/><div><span>16 ATELIERS APPROUVÉS · 1 600 XP ENREGISTRÉS</span>
            <h2>Tu as terminé le parcours pratique.</h2>
            <p>Constitue ton dossier de preuves et choisis les réalisations que tu souhaites présenter.
              Ce portfolio ne constitue pas un diplôme.</p>
            <Link href="/espace/portfolio">Préparer mon portfolio <ArrowRight size={16}/></Link>
          </div>
        </section>}
        <nav className="studio-next-nav" aria-label="Navigation entre ateliers">
          {previous?<Link href={base+"/atelier/"+previous.slug}><ArrowLeft size={16}/><span><small>ATELIER PRÉCÉDENT</small><strong>{previous.title}</strong></span></Link>:<span/>}
          {next?<Link href={base+"/atelier/"+next.slug}><span><small>ATELIER SUIVANT</small><strong>{next.title}</strong></span><ArrowRight size={16}/></Link>:<Link href={base}><span><small>FIN DU PARCOURS</small><strong>Revoir les huit semaines</strong></span><ArrowRight size={16}/></Link>}
        </nav>
      </div>
      <aside className="studio-aside" aria-label="Sommaire de l'atelier">
        <div className="studio-aside-card"><span>TON STUDIO D'ATELIER</span><strong>{editorial.title}</strong><div className="studio-aside-divider"/>
          <a href="#brief">01 · La mission</a><a href="#studio-checklist-title">02 · Les étapes</a>
          <a href="#carnet">03 · Carnet</a><a href="#qualite">04 · Qualité</a><a href="#boite-outils">05 · Modèles et outils</a>
          <a href="#coach">06 · Coach pédagogique</a>
          <a href="#livrable">07 · Remise du livrable</a>
          <div className="studio-aside-divider"/>
          <p>Statut : <b>{approved?"Validé":latest?.status==="pending"?"En correction":
            latest?.status==="changes_requested"?"À améliorer":"À réaliser"}</b></p>
          <Link href="/espace/apprenant?onglet=progression">Ma progression <ArrowUpRight size={15}/></Link>
        </div>
      </aside>
    </div>}
  </main>;
}
