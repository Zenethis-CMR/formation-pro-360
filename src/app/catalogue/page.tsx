import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, GraduationCap, Layers3, Rocket, Sparkles, Palette, PenTool, BarChart3, Workflow, ShieldCheck, BriefcaseBusiness } from "lucide-react";
import { pilotCourse, specializations } from "@/lib/v2-public-catalog";
import { specializationPrograms } from "@/lib/specialization-programs";
import "./curriculum-360.css";
import {getAiTrainingPlan,estimateTraining} from "@/lib/ai-training-plans";
import {getCatalogStudyRhythm} from "@/lib/catalog-study-rhythm";
import {TrainingDuration} from "@/components/training-duration";
const icons={palette:Palette,pen:PenTool,chart:BarChart3,workflow:Workflow,shield:ShieldCheck,briefcase:BriefcaseBusiness};
const detailedCount=1+specializationPrograms.length;
const modules=pilotCourse.modules.length+specializationPrograms.reduce((n,p)=>n+p.modules.length,0);
const workshops=pilotCourse.modules.reduce((n,m)=>n+m.lessons.length,0)+specializationPrograms.reduce((n,p)=>n+p.modules.reduce((a,m)=>a+m.lessons.length,0),0);
export const metadata:Metadata={
  title:"Catalogue des formations 360 | Formation Pro 360",
  description:"Sept formations pratiques assistées par IA, avec une charge de travail définie et une durée adaptée à ton rythme."
};
export default async function CataloguePage(){
 const {rhythm,learner}=await getCatalogStudyRhythm();
 const pilotPlan=getAiTrainingPlan(pilotCourse.slug)!;
 const estimate=estimateTraining(1,rhythm);
  return <main className="v2catalog cf360">
    <header className="v2catalog-nav"><Link href="/catalogue" className="v2catalog-brand"><span><GraduationCap size={22}/></span>Formation <b>Pro 360</b></Link><nav aria-label="Accès aux espaces"><Link href="/login">Se connecter</Link><Link href="/espace" className="v2catalog-nav-primary">Mon espace <ArrowRight size={15}/></Link></nav></header>
    <div className="v2catalog-body">
      <section className="v2catalog-hero">
        <div className="v2catalog-hero-content"><span className="v2catalog-overline"><Sparkles size={14}/> CATALOGUE DES FORMATIONS 360</span><h1>Apprends à créer, lancer et faire grandir des <em>produits réels.</em></h1>
          <p>Découvre sept programmes axés sur des projets concrets. Le parcours Ingénierie produit et IA est ouvert ; les six autres programmes sont consultables avant leur validation et leur ouverture.</p>
          <Link className="v2catalog-main-link" href="/catalogue/ingenierie-produit-ia">Découvrir le parcours produit et IA <ArrowRight size={18}/></Link>
        </div>
        <div className="v2catalog-hero-metrics" aria-label="Le programme en chiffres">
          <div><strong>{String(detailedCount).padStart(2,"0")}</strong><span>Programmes détaillés</span></div>
          <div><strong>{modules}</strong><span>Modules prévus</span></div>
          <div><strong>{workshops}</strong><span>Activités pratiques conçues ou proposées</span></div>
        </div>
      </section>
      <section className="v2catalog-section" aria-labelledby="v2catalog-title"><div className="v2catalog-heading"><div><span>CHOISIS TON DOMAINE</span><h2 id="v2catalog-title">Les formations 360</h2></div><p>Sept parcours orientés résultats : la charge est définie par formation, la durée dépend de ton rythme. Six programmes restent fermés aux inscriptions.</p></div>
        <div className="ai-rhythm-banner"><div><strong>{estimate?"Ton rythme : "+estimate.weeklyHours+" h/semaine":"Calcule ta durée personnelle"}</strong><p>{estimate?"Les estimations utilisent tes jours fixes et tes heures enregistrés.":"Connecte-toi et renseigne tes disponibilités pour voir une estimation sur chaque formation."}</p></div><Link href={learner?"/espace/bienvenue":"/login"}>{estimate?"Modifier mon rythme":learner?"Définir mon rythme":"Me connecter"} <ArrowRight size={15}/></Link></div>
        <div className="v2catalog-feature">
          <div className="v2catalog-feature-symbol"><BrainCircuit size={34}/></div>
          <div className="v2catalog-feature-copy"><span className="v2catalog-state">FORMATION DISPONIBLE</span><h3>{pilotCourse.name}</h3><p>Concevoir, développer, tester, déployer et commercialiser un produit numérique avec des méthodes IA professionnelles.</p>
            <div className="v2catalog-chips"><TrainingDuration plan={pilotPlan} rhythm={rhythm} compact/><span><BookOpen size={14}/> 16 ateliers</span><span><Rocket size={14}/> MVP et essais commerciaux</span></div>
            <div className="v2catalog-feature-actions"><Link href="/catalogue/ingenierie-produit-ia" className="v2catalog-link">Voir les 16 ateliers <ArrowRight size={16}/></Link><Link href="/espace/parcours/ingenierie-produit-ia" className="v2catalog-enrollment-link">Rejoindre le pilote <ArrowRight size={16}/></Link></div>
          </div>
        </div>
        <div className="v2catalog-grid">{specializations.map((track,i)=>{const Icon=icons[track.icon];const plan=getAiTrainingPlan(track.slug);return <article key={track.slug} className="v2catalog-track cf360-track" data-tone={track.icon}>
          <div className="cf360-track-visual"><span><Icon size={34} strokeWidth={1.6}/></span><span className="v2catalog-soon">PROGRAMME DÉTAILLÉ · EN PRÉPARATION</span></div>
          <div className="cf360-track-body"><span className="v2catalog-track-index">0{i+2} · INSCRIPTIONS FERMÉES</span><h3>{track.name}</h3><p>{track.summary}</p><div className="cf360-track-meta">{plan&&<TrainingDuration plan={plan} rhythm={rhythm} compact/>}<span>Défis pratiques · IA</span></div><div className="v2catalog-track-deliverable"><CheckCircle2 size={15}/><span><b>Projet final :</b> {track.deliverable}</span></div><Link href={"/catalogue/"+track.slug}>Explorer le programme <ArrowRight size={16}/></Link></div>
        </article>})}</div>
      </section>
      <section className="v2catalog-note" aria-label="Information sur les inscriptions"><Layers3 size={21}/><div><strong>Parcours ouvert : inscription depuis ton espace personnel</strong><p>Le parcours Ingénierie produit et IA est publié. Connecte-toi pour vérifier ton éligibilité, t'inscrire gratuitement et réaliser les ateliers. Les six autres formations restent fermées aux inscriptions, mais leurs programmes détaillés sont consultables. Tes réalisations précédentes et leurs récompenses sont conservées.</p></div><Link href="/espace/parcours/ingenierie-produit-ia">Ouvrir le pilote <ArrowRight size={15}/></Link></section>
      <footer className="v2catalog-footer"><span>© Formation Pro 360 · Catalogue des formations</span><Link href="/login">Connexion</Link></footer>
    </div>
  </main>;
}
