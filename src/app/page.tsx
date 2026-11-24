import Link from "next/link";
import {redirect} from "next/navigation";
import {ArrowRight,BookOpen,BrainCircuit,CheckCircle2,GraduationCap,Target,Users} from "lucide-react";
import {currentUser} from "@/lib/auth/backend";
import {pilotCourse,specializations} from "@/lib/v2-public-catalog";
import {getAiTrainingPlan,trainingMinutes,formatWorkload} from "@/lib/ai-training-plans";
import "./catalogue/catalogue.css";

export default async function Home(){
 const user=await currentUser().catch(()=>null);
 if(user)redirect("/espace");
 const courses=[{slug:pilotCourse.slug,name:pilotCourse.name,summary:"Concevoir, tester et livrer un produit numérique.",deliverable:"Produit numérique vérifiable"},...specializations];
 return <main className="v2catalog public-home">
 <a className="public-skip" href="#public-content">Aller au contenu principal</a>
 <header className="v2catalog-nav"><Link href="/" className="v2catalog-brand"><span><GraduationCap size={22}/></span>Formation <b>Pro 360</b></Link><nav aria-label="Navigation principale"><Link href="/catalogue">Formations</Link><Link href="/login">Connexion</Link><Link className="v2catalog-nav-primary" href="/login?mode=inscription">Créer mon compte <ArrowRight size={15}/></Link></nav></header>
 <div className="v2catalog-body" id="public-content">
 <section className="public-hero"><div><span className="public-kicker">FORMATIONS PRATIQUES · IA · ACCOMPAGNEMENT HUMAIN</span><h1>Apprends en réalisant.<br/><em>Construis ton avenir professionnel.</em></h1><p>Sept domaines de formation pour développer des compétences concrètes, pratiquer avec l’IA et faire vérifier tes réalisations par ton formateur.</p><div className="public-actions"><Link className="public-primary" href="/catalogue">Explorer les formations <ArrowRight size={18}/></Link><Link className="public-secondary" href="/login">J’ai déjà un compte</Link></div><p className="public-small">Les programmes sont consultables librement. Les inscriptions disponibles sont confirmées dans ton espace personnel.</p></div><aside className="public-hero-panel" aria-label="Notre approche pédagogique"><span className="public-kicker">DE LA MÉTHODE AU RÉSULTAT</span>{[{icon:Target,title:"Un objectif professionnel",desc:"Choisis un domaine et définis ton résultat attendu."},{icon:BrainCircuit,title:"Une pratique assistée par IA",desc:"Applique les méthodes, teste et vérifie chaque résultat."},{icon:Users,title:"Un formateur à tes côtés",desc:"Reçois des consignes et des corrections humaines."},{icon:CheckCircle2,title:"Des preuves concrètes",desc:"Construis ton portfolio avec les réalisations validées."}].map(({icon:Icon,title,desc})=><article key={title}><Icon size={23}/><div><strong>{title}</strong><p>{desc}</p></div></article>)}</aside></section>
 <section className="public-section" aria-labelledby="public-courses"><div className="public-section-heading"><div><span className="public-kicker">CHOISIR SON DOMAINE</span><h2 id="public-courses">Sept formations, des projets concrets.</h2></div><Link href="/catalogue">Comparer les programmes <ArrowRight size={16}/></Link></div><div className="public-course-grid">{courses.map((c,i)=>{const plan=getAiTrainingPlan(c.slug);return <article key={c.slug}><span className="public-course-index">0{i+1} <BookOpen size={19}/></span><h3>{c.name}</h3><p>{c.summary}</p><p><strong>Projet attendu :</strong> {c.deliverable}</p>{plan&&<small>Charge proposée : {formatWorkload(trainingMinutes(plan))}</small>}<Link href={"/catalogue/"+c.slug}>Découvrir le programme <ArrowRight size={16}/></Link></article>})}</div></section>
 <section className="public-section public-start"><div><span className="public-kicker">À TON RYTHME</span><h2>Ton temps disponible définit ton planning.</h2><p>Consulte les programmes, crée ton compte, vérifie les inscriptions ouvertes puis personnalise ton rythme. La durée réelle dépend de ta pratique et des retours du formateur.</p></div><Link className="public-primary" href="/login?mode=inscription">Créer mon compte apprenant <ArrowRight size={17}/></Link></section>
 <footer className="v2catalog-footer"><span>© Formation Pro 360</span><Link href="/catalogue">Catalogue</Link><Link href="/login">Mon espace</Link></footer>
 </div></main>;
}
