import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  Code2,
  Compass,
  GraduationCap,
  Layers3,
  Lightbulb,
  MessageCircle,
  Palette,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  Workflow,
} from "lucide-react";
import { authCookieName, currentUser } from "@/lib/auth/backend";
import { pilotCourse, specializations, catalogCount } from "@/lib/v2-public-catalog";
import { formatWorkload, getAiTrainingPlan, trainingMinutes } from "@/lib/ai-training-plans";
import { withCourseChoice } from "@/lib/public-course-choice";
import { Reveal } from "@/components/landing-reveal";
import "./landing.css";

export const metadata: Metadata = {
  title: "Formation Pro 360 | Apprendre en réalisant",
  description:
    "Développe des compétences professionnelles avec des ateliers pratiques, des projets concrets et le retour de ton formateur.",
};

const courseCatalog = [
  {
    slug: pilotCourse.slug,
    name: pilotCourse.name,
    summary: "Concevoir, tester et livrer un produit numérique.",
    deliverable: "Produit numérique vérifiable",
  },
  ...specializations,
];

const courseIcons = {
  [pilotCourse.slug]: Lightbulb,
  "design-produit-ux-ui-motion": Palette,
  "copywriting-communication-contenu-ia": MessageCircle,
  "marketing-acquisition-ia": Target,
  "automatisation-integrations-agents-ia": Workflow,
  "infrastructure-devops-cybersecurite": Code2,
  "entrepreneuriat-numerique-monetisation": Compass,
};
const courseAccents = ["blue", "violet", "orange", "green", "violet", "blue", "orange"] as const;
const programs = courseCatalog.map((course, index) => {
  const plan = getAiTrainingPlan(course.slug);
  const Icon = courseIcons[course.slug as keyof typeof courseIcons] ?? BookOpen;
  return {
    number: String(index + 1).padStart(2, "0"),
    ...course,
    project: course.deliverable,
    hours: plan ? formatWorkload(trainingMinutes(plan)) : null,
    icon: Icon,
    accent: courseAccents[index] ?? "blue",
    href: `/catalogue/${course.slug}`,
    choiceHref: withCourseChoice("/login?mode=inscription", course.slug),
  };
});

const pilotWorkshopCount = pilotCourse.modules.reduce((count, module) => count + module.lessons.length, 0);
const pilotPlan = getAiTrainingPlan(pilotCourse.slug);
const pilotWorkload = pilotPlan ? formatWorkload(trainingMinutes(pilotPlan)) : null;

const method = [
  {
    number: "01",
    title: "Choisis un cap",
    description: "Sélectionne un domaine et clarifie le résultat que tu veux atteindre.",
  },
  {
    number: "02",
    title: "Apprends en faisant",
    description: "Avance avec des ateliers, des consignes concrètes et des ressources utiles.",
  },
  {
    number: "03",
    title: "Montre ton travail",
    description: "Dépose tes réalisations, reçois un retour humain et améliore ton projet.",
  },
];

const benefits = [
  {
    icon: BookOpen,
    title: "Des ateliers qui mènent à un projet",
    description:
      "Chaque étape t’aide à produire quelque chose de concret, puis à l’améliorer avec une intention claire.",
    accent: "blue",
  },
  {
    icon: UsersRound,
    title: "Un formateur dans la boucle",
    description:
      "Les consignes, les corrections et les échanges humains gardent ton apprentissage relié au terrain.",
    accent: "violet",
  },
  {
    icon: Layers3,
    title: "Un espace pour garder tes progrès",
    description:
      "Retrouve ton parcours, ton carnet de travail, tes réalisations et les retours associés au même endroit.",
    accent: "green",
  },
];

function Brand() {
  return (
    <a className="landing-brand" href="#top" aria-label="Formation Pro 360, accueil">
      <span className="landing-brand-mark"><GraduationCap size={20} strokeWidth={2.2} /></span>
      <span>Formation <b>Pro 360</b></span>
    </a>
  );
}

function LandingPreview() {
  return (
    <div className="landing-visual-wrap">
      <div className="landing-visual-aura" />
      <div className="landing-cloudscape" aria-hidden="true" />
      <div className="landing-orbit landing-orbit-one"><span /><i /></div>
      <div className="landing-orbit landing-orbit-two"><span /><i /></div>
      <Image
        className="landing-dashboard-image"
        src="/images/landing-dashboard.png"
        alt="Tableau de bord apprenant Formation Pro 360, avec le parcours en cours et sa progression"
        width={1920}
        height={1226}
        priority
      />
    </div>
  );
}

export default async function HomePage() {
  const user = (await cookies()).get(authCookieName)?.value
    ? await currentUser().catch(() => null)
    : null;
  if(user)redirect("/espace");

  return (
    <main id="top" className="landing-page">
      <a className="landing-skip" href="#landing-main">Aller au contenu</a>
      <div className="landing-frame">
        <div className="landing-sheet">
          <header className="landing-nav">
            <Brand />
            <nav className="landing-nav-links" aria-label="Navigation principale">
              <a href="#formations">Formations</a>
              <a href="#methode">Notre méthode</a>
              <a href="#espace">La plateforme</a>
            </nav>
            <div className="landing-nav-actions">
              <a className="landing-login" href="/login">Connexion</a>
              <a className="landing-nav-cta" href="/login?mode=inscription">Créer mon compte <ArrowRight size={15} /></a>
            </div>
          </header>

          <div id="landing-main">
            <section className="landing-hero" aria-labelledby="landing-title">
              <div className="landing-hero-grid" aria-hidden="true" />
              <div className="landing-hero-glow landing-hero-glow-one" aria-hidden="true" />
              <div className="landing-hero-glow landing-hero-glow-two" aria-hidden="true" />
              <Reveal className="landing-hero-copy">
                <h1 id="landing-title">Apprends en réalisant.<br /><span>Construis ton avenir professionnel.</span></h1>
                <p className="landing-hero-description">Des compétences qui se construisent en pratique, un projet à montrer et un formateur qui t’accompagne à chaque étape.</p>
                <div className="landing-hero-actions">
                  <a className="landing-button landing-button-primary" href="#formations">Explorer les formations <ArrowRight size={17} /></a>
                  <a className="landing-button landing-button-secondary" href="/login">J’ai déjà un compte</a>
                </div>
                <p className="landing-hero-note"><ShieldCheck size={15} /> Formations en présentiel à Douala (Makepe BM de préférence) ou à distance. Consulte les programmes librement.</p>
                <div className="landing-hero-trust">
                  <span className="landing-trust-avatars" aria-hidden="true"><i><Target size={13} /></i><i><BookOpen size={13} /></i><i><BadgeCheck size={13} /></i></span>
                  <span><strong>Du concret à chaque étape</strong><small>Ateliers · réalisations · retours humains</small></span>
                </div>
              </Reveal>
              <Reveal className="landing-hero-art" delay={140}><LandingPreview /></Reveal>
            </section>

            <section className="landing-path-strip" aria-label="Le parcours de formation">
              <div className="landing-path-label"><strong>Un parcours lisible.<br />Des acquis visibles.</strong></div>
              <div className="landing-path-line" aria-hidden="true" />
              {[
                ["01", "Découvrir", "Choisir son domaine"],
                ["02", "Pratiquer", "Réaliser les ateliers"],
                ["03", "Partager", "Déposer ses projets"],
                ["04", "Progresser", "Recevoir des retours"],
              ].map(([number, title, detail], index) => (
                <Reveal key={number} className="landing-path-step" delay={index * 75}>
                  <span className="landing-path-number">{number}</span>
                  <strong>{title}</strong>
                  <small>{detail}</small>
                  {index < 3 && <ArrowRight size={15} className="landing-path-arrow" />}
                </Reveal>
              ))}
            </section>

            <section id="formations" className="landing-section landing-programs-section" aria-labelledby="programs-title">
              <Reveal className="landing-section-heading">
                <div>
                  <h2 id="programs-title">{catalogCount} domaines.<br /><span>Des projets bien réels.</span></h2>
                </div>
                <p>Explore les compétences et les projets proposés. Construis un parcours qui correspond à tes objectifs et à ton temps disponible.</p>
              </Reveal>
              <div className="landing-program-grid">
                {programs.map((program, index) => {
                  const Icon = program.icon;
                  return (
                    <Reveal key={program.number} delay={index * 55} className={`landing-program-card accent-${program.accent}`}>
                      <div className="landing-program-card-top"><span>{program.number} <i> / 07</i></span><span className="landing-program-icon"><Icon size={19} /></span></div>
                      <h3>{program.name}</h3>
                      <p>{program.summary}</p>
                      <div className="landing-program-project"><small>PROJET ATTENDU</small><strong>{program.project}</strong></div>
                      <div className="landing-program-bottom"><span><Clock3 size={13} /> {program.hours ? `${program.hours} proposées` : "Charge à découvrir"}</span><Link href={program.href} className="landing-program-arrow" aria-label={`Découvrir le programme ${program.name}`}><ArrowUpRight size={15} /></Link></div>
                      <Link href={program.choiceHref} className="landing-program-choice">Vérifier les inscriptions <ArrowRight size={13} /></Link>
                    </Reveal>
                  );
                })}
              </div>
              <div className="landing-program-footnote"><CircleCheck size={15} /><span>Le temps estimé est indicatif : avance à ton rythme, selon ta pratique et tes échanges avec ton formateur.</span></div>
            </section>

            <section id="methode" className="landing-method-section" aria-labelledby="method-title">
              <div className="landing-method-glow" aria-hidden="true" />
              <Reveal className="landing-method-intro">
                <h2 id="method-title">Apprendre, c’est<br /><span>faire et recommencer.</span></h2>
                <p>Tu avances en produisant. Tes ateliers deviennent des réalisations, et chaque retour t’aide à renforcer ton travail.</p>
                <a href="/login?mode=inscription" className="landing-method-link">Commencer mon parcours <ArrowRight size={16} /></a>
              </Reveal>
              <div className="landing-method-steps">
                {method.map((step, index) => (
                  <Reveal key={step.number} className="landing-method-step" delay={index * 110}>
                    <span className="landing-method-step-num">{step.number}</span>
                    <div><h3>{step.title}</h3><p>{step.description}</p></div>
                    <span className="landing-method-check"><Check size={15} /></span>
                  </Reveal>
                ))}
                <div className="landing-method-connector" aria-hidden="true"><i /><i /><i /></div>
              </div>
            </section>

            <section id="espace" className="landing-section landing-benefits-section" aria-labelledby="benefits-title">
              <Reveal className="landing-section-heading landing-benefits-heading">
                <div><h2 id="benefits-title">Tout ce qu’il faut<br /><span>pour aller plus loin.</span></h2></div>
                <p>Un espace personnel pour organiser ton apprentissage, garder tes notes et retrouver les retours de ton formateur.</p>
              </Reveal>
              <div className="landing-benefit-grid">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <Reveal key={benefit.title} className={`landing-benefit-card benefit-${benefit.accent}`} delay={index * 110}>
                      <span className="landing-benefit-icon"><Icon size={21} /></span>
                      <h3>{benefit.title}</h3>
                      <p>{benefit.description}</p>
                      <div className="landing-benefit-decoration" aria-hidden="true"><i /><i /><i /><i /></div>
                    </Reveal>
                  );
                })}
              </div>
              <div className="landing-detail-band">
                <div className="landing-detail-symbol"><Sparkles size={20} /></div>
                <div><strong>Tu avances à ton rythme, sans perdre le fil.</strong><span>Personnalise tes disponibilités, retrouve tes ateliers et garde ton carnet accessible dans ton espace personnel.</span></div>
                <a href="/login?mode=inscription" aria-label="Créer mon compte apprenant"><ArrowRight size={18} /></a>
              </div>
            </section>

            <section className="landing-flagship" aria-labelledby="flagship-title">
              <Reveal className="landing-flagship-copy">
                <h2 id="flagship-title">Ingénierie produit<br /><span>et intelligence artificielle.</span></h2>
                <p>Pars d’un problème utilisateur, construis une première solution, puis confronte-la au réel avec des ateliers guidés.</p>
                <div className="landing-flagship-tags"><span><Layers3 size={14} /> {pilotCourse.modules.length} modules</span><i /><span><BookOpen size={14} /> {pilotWorkshopCount} ateliers</span><i /><span><Clock3 size={14} /> {pilotWorkload ?? "charge proposée"}</span></div>
                <Link className="landing-button landing-button-light" href={`/catalogue/${pilotCourse.slug}`}>Découvrir le parcours <ArrowRight size={16} /></Link>
              </Reveal>
              <div className="landing-flagship-art" aria-hidden="true">
                <div className="landing-product-orbit orbit-large" />
                <div className="landing-product-orbit orbit-small" />
                <div className="landing-product-core"><Lightbulb size={50} strokeWidth={1.3} /></div>
                <div className="landing-product-chip chip-one"><Target size={15} /> problème</div>
                <div className="landing-product-chip chip-two"><Workflow size={15} /> prototype</div>
                <div className="landing-product-chip chip-three"><BadgeCheck size={15} /> validation</div>
                <span className="landing-product-dot dot-one" /><span className="landing-product-dot dot-two" /><span className="landing-product-dot dot-three" />
              </div>
            </section>

            <section className="landing-faq-section" aria-labelledby="faq-title">
              <Reveal className="landing-faq-intro"><h2 id="faq-title">Quelques réponses<br /><span>pour bien commencer.</span></h2><p>Découvre comment se déroule le parcours avant de créer ton espace.</p></Reveal>
              <div className="landing-faq-list">
                <details className="landing-faq-item"><summary>Est-ce que je peux consulter les formations avant de m’inscrire ? <ChevronDown size={18} /></summary><p>Oui. Tu peux explorer les domaines et les projets présentés. Les possibilités d’inscription sont confirmées dans ton espace personnel.</p></details>
                <details className="landing-faq-item"><summary>Où se déroulent les formations ? <ChevronDown size={18} /></summary><p>Les formations sont proposées en présentiel à Douala, de préférence à Makepe BM, ou à distance.</p></details>
                <details className="landing-faq-item"><summary>Est-ce que le parcours impose un rythme fixe ? <ChevronDown size={18} /></summary><p>Tu peux définir tes disponibilités et avancer selon ton rythme. Les durées affichées sont des estimations, pas une échéance imposée.</p></details>
                <details className="landing-faq-item"><summary>Comment mes réalisations sont-elles évaluées ? <ChevronDown size={18} /></summary><p>Tu déposes le travail demandé dans l’atelier. Ton formateur peut ensuite te transmettre une correction et des indications pour poursuivre.</p></details>
                <details className="landing-faq-item"><summary>Quelle place est donnée à l’intelligence artificielle ? <ChevronDown size={18} /></summary><p>L’IA fait partie de plusieurs domaines de formation. Les ressources pédagogiques t’aident à l’utiliser pour produire, tester et vérifier ton travail avec discernement.</p></details>
              </div>
            </section>

            <section className="landing-final-cta" aria-labelledby="final-cta-title">
              <div className="landing-cta-orb" aria-hidden="true" />
              <Reveal className="landing-final-cta-copy"><h2 id="final-cta-title">Prêt·e à faire<br /><span>de tes idées un projet ?</span></h2><p>Choisis un domaine, explore les ateliers et commence à construire quelque chose qui te ressemble.</p></Reveal>
              <Reveal className="landing-final-cta-actions" delay={120}><a className="landing-button landing-button-primary" href="/login?mode=inscription">Créer mon compte apprenant <ArrowRight size={17} /></a><a className="landing-cta-login" href="/login">J’ai déjà un compte <ArrowUpRight size={15} /></a><small>Les programmes sont consultables librement.</small></Reveal>
            </section>
          </div>

          <footer className="landing-footer">
            <Brand />
            <span>Apprendre. Construire. Progresser.</span>
            <div><a href="#formations">Formations</a><a href="#methode">Notre méthode</a><a href="/login">Mon espace</a></div>
            <small>© {new Date().getFullYear()} Formation Pro 360</small>
          </footer>
        </div>
      </div>
    </main>
  );
}
