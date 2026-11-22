import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpenCheck, CalendarDays, CheckCircle2, Clock3, GraduationCap, Rocket, ShieldCheck, Target } from "lucide-react";
import { requireRole } from "@/lib/auth/require-role";
import { saveLearnerPreferences } from "@/app/espace/actions";
import { learnerGoals, learnerLevels, type LearnerPreferences } from "@/lib/learner-preferences";
import { IntensiveScheduleSelector } from "@/components/intensive-schedule-selector";

type Props={searchParams:Promise<{error?:string}>};
type Mission={id:string;title:string;week:number;description:string};
export default async function WelcomeLearner({searchParams}:Props) {
  const {db}=await requireRole("learner");
  const query=await searchParams;
  const [{data:preferences,error:preferencesError},{data:missions,error:missionsError},
    {data:dependencies,error:dependenciesError},{data:xp,error:xpError}]=await Promise.all([
    db.from("learner_preferences").select("learner_id,preferred_name,goal,experience,minutes_per_day,regular_days,optional_days").maybeSingle(),
    db.from("missions").select("id,title,week,description").eq("published",true).order("week").order("created_at"),
    db.from("mission_prerequisites").select("mission_id,prerequisite_id"),
    db.from("xp_ledger").select("mission_id")
  ]);
  if(preferencesError||missionsError||dependenciesError||xpError) {
    return <main className="page"><p className="alert danger" role="alert">Ton espace d'accueil est momentanément indisponible. Tu peux toujours consulter tes missions.</p>
      <Link href="/espace/apprenant">Accéder à mon parcours</Link></main>;
  }
  const current=preferences as LearnerPreferences|null;
  const completed=new Set((xp||[]).map(a=>a.mission_id));
  const prerequisites=dependencies||[];
  const next=(missions as Mission[]||[]).find(m=>!completed.has(m.id)&&
    !prerequisites.some(p=>p.mission_id===m.id&&!completed.has(p.prerequisite_id)));
  return <main className="page learner-welcome-page">
    <Link className="workshop-back" href="/espace/apprenant"><ArrowLeft size={15}/> Mon parcours</Link>
    <header className="learner-welcome-hero">
      <span className="journey-overline"><GraduationCap size={15}/> TON POINT DE DÉPART</span>
      <h1>{current?"Fais évoluer ton parcours.":"Bienvenue dans ton atelier."}</h1>
      <p>Choisis ton objectif produit, tes jours disponibles et ton rythme intensif. La formation privilégie la conception et la pratique : 30 % pour comprendre et structurer, 70 % pour construire, tester et livrer.</p>
      <div className="learner-welcome-reassurance"><ShieldCheck size={16}/> Cette étape est facultative. Ton compte, tes travaux et tes XP sont conservés.</div>
    </header>
    <div className="learner-welcome-layout">
      <form action={saveLearnerPreferences} className="learner-welcome-form">
        {query.error&&<p className="alert danger" role="alert">Impossible d'enregistrer tes préférences. Vérifie les champs et réessaie.</p>}
        <section className="learner-welcome-card">
          <div className="learner-welcome-step-label"><span>01</span> Faisons connaissance</div>
          <h2>Comment souhaites-tu être appelé ?</h2>
          <label htmlFor="preferredName">Prénom ou nom d'usage</label>
          <input id="preferredName" name="preferredName" type="text" required minLength={2} maxLength={60}
            autoComplete="nickname" placeholder="Ex. Alex" defaultValue={current?.preferred_name||""}/>
          <p>Ce nom permettra au formateur de mieux t'identifier dans le suivi pédagogique.</p>
        </section>
        <fieldset className="learner-welcome-card">
          <legend className="learner-welcome-step-label"><span>02</span> Ton objectif</legend>
          <h2>Qu'aimerais-tu savoir construire ?</h2>
          <div className="learner-choice-grid">
            {learnerGoals.map((g,index)=><label className="learner-choice" key={g.value}>
              <input name="goal" value={g.value} type="radio" required defaultChecked={current?.goal?current.goal===g.value:index===1}/>
              <span className="learner-choice-content"><strong>{g.title}</strong><small>{g.detail}</small></span>
            </label>)}
          </div>
        </fieldset>
        <fieldset className="learner-welcome-card">
          <legend className="learner-welcome-step-label"><span>03</span> Ton niveau actuel</legend>
          <h2>D'où pars-tu aujourd'hui ?</h2>
          <div className="learner-choice-grid">
            {learnerLevels.map((l,index)=><label className="learner-choice" key={l.value}>
              <input name="experience" value={l.value} type="radio" required defaultChecked={current?.experience?current.experience===l.value:index===0}/>
              <span className="learner-choice-content"><strong>{l.title}</strong><small>{l.detail}</small></span>
            </label>)}
          </div>
        </fieldset>
        <IntensiveScheduleSelector regularDays={current?.regular_days||null}
          optionalDays={current?.optional_days||[]} initialMinutes={current?.minutes_per_day||300}/>
        <div className="learner-welcome-actions">
          <button type="submit" className="learner-welcome-submit"><CheckCircle2 size={18}/> Enregistrer et accéder à mon parcours <ArrowRight size={17}/></button>
          <Link href="/espace/apprenant">Passer cette étape pour le moment</Link>
        </div>
      </form>
      <aside className="learner-welcome-aside">
        <div className="learner-welcome-next">
          <span className="journey-overline"><Rocket size={15}/> PREMIÈRE ACTION CONCRÈTE</span>
          <h2>Ton prochain atelier</h2>
          {next?<><span className="learner-welcome-week">SEMAINE {next.week}</span><h3>{next.title}</h3><p>{next.description}</p>
            <Link href={"/espace/atelier/"+next.id}>Découvrir l'atelier <ArrowRight size={16}/></Link></>
            :<><p>Toutes tes missions accessibles sont terminées ou en attente de validation.</p>
            <Link href="/espace/apprenant">Voir mon parcours <ArrowRight size={16}/></Link></>}
        </div>
        <div className="learner-welcome-guide">
          <h3><Target size={17}/> Comment progresser ?</h3>
          <div><span>1</span><p>Lis les consignes d'une mission et construis ton projet.</p></div>
          <div><span>2</span><p>Teste ton travail, puis remets le lien du livrable.</p></div>
          <div><span>3</span><p>Reçois une correction. Tes XP arrivent uniquement après validation.</p></div>
        </div>
        <div className="learner-welcome-guide"><h3><CalendarDays size={17}/> Cadence exigeante, résultats concrets</h3>
          <p>Planifie au moins trois jours fixes et cinq heures de travail par séance. Ton formateur vérifie surtout tes livrables : conception, UX, ingénierie, tests et déploiement.</p>
          <Link href="/espace/apprenant?onglet=programme">Voir les huit semaines <ArrowRight size={15}/></Link>
        </div>
      </aside>
    </div>
  </main>;
}
