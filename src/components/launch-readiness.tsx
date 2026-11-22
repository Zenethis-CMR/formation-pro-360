import Link from "next/link";
import { ArrowUpRight, BadgeCheck, CalendarDays, CheckCircle2, CircleDashed, ClipboardCheck, MailCheck, ShieldCheck, Smartphone } from "lucide-react";

type Props={
  publishedMissions:number;
  guidedMissions:number;
  learners:number;
  submissions:number;
  validatedMissions:number;
  awardedBadges:number;
  startDate:string|null;
};

export function LaunchReadiness({publishedMissions,guidedMissions,learners,submissions,validatedMissions,awardedBadges,startDate}:Props){
  const checks=[
    {label:"Programme publié",note:publishedMissions+" missions disponibles",ok:publishedMissions>=16},
    {label:"Ateliers structurés",note:guidedMissions+" guides pédagogiques",ok:guidedMissions>=16},
    {label:"Compte apprenant créé",note:learners+" apprenant(s) enregistré(s)",ok:learners>0},
    {label:"Date de départ définie",note:startDate||"À choisir dans le calendrier",ok:Boolean(startDate)},
    {label:"Premier projet réellement soumis",note:submissions+" soumission(s) reçue(s)",ok:submissions>0},
    {label:"Évaluation et XP vérifiés",note:validatedMissions+" mission(s) validée(s)",ok:validatedMissions>0},
    {label:"Premier badge réellement attribué",note:awardedBadges+" badge(s) attribué(s)",ok:awardedBadges>0}
  ];
  const completed=checks.filter(x=>x.ok).length;
  const manual=[
    {icon:MailCheck,name:"E-mail de connexion Resend",description:"Confirmer la réception réelle par un Gmail apprenant externe"},
    {icon:Smartphone,name:"Recette sur téléphone",description:"Tester la connexion, l'atelier et l'envoi du livrable"},
    {icon:ShieldCheck,name:"Séparation des comptes",description:"Vérifier qu'un apprenant ne peut pas ouvrir l'espace formateur ni lire les données d'un autre"}
  ];
  return <section className="launch-audit" aria-labelledby="launch-audit-title">
    <header className="launch-audit-head"><div>
      <span className="journey-overline"><ClipboardCheck size={14}/> RECETTE OPÉRATIONNELLE</span>
      <h2 id="launch-audit-title">Avant d'accueillir une promotion complète.</h2>
      <p>État des contrôles observables dans la base de données. Les tests humains ne sont jamais déclarés réussis automatiquement.</p>
    </div><div className="launch-audit-counter"><strong>{completed}<span> / {checks.length}</span></strong><small>contrôles confirmés en base</small></div></header>
    <div className="launch-audit-list">{checks.map(x=><div className="launch-audit-row" key={x.label}>
      {x.ok?<CheckCircle2 size={18} className="launch-yes"/>:<CircleDashed size={18} className="launch-pending"/>}
      <div><strong>{x.label}</strong><small>{x.note}</small></div>
      <span className={x.ok?"launch-done":"launch-todo"}>{x.ok?"Confirmé":"À vérifier"}</span>
    </div>)}</div>
    <div className="launch-manual"><h3>Essais à réaliser avec les utilisateurs</h3>
      {manual.map(x=><div className="launch-manual-item" key={x.name}>
        <x.icon size={18}/><div><strong>{x.name}</strong><p>{x.description}</p></div><span>Manuel</span>
      </div>)}
    </div>
    <div className="launch-audit-footer"><BadgeCheck size={17}/><span>Un déploiement Vercel réussi ne remplace pas une validation des parcours utilisateur.</span>
      <Link href="/login">Tester la connexion <ArrowUpRight size={13}/></Link>
    </div>
  </section>;
}
