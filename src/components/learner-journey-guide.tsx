import Link from "next/link";
import {ArrowRight,CheckCircle2,LockKeyhole,ShieldCheck,Sparkles,Trophy} from "lucide-react";
import type {V2DashboardPilot} from "@/lib/v2-dashboard-pilot";
import {pilotCourse} from "@/lib/v2-public-catalog";

const route="/espace/parcours/ingenierie-produit-ia";
export function LearnerJourneyGuide({pilot,profileSaved}:{pilot:V2DashboardPilot;profileSaved:boolean}){
  const enrolled=pilot.enrollment==="active"||pilot.enrollment==="completed";
  const finished=enrolled&&pilot.approved===16&&pilot.xp>=1600;
  const unavailable=!pilot.published;
  const suspended=pilot.enrollment==="paused"||pilot.enrollment==="revoked";
  const lesson=pilot.resumeSlug?pilotCourse.modules.flatMap(m=>m.lessons.map(l=>({
    slug:l.slug,title:l.title,week:m.week
  }))).find(l=>l.slug===pilot.resumeSlug):null;
  const noMoreLessons=enrolled&&!lesson;
  const stage=unavailable?"unavailable":
    suspended?"suspended":
    finished?"complete":
    !enrolled&&!profileSaved?"profile":
    !enrolled?"enroll":
    lesson&&pilot.approved>0?"continue":
    lesson?"first":
    pilot.pending>0?"review":"verify";
  const message={
    unavailable:{title:"Découvre ta prochaine formation.",detail:"Le programme est consultable. L'accès aux ateliers sera proposé dès son ouverture.",
      action:"Explorer les 8 modules",href:route},
    suspended:{title:"Ton inscription est en pause.",detail:"Tes projets et XP restent conservés. Consulte ton statut et contacte le formateur pour reprendre.",
      action:"Voir mon inscription",href:route},
    profile:{title:"Bienvenue ! Voici comment démarrer.",detail:"Personnalise ton objectif et ton rythme en quelques étapes, ou passe directement à la formation : ce choix est facultatif.",
      action:"Définir mon objectif",href:"/espace/bienvenue"},
    enroll:{title:"Prêt à passer à la pratique ?",detail:pilot.enrollmentOpen
      ?"Rejoins le parcours depuis sa présentation, puis réalise ton premier livrable guidé."
      :"Découvre les 16 ateliers. Ton inscription sera possible quand les accès seront ouverts.",
      action:pilot.enrollmentOpen?"Rejoindre les ateliers":"Découvrir le parcours",href:route},
    first:{title:"Ton premier atelier t'attend.",detail:"Lis les consignes, construis, garde tes notes dans le carnet et soumets une preuve réelle pour la correction.",
      action:"Commencer mon premier atelier",href:lesson?route+"/atelier/"+lesson.slug:route},
    continue:{title:"Reprends exactement où tu en es.",detail:lesson?
      "Prochaine réalisation : "+lesson.title+". Tu peux consulter tes étapes et ton carnet.":"Poursuis tes ateliers.",
      action:"Reprendre mon atelier",href:lesson?route+"/atelier/"+lesson.slug:route},
    review:{title:"Une correction est en attente.",detail:"Le formateur étudie tes livrables. Suis les retours et les actions utiles dans ta progression.",
      action:"Suivre mes corrections",href:"/espace/apprenant?onglet=progression"},
    verify:{title:"Fais le point sur tes validations.",detail:"Tous les éléments nécessaires pour déclarer le parcours terminé ne sont pas encore enregistrés.",
      action:"Voir mes résultats",href:"/espace/apprenant?onglet=progression"},
    complete:{title:"Bravo, tes 16 ateliers sont validés !",detail:"Les validations humaines et leurs XP sont enregistrés. Tu peux maintenant sélectionner les réalisations à présenter.",
      action:"Construire mon portfolio",href:"/espace/portfolio"}
  }[stage];
  const steps=[
    {label:"Compte",done:true,href:"/espace/compte",optional:false},
    {label:"Objectif",done:profileSaved,href:"/espace/bienvenue",optional:true},
    {label:"Inscription",done:enrolled,href:route,optional:false},
    {label:"16 ateliers",done:finished,href:"/espace/apprenant?onglet=progression",optional:false},
    {label:"Portfolio",done:false,href:"/espace/portfolio",optional:false}
  ];
  return <section className={"learner-journey-guide"+(finished?" is-complete":"")} aria-labelledby="learner-journey-title">
    <header className="learner-journey-top">
      <div><span className="learner-journey-kicker">
        {finished?<Trophy size={16}/>:<Sparkles size={16}/>}
        {finished?"PARCOURS VALIDÉ":"TON PROCHAIN PAS · UN OBJECTIF À LA FOIS"}</span>
        <h2 id="learner-journey-title">{message.title}</h2>
        <p>{message.detail}</p>
      </div>
      <div className="learner-journey-actions">
        <Link href={message.href} className="learner-journey-cta">{message.action}<ArrowRight size={16}/></Link>
        {stage==="profile"&&<Link className="learner-journey-skip" href={route}>Passer cette étape <ArrowRight size={14}/></Link>}
      </div>
    </header>
    <ol className="learner-journey-steps" aria-label="Les étapes de mon apprentissage">
      {steps.map((item,i)=><li key={item.label}
        className={item.done?"is-done":((stage==="profile"&&i===1)||(stage==="enroll"&&i===2)||
          (enrolled&&!finished&&i===3)||(finished&&i===4))?"is-current":"is-upcoming"}>
        <Link href={item.href}>
          <span>{item.done?<CheckCircle2 size={16}/>:i+1}</span>
          <strong>{item.label}</strong>{item.optional&&<small>Facultatif</small>}
        </Link>
      </li>)}
    </ol>
    {enrolled?<div className="learner-journey-metrics">
      <span><ShieldCheck size={15}/> {pilot.approved}/16 ateliers approuvés · {pilot.xp} XP enregistrés</span>
      <div role="progressbar" aria-label="Ateliers validés" aria-valuemin={0} aria-valuemax={16} aria-valuenow={Math.min(16,Math.max(0,pilot.approved))}>
        <i style={{width:Math.min(100,Math.max(0,pilot.approved/16*100))+"%"}}/>
      </div>
    </div>:<p className="learner-journey-help"><LockKeyhole size={14}/>
      Les XP dépendent toujours d'une correction du formateur, jamais de l'onboarding.</p>}
  </section>;
}
