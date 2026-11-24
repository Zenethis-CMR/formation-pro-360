/** Editorial catalog derived from the V2 master plan and backend migration 016.
 * This is public preview metadata, NOT enrollments, XP, published database lessons,
 * or an assertion that migrations have run on CT420.
 */
export const pilotCourse={
  "slug": "ingenierie-produit-ia",
  "name": "Ingénierie produit et IA",
  "summary": "Concevoir, livrer, tester, promouvoir et commercialiser un produit numérique à ton rythme avec l’IA.",
  "deliverable": "Application SaaS ou outil métier : flux en ligne au jour 14, MVP testé au premier mois, expérimentation commerciale au deuxième.",
  "modules": [
    {
      "slug": "probleme-utilisateur",
      "week": 1,
      "title": "Comprendre le problème utilisateur",
      "outcome": "Valider un problème réel, une cible, un parcours utilisateur et un prototype cliquable.",
      "skills": [
        "User research",
        "PRD",
        "UX",
        "Figma"
      ],
      "lessons": [
        {
          "slug": "valider-probleme",
          "title": "Interroger les utilisateurs et vérifier le problème",
          "objective": "Savoir distinguer intuition personnelle et problème répété chez une cible identifiable.",
          "evidence": "Synthèse anonymisée des entretiens, cinq enseignements et problème prioritaire documenté."
        },
        {
          "slug": "prd-prototype",
          "title": "Rédiger le PRD et prototyper le flux",
          "objective": "Définir une proposition de valeur et le scénario métier qui sera démontré au jour 14.",
          "evidence": "Lien vers le PRD, prototype Figma et matrice problème → utilisateur → solution."
        }
      ]
    },
    {
      "slug": "premier-flux",
      "week": 2,
      "title": "Mettre un premier flux utile en ligne",
      "outcome": "Livrer sur une URL accessible un scénario utilisateur complet, avec code, données et contrôle de qualité.",
      "skills": [
        "React",
        "Next.js",
        "PostgreSQL",
        "GitHub",
        "Déploiement"
      ],
      "lessons": [
        {
          "slug": "architecture-repo",
          "title": "Structurer son premier produit et son dépôt",
          "objective": "Choisir une architecture simple et expliquer la circulation des données sans multiplier les outils.",
          "evidence": "Dépôt versionné, schéma de données et README avec procédure locale reproductible."
        },
        {
          "slug": "flux-deploye",
          "title": "Déployer un scénario utilisateur complet",
          "objective": "Rendre accessible le premier flux bout en bout et le vérifier sur une URL déployée.",
          "evidence": "URL publique ou de préproduction, lien GitHub, capture du flux complet et résultat du test."
        }
      ]
    },
    {
      "slug": "produit-fiable",
      "week": 3,
      "title": "Rendre le produit fiable et utilisable",
      "outcome": "Tester et sécuriser le flux principal, corriger ses cas limites et l'adapter au mobile.",
      "skills": [
        "CRUD",
        "RLS",
        "Tests",
        "Accessibilité"
      ],
      "lessons": [
        {
          "slug": "crud-permissions",
          "title": "Construire le CRUD et les autorisations",
          "objective": "S'assurer que le scénario métier couvre création, lecture, édition et suppression autorisées.",
          "evidence": "Tests de permissions, code du CRUD et démonstration isolant les données des utilisateurs."
        },
        {
          "slug": "tests-accessibilite",
          "title": "Tester la qualité et l'accessibilité mobile",
          "objective": "Prouver que l'application gère erreurs, chargement, clavier et données absentes.",
          "evidence": "Checklist d'accessibilité, tests automatisés et journal de trois corrections vérifiées."
        }
      ]
    },
    {
      "slug": "mvp",
      "week": 4,
      "title": "Livrer un MVP complet",
      "outcome": "Déployer une version reproductible avec logs, documentation et retours de vrais utilisateurs.",
      "skills": [
        "Déploiement",
        "Observabilité",
        "Feedback",
        "Sécurité"
      ],
      "lessons": [
        {
          "slug": "livraison-observable",
          "title": "Livrer un MVP reproductible et observable",
          "objective": "Déployer une version complète du flux central avec erreurs mesurables et procédure de livraison.",
          "evidence": "URL du MVP, recette reproductible, documentation et démonstration de supervision."
        },
        {
          "slug": "retours-utilisateurs",
          "title": "Faire éprouver le MVP par des utilisateurs",
          "objective": "Transformer des retours réels en décisions de produit et en correctifs priorisés.",
          "evidence": "Synthèse de tests utilisateurs, backlog priorisé et version corrigée déployée."
        }
      ]
    },
    {
      "slug": "positionnement",
      "week": 5,
      "title": "Trouver son marché",
      "outcome": "Formuler une offre claire, parler à des prospects et publier une page de conversion mesurable.",
      "skills": [
        "Positionnement",
        "Copywriting",
        "SEO",
        "Analytics"
      ],
      "lessons": [
        {
          "slug": "offre-marche",
          "title": "Définir son offre et mener des conversations",
          "objective": "Relier cible, problème, bénéfices et proposition de valeur sans promettre de revenus.",
          "evidence": "Argumentaire d'offre, tableau anonymisé des dix échanges et hypothèses de prix."
        },
        {
          "slug": "landing-analytics",
          "title": "Publier sa page d'offre et mesurer la conversion",
          "objective": "Créer un parcours de découverte et mesurer l'activation sans ajouter de suivi intrusif.",
          "evidence": "URL de la landing page, événements mesurés et analyse des premiers résultats."
        }
      ]
    },
    {
      "slug": "acquisition",
      "week": 6,
      "title": "Attirer et engager des prospects",
      "outcome": "Lancer une expérience d'acquisition documentée et suivre le passage de prospect à démonstration.",
      "skills": [
        "Marketing IA",
        "CRM",
        "Contenu",
        "Automatisation"
      ],
      "lessons": [
        {
          "slug": "canal-acquisition",
          "title": "Tester un canal d'acquisition à petite échelle",
          "objective": "Concevoir une expérimentation d'acquisition honnête avec coût et objectifs définis.",
          "evidence": "Plan de campagne, publications réelles et tableau des indicateurs observés."
        },
        {
          "slug": "crm-suivi",
          "title": "Organiser le suivi prospect vers démonstration",
          "objective": "Tracer les étapes du pipeline de vente sans automatisations non supervisées.",
          "evidence": "Pipeline anonymisé, démo documentée et taux de passage par étape."
        }
      ]
    },
    {
      "slug": "vente",
      "week": 7,
      "title": "Vendre et apprendre",
      "outcome": "Tester un prix, préparer une offre facturable et documenter les objections des prospects.",
      "skills": [
        "Pricing",
        "Vente",
        "Facturation",
        "Relation client"
      ],
      "lessons": [
        {
          "slug": "prix-facturation",
          "title": "Tester une tarification et une offre facturable",
          "objective": "Définir une tarification cohérente avec la valeur, les coûts et le marché cible.",
          "evidence": "Grille tarifaire, facture de test et note de conformité locale."
        },
        {
          "slug": "essais-vente",
          "title": "Conduire des essais de vente et écouter les objections",
          "objective": "Démontrer le produit, recueillir des signaux concrets et améliorer la proposition commerciale.",
          "evidence": "Démonstration filmée ou en direct, journal des objections et révision argumentée de l'offre."
        }
      ]
    },
    {
      "slug": "exploitation",
      "week": 8,
      "title": "Améliorer et exploiter son produit",
      "outcome": "Renforcer la fiabilité, l'exploitation et le portfolio grâce à une démonstration vérifiable.",
      "skills": [
        "Performance",
        "Proxmox",
        "Sauvegardes",
        "Support"
      ],
      "lessons": [
        {
          "slug": "fiabilite-runbook",
          "title": "Garantir fiabilité, restauration et suivi du produit",
          "objective": "Documenter la maintenance et vérifier que le produit reste utilisable après incident.",
          "evidence": "Runbook, preuve de restauration en test, mesures avant/après et estimation des coûts."
        },
        {
          "slug": "jury-portfolio",
          "title": "Présenter et défendre son produit 360",
          "objective": "Expliquer le problème, les choix techniques, l'expérience et les essais de marché avec preuves.",
          "evidence": "Portfolio avec URL, dépôt, tests, indicateurs réels et restitution orale évaluée."
        }
      ]
    }
  ]
} as const;
export const specializations=[
  {
    "slug": "design-produit-ux-ui-motion",
    "name": "Design produit, UX/UI et motion",
    "summary": "Recherche utilisateur, design system, interfaces accessibles et animations responsables.",
    "deliverable": "Prototype haute fidélité et design system intégré dans un produit",
    "icon": "palette"
  },
  {
    "slug": "copywriting-communication-contenu-ia",
    "name": "Copywriting, communication et contenu IA",
    "summary": "Stratégie éditoriale, marque, storytelling, SEO et systèmes de contenu.",
    "deliverable": "Système éditorial et parcours de conversion mesuré",
    "icon": "pen"
  },
  {
    "slug": "marketing-acquisition-ia",
    "name": "Marketing, acquisition et IA",
    "summary": "Segmentation, acquisition, CRM, attribution et analyse des campagnes.",
    "deliverable": "Campagne multicanal documentée avec indicateurs réels",
    "icon": "chart"
  },
  {
    "slug": "automatisation-integrations-agents-ia",
    "name": "Automatisation, intégrations et agents IA",
    "summary": "APIs, webhooks, agents IA, évaluation, supervision et fiabilité.",
    "deliverable": "Automatisation métier supervisée et observable",
    "icon": "workflow"
  },
  {
    "slug": "infrastructure-devops-cybersecurite",
    "name": "Infrastructure, DevOps et cybersécurité",
    "summary": "Git, CI/CD, VPS, Proxmox, sauvegardes, monitoring et sécurité des services.",
    "deliverable": "Déploiement reproductible et résilient d'un produit",
    "icon": "shield"
  },
  {
    "slug": "entrepreneuriat-numerique-monetisation",
    "name": "Entrepreneuriat numérique et monétisation",
    "summary": "Validation de marché, prix, vente, paiement, support et croissance.",
    "deliverable": "Offre commercialisée avec entonnoir et apprentissages vérifiés",
    "icon": "briefcase"
  }
] as const;
export const catalogCount=1+specializations.length;
