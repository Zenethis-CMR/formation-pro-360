import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, GraduationCap, Rocket, ShieldCheck, Target } from "lucide-react";
import { requireRole } from "@/lib/auth/require-role";
import { getV2DashboardPilot } from "@/lib/v2-dashboard-pilot";
import { pilotCourse } from "@/lib/v2-public-catalog";
import { type LearnerPreferences } from "@/lib/learner-preferences";
import { LearnerOnboardingWizard } from "@/components/learner-onboarding-wizard";
import "./onboarding.css";

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
  const pilot=await getV2DashboardPilot();
  const enrolled=pilot.enrollment==="active"||pilot.enrollment==="completed";
  const primaryLesson=enrolled&&pilot.resumeSlug?pilotCourse.modules.flatMap(
    m=>m.lessons.map(l=>({...l,week:m.week}))
  ).find(l=>l.slug===pilot.resumeSlug):null;
  return <main className="page learner-welcome-page">
    <Link className="workshop-back" href="/espace/apprenant"><ArrowLeft size={15}/> Tableau de bord</Link>
    <header className="learner-welcome-hero">
      <span className="journey-overline"><GraduationCap size={15}/> TON POINT DE DÉPART</span>
      <h1>{current?"Fais évoluer ton parcours.":"Bienvenue dans ton atelier."}</h1>
      <p>Choisis ton objectif produit, tes jours disponibles et ton rythme intensif. La formation privilégie la conception et la pratique : 30 % pour comprendre et structurer, 70 % pour construire, tester et livrer.</p>
      <div className="learner-welcome-reassurance"><ShieldCheck size={16}/> Cette étape est facultative. Tu peux rejoindre ton premier atelier sans la compléter.</div>
    </header>
    <div className="learner-welcome-layout">
      <LearnerOnboardingWizard current={current} initialError={!!query.error}/>
      <aside className="learner-welcome-aside onboarding-context">
        <div className="learner-welcome-next">
          <span className="journey-overline"><Rocket size={15}/> PREMIÈRE ACTION CONCRÈTE</span>
          <h2>Ton prochain atelier</h2>
          {primaryLesson?<><span className="learner-welcome-week">SEMAINE {primaryLesson.week}</span>
            <h3>{primaryLesson.title}</h3><p>{primaryLesson.objective}</p>
            <Link href={"/espace/parcours/ingenierie-produit-ia/atelier/"+primaryLesson.slug}>
              Reprendre mon atelier principal <ArrowRight size={16}/></Link></>
          :enrolled?<><p>Tes ateliers principaux sont terminés ou en correction.</p>
            <Link href="/espace/parcours/ingenierie-produit-ia">Revoir mes ateliers <ArrowRight size={16}/></Link></>
          :pilot.published?<><h3>Ingénierie produit et IA</h3>
            <p>Ouvre le parcours pour découvrir les ateliers et vérifier ton inscription.</p>
            <Link href="/espace/parcours/ingenierie-produit-ia">Ouvrir mon parcours <ArrowRight size={16}/></Link></>
          :next?<><span className="learner-welcome-week">AUTRE RÉALISATION · SEMAINE {next.week}</span>
            <h3>{next.title}</h3><p>{next.description}</p>
            <Link href={"/espace/atelier/"+next.id}>Découvrir l'atelier complémentaire <ArrowRight size={16}/></Link></>
          :<><p>Consulte tes réalisations et le calendrier des activités.</p>
            <Link href="/espace/apprenant">Voir mon espace <ArrowRight size={16}/></Link></>}
        </div>
        <div className="learner-welcome-guide">
          <h3><Target size={17}/> Comment progresser ?</h3>
          <div><span>1</span><p>Travaille les consignes et les démonstrations avec ton formateur, puis construis ton projet.</p></div>
          <div><span>2</span><p>Teste ton travail, puis remets le lien du livrable.</p></div>
          <div><span>3</span><p>Reçois une correction. Tes XP arrivent uniquement après validation.</p></div>
        </div>
        <div className="learner-welcome-guide"><h3><CalendarDays size={17}/> Cadence exigeante, résultats concrets</h3>
          <p>Planifie au moins trois jours fixes et cinq heures de travail par séance. Ton formateur vérifie surtout tes livrables : conception, UX, ingénierie, tests et déploiement.</p>
          <Link href="/espace/parcours/ingenierie-produit-ia">Voir les huit semaines du parcours principal <ArrowRight size={15}/></Link>
        </div>
      </aside>
    </div>
  </main>;
}
