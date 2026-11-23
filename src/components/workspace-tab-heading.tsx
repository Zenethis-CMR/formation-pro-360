import Link from "next/link";
import { ArrowLeft, BarChart3, BookOpenCheck, CalendarDays, ClipboardCheck, Users } from "lucide-react";

type Role="learner"|"trainer";
const content={
  learner:{
    missions:{eyebrow:"ATELIERS ET LIVRABLES",title:"Mes missions",description:"Retrouve tes ateliers, les prérequis, les livrables attendus et l'état de tes corrections.",icon:BookOpenCheck},
    progression:{eyebrow:"SUIVI DE TOUTES MES RÉALISATIONS",title:"Ma progression",description:"Suis tes ateliers, tes validations et tes XP, ainsi que les badges acquis sur tes autres projets.",icon:BarChart3},
    programme:{eyebrow:"ORGANISATION DES 8 SEMAINES",title:"Mon programme",description:"Visualise ton calendrier pédagogique et les compétences à construire semaine après semaine.",icon:CalendarDays}
  },
  trainer:{
    evaluations:{eyebrow:"ÉVALUATIONS ET HISTORIQUE",title:"Évaluations",description:"Suis les corrections du parcours principal et retrouve l'historique des autres réalisations.",icon:ClipboardCheck},
    apprenants:{eyebrow:"ACCOMPAGNEMENT ET COHORTE",title:"Mes apprenants",description:"Suis la progression de chaque apprenant, ses projets et ses besoins d'accompagnement.",icon:Users},
    programme:{eyebrow:"PLANIFICATION ET CRÉATION",title:"Programme et ateliers",description:"Planifie les semaines, gère les missions publiées et rédige les nouveaux ateliers.",icon:CalendarDays}
  }
};
export function WorkspaceTabHeading({role,tab}:{role:Role;tab:string}){
  const section=(content[role] as Record<string,{eyebrow:string;title:string;description:string;icon:typeof BookOpenCheck}>)[tab];
  if(!section)return null;
  const Icon=section.icon;
  return <header className="workspace-tab-header">
    <div className="workspace-tab-heading-copy">
      <span className="workspace-tab-eyebrow"><Icon size={16}/>{section.eyebrow}</span>
      <h1>{section.title}<span>.</span></h1>
      <p>{section.description}</p>
    </div>
    <Link className="workspace-tab-back" href={role==="trainer"?"/espace/formateur":"/espace/apprenant"}>
      <ArrowLeft size={15}/> Tableau de bord
    </Link>
  </header>;
}
