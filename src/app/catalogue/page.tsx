import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, Clock3, GraduationCap, Layers3, Rocket, Sparkles } from "lucide-react";
import { pilotCourse, specializations } from "@/lib/v2-public-catalog";
export const metadata:Metadata={
  title:"Catalogue des formations 360 | Formation Pro 360",
  description:"Découvrez les sept formations 360, dont le parcours Ingénierie produit et IA : 8 semaines et 16 ateliers pratiques."
};
export default function CataloguePage(){
  return <main className="v2catalog">
    <header className="v2catalog-nav"><Link href="/catalogue" className="v2catalog-brand"><span><GraduationCap size={22}/></span>Formation <b>Pro 360</b></Link><nav aria-label="Accès aux espaces"><Link href="/login">Se connecter</Link><Link href="/espace" className="v2catalog-nav-primary">Mon espace <ArrowRight size={15}/></Link></nav></header>
    <div className="v2catalog-body">
      <section className="v2catalog-hero">
        <div className="v2catalog-hero-content"><span className="v2catalog-overline"><Sparkles size={14}/> CATALOGUE DES FORMATIONS 360</span><h1>Apprends à créer, lancer et faire grandir des <em>produits réels.</em></h1>
          <p>Sept spécialisations conçues autour de projets concrets. Découvre le premier programme détaillé : de l'idée au MVP, puis aux premiers essais de commercialisation.</p>
          <Link className="v2catalog-main-link" href="/catalogue/ingenierie-produit-ia">Découvrir le parcours produit et IA <ArrowRight size={18}/></Link>
        </div>
        <div className="v2catalog-hero-metrics" aria-label="Le programme en chiffres">
          <div><strong>07</strong><span>Formations prévues</span></div>
          <div><strong>08</strong><span>Semaines détaillées</span></div>
          <div><strong>16</strong><span>Ateliers conçus</span></div>
        </div>
      </section>
      <section className="v2catalog-section" aria-labelledby="v2catalog-title"><div className="v2catalog-heading"><div><span>CHOISIS TON DOMAINE</span><h2 id="v2catalog-title">Les formations 360</h2></div><p>Le premier programme est consultable. Les six spécialisations suivantes seront ouvertes progressivement, après validation pédagogique.</p></div>
        <div className="v2catalog-feature">
          <div className="v2catalog-feature-symbol"><BrainCircuit size={34}/></div>
          <div className="v2catalog-feature-copy"><span className="v2catalog-state">PILOTE V2 ACTIVÉ</span><h3>{pilotCourse.name}</h3><p>{pilotCourse.summary}</p>
            <div className="v2catalog-chips"><span><Clock3 size={14}/> 8 semaines</span><span><BookOpen size={14}/> 16 ateliers</span><span><Rocket size={14}/> MVP au mois 1</span></div>
            <div className="v2catalog-feature-actions"><Link href="/catalogue/ingenierie-produit-ia" className="v2catalog-link">Voir les 16 ateliers <ArrowRight size={16}/></Link><Link href="/espace/parcours/ingenierie-produit-ia" className="v2catalog-enrollment-link">Rejoindre le pilote <ArrowRight size={16}/></Link></div>
          </div>
        </div>
        <div className="v2catalog-grid">{specializations.map((track,i)=><article key={track.slug} className="v2catalog-track">
          <div className="v2catalog-track-top"><span className="v2catalog-track-index">0{i+2}</span><span className="v2catalog-soon">EN PRÉPARATION</span></div>
          <h3>{track.name}</h3><p>{track.summary}</p><div className="v2catalog-track-deliverable"><CheckCircle2 size={15}/><span><b>Projet final :</b> {track.deliverable}</span></div>
        </article>)}</div>
      </section>
      <section className="v2catalog-note" aria-label="Information sur les inscriptions"><Layers3 size={21}/><div><strong>Pilote V2 en service : inscription depuis ton espace personnel</strong><p>Le parcours Ingénierie produit et IA est publié. Connecte-toi pour vérifier ton éligibilité, t'inscrire gratuitement et réaliser les ateliers. Les six autres formations restent en préparation ; tes missions historiques et XP V1 sont conservés.</p></div><Link href="/espace/parcours/ingenierie-produit-ia">Ouvrir le pilote <ArrowRight size={15}/></Link></section>
      <footer className="v2catalog-footer"><span>© Formation Pro 360 · Catalogue pédagogique V2</span><Link href="/login">Connexion</Link></footer>
    </div>
  </main>;
}
