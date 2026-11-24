/** Editorial curriculum drafts. Not published database lessons or enrollment rights. */
export type CurriculumLesson={slug:string;title:string;objective:string;evidence:string;criteria:string[]};
export type CurriculumModule={week:number;title:string;outcome:string;lessons:CurriculumLesson[]};
export type SpecializationProgram={slug:string;tools:string;milestones:string;modules:CurriculumModule[]};
export const specializationPrograms:SpecializationProgram[]=[
  {
    "slug": "design-produit-ux-ui-motion",
    "tools": "Figma, FigJam, outils de contraste, navigateur",
    "milestones": "Prototype testé du flux central au jour 14; bibliothèque de composants et écrans responsive au mois 1; design intégré, testé et documenté au mois 2.",
    "modules": [
      {
        "week": 1,
        "title": "Recherche et cadrage",
        "outcome": "Comprendre les usages et choisir un problème.",
        "lessons": [
          {
            "slug": "s1-a1",
            "title": "Entretiens et recherche",
            "objective": "Identifier les besoins sans orienter les réponses.",
            "evidence": "Guide, 3 entretiens anonymisés et synthèse.",
            "criteria": [
              "Questions ouvertes",
              "Consentement",
              "Synthèse sourcée",
              "Problème priorisé"
            ]
          },
          {
            "slug": "s1-a2",
            "title": "Parcours et architecture d'information",
            "objective": "Transformer les observations en flux compréhensible.",
            "evidence": "Carte du parcours et arborescence testée.",
            "criteria": [
              "Tâches identifiées",
              "Navigation logique",
              "Points de friction",
              "Justification"
            ]
          }
        ]
      },
      {
        "week": 2,
        "title": "Prototypage",
        "outcome": "Tester un scénario central avant de détailler l'interface.",
        "lessons": [
          {
            "slug": "s2-a1",
            "title": "Wireframes et flux",
            "objective": "Construire un flux basse fidélité avec alternatives.",
            "evidence": "Wireframes des états principaux et erreurs.",
            "criteria": [
              "Cohérence du flux",
              "États couverts",
              "Lisibilité",
              "Alternatives"
            ]
          },
          {
            "slug": "s2-a2",
            "title": "Prototype cliquable",
            "objective": "Observer trois personnes accomplir une tâche.",
            "evidence": "Prototype et journal de tests anonymisé.",
            "criteria": [
              "Scénario testable",
              "Consignes neutres",
              "Observations",
              "Corrections"
            ]
          }
        ]
      },
      {
        "week": 3,
        "title": "Identité visuelle",
        "outcome": "Définir un langage graphique cohérent.",
        "lessons": [
          {
            "slug": "s3-a1",
            "title": "Direction artistique",
            "objective": "Comparer deux directions adaptées au public.",
            "evidence": "Moodboard, palette, typographies et choix argumenté.",
            "criteria": [
              "Adéquation cible",
              "Contraste",
              "Cohérence",
              "Justification"
            ]
          },
          {
            "slug": "s3-a2",
            "title": "Tokens et grille",
            "objective": "Transformer la direction en règles réutilisables.",
            "evidence": "Tokens couleur, type, espace et grille responsive.",
            "criteria": [
              "Nommage",
              "Échelle",
              "Contrastes",
              "Réutilisation"
            ]
          }
        ]
      },
      {
        "week": 4,
        "title": "Design system",
        "outcome": "Créer une bibliothèque exploitable.",
        "lessons": [
          {
            "slug": "s4-a1",
            "title": "Composants et variantes",
            "objective": "Construire boutons, champs et cartes avec états.",
            "evidence": "Bibliothèque Figma avec variantes et documentation.",
            "criteria": [
              "États",
              "Auto layout",
              "Noms",
              "Accessibilité"
            ]
          },
          {
            "slug": "s4-a2",
            "title": "Écrans responsive",
            "objective": "Assembler les écrans avec les composants.",
            "evidence": "Écrans mobile, tablette et desktop du flux.",
            "criteria": [
              "Adaptation",
              "Cohérence",
              "États vides",
              "Hiérarchie"
            ]
          }
        ]
      },
      {
        "week": 5,
        "title": "Accessibilité et qualité",
        "outcome": "Vérifier le confort de lecture et d'interaction.",
        "lessons": [
          {
            "slug": "s5-a1",
            "title": "Audit accessibilité",
            "objective": "Identifier puis corriger les obstacles visuels et clavier.",
            "evidence": "Rapport contraste, focus, labels et corrections.",
            "criteria": [
              "Mesures",
              "Priorités",
              "Corrections",
              "Retest"
            ]
          },
          {
            "slug": "s5-a2",
            "title": "Tests utilisateurs avancés",
            "objective": "Comparer les versions sur les mêmes tâches.",
            "evidence": "Protocole et résultats avant/après.",
            "criteria": [
              "Tâches stables",
              "Mesures",
              "Analyse",
              "Itération"
            ]
          }
        ]
      },
      {
        "week": 6,
        "title": "Motion design",
        "outcome": "Donner un retour utile sans distraire.",
        "lessons": [
          {
            "slug": "s6-a1",
            "title": "Micro-interactions",
            "objective": "Prototyper feedback, transitions et états de chargement.",
            "evidence": "Storyboard et 3 prototypes animés.",
            "criteria": [
              "Intention",
              "Durées",
              "Mouvement réduit",
              "Clarté"
            ]
          },
          {
            "slug": "s6-a2",
            "title": "Motion et intégration",
            "objective": "Transmettre les animations aux développeurs.",
            "evidence": "Spécifications et démonstration intégrée.",
            "criteria": [
              "Tokens",
              "Déclencheurs",
              "Fallback",
              "Vérification"
            ]
          }
        ]
      },
      {
        "week": 7,
        "title": "Livraison design",
        "outcome": "Passer du fichier à une interface utilisable.",
        "lessons": [
          {
            "slug": "s7-a1",
            "title": "Handoff et documentation",
            "objective": "Spécifier règles, composants et cas limites.",
            "evidence": "Fichier nettoyé et documentation de livraison.",
            "criteria": [
              "Organisation",
              "Spécifications",
              "États",
              "Traçabilité"
            ]
          },
          {
            "slug": "s7-a2",
            "title": "Recette UI",
            "objective": "Comparer l'implémentation au prototype.",
            "evidence": "Rapport de recette avec captures et correctifs.",
            "criteria": [
              "Comparaison",
              "Responsive",
              "Priorisation",
              "Retest"
            ]
          }
        ]
      },
      {
        "week": 8,
        "title": "Portfolio et soutenance",
        "outcome": "Défendre le processus et les résultats.",
        "lessons": [
          {
            "slug": "s8-a1",
            "title": "Étude de cas",
            "objective": "Raconter les choix à partir de preuves.",
            "evidence": "Case study problème, méthode, itérations et limites.",
            "criteria": [
              "Preuves",
              "Narration",
              "Résultats",
              "Confidentialité"
            ]
          },
          {
            "slug": "s8-a2",
            "title": "Jury design",
            "objective": "Démontrer le flux et la bibliothèque.",
            "evidence": "Prototype, design system, recette et soutenance.",
            "criteria": [
              "Démo",
              "Cohérence",
              "Accessibilité",
              "Défense"
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "copywriting-communication-contenu-ia",
    "tools": "Éditeur de texte, CMS, outil de recherche, analytics, IA supervisée",
    "milestones": "Message et page testable au jour 14; système éditorial au mois 1; parcours de conversion mesuré au mois 2.",
    "modules": [
      {
        "week": 1,
        "title": "Positionnement",
        "outcome": "Clarifier le public, la promesse et les preuves.",
        "lessons": [
          {
            "slug": "s1-a1",
            "title": "Recherche d'audience",
            "objective": "Collecter le langage des clients avec consentement.",
            "evidence": "Corpus anonymisé et carte des objections.",
            "criteria": [
              "Sources",
              "Consentement",
              "Segmentation",
              "Synthèse"
            ]
          },
          {
            "slug": "s1-a2",
            "title": "Proposition de valeur",
            "objective": "Écrire et comparer trois messages vérifiables.",
            "evidence": "Matrice promesses, preuves et versions.",
            "criteria": [
              "Clarté",
              "Pertinence",
              "Preuves",
              "Éthique"
            ]
          }
        ]
      },
      {
        "week": 2,
        "title": "Copywriting de conversion",
        "outcome": "Construire une page qui explique une offre.",
        "lessons": [
          {
            "slug": "s2-a1",
            "title": "Structure persuasive",
            "objective": "Organiser bénéfices, preuve et appel à l'action.",
            "evidence": "Wirecopy de landing page et justification.",
            "criteria": [
              "Hiérarchie",
              "Bénéfices",
              "Objections",
              "CTA"
            ]
          },
          {
            "slug": "s2-a2",
            "title": "Page et test de compréhension",
            "objective": "Faire tester le message sans induire de réponse.",
            "evidence": "Page de test et 3 retours anonymisés.",
            "criteria": [
              "Lisibilité",
              "Test",
              "Analyse",
              "Révision"
            ]
          }
        ]
      },
      {
        "week": 3,
        "title": "Identité éditoriale",
        "outcome": "Rendre la voix de marque reproductible.",
        "lessons": [
          {
            "slug": "s3-a1",
            "title": "Voix et ton",
            "objective": "Définir règles de rédaction selon le contexte.",
            "evidence": "Charte de voix avec exemples et contre-exemples.",
            "criteria": [
              "Cohérence",
              "Public",
              "Exemples",
              "Inclusion"
            ]
          },
          {
            "slug": "s3-a2",
            "title": "Storytelling",
            "objective": "Transformer une expérience réelle en récit documenté.",
            "evidence": "Deux récits avec sources et variantes.",
            "criteria": [
              "Structure",
              "Authenticité",
              "Clarté",
              "Adaptation"
            ]
          }
        ]
      },
      {
        "week": 4,
        "title": "Production éditoriale",
        "outcome": "Organiser un calendrier réalisable.",
        "lessons": [
          {
            "slug": "s4-a1",
            "title": "Piliers et calendrier",
            "objective": "Relier contenus aux questions de la cible.",
            "evidence": "Calendrier de 4 semaines et briefs.",
            "criteria": [
              "Cohérence",
              "Cadence",
              "Objectifs",
              "Responsabilités"
            ]
          },
          {
            "slug": "s4-a2",
            "title": "Workflow IA supervisé",
            "objective": "Créer une chaîne brouillon, vérification et publication humaine.",
            "evidence": "Procédure, exemples et checklist factuelle.",
            "criteria": [
              "Sources",
              "Originalité",
              "Contrôle humain",
              "Confidentialité"
            ]
          }
        ]
      },
      {
        "week": 5,
        "title": "SEO et découverte",
        "outcome": "Produire du contenu utile et découvrable.",
        "lessons": [
          {
            "slug": "s5-a1",
            "title": "Intentions de recherche",
            "objective": "Cartographier les questions et intentions.",
            "evidence": "Carte de sujets et briefs SEO.",
            "criteria": [
              "Intentions",
              "Sources",
              "Structure",
              "Priorités"
            ]
          },
          {
            "slug": "s5-a2",
            "title": "Article et optimisation",
            "objective": "Rédiger une réponse utile puis vérifier la page.",
            "evidence": "Article publié ou préproduction et recette.",
            "criteria": [
              "Exactitude",
              "Lisibilité",
              "Métadonnées",
              "Liens"
            ]
          }
        ]
      },
      {
        "week": 6,
        "title": "Distribution",
        "outcome": "Décliner un contenu sans spam.",
        "lessons": [
          {
            "slug": "s6-a1",
            "title": "Formats multicanaux",
            "objective": "Adapter un message à trois canaux.",
            "evidence": "Trois versions et plan de distribution.",
            "criteria": [
              "Adaptation",
              "Cohérence",
              "Accessibilité",
              "Consentement"
            ]
          },
          {
            "slug": "s6-a2",
            "title": "Séquence e-mail",
            "objective": "Concevoir une séquence avec désinscription.",
            "evidence": "Séquence de test et règles de consentement.",
            "criteria": [
              "Pertinence",
              "Progression",
              "Désinscription",
              "Test"
            ]
          }
        ]
      },
      {
        "week": 7,
        "title": "Mesure et itération",
        "outcome": "Relier les contenus aux objectifs sans inventer de résultats.",
        "lessons": [
          {
            "slug": "s7-a1",
            "title": "Instrumentation éditoriale",
            "objective": "Définir des événements et mesures minimales.",
            "evidence": "Plan de mesure et événements testés.",
            "criteria": [
              "Définitions",
              "Test",
              "Minimisation",
              "Limites"
            ]
          },
          {
            "slug": "s7-a2",
            "title": "Expérience de message",
            "objective": "Comparer deux variantes sur une hypothèse.",
            "evidence": "Protocole, données réelles ou test signalé, décision.",
            "criteria": [
              "Hypothèse",
              "Comparabilité",
              "Analyse",
              "Décision"
            ]
          }
        ]
      },
      {
        "week": 8,
        "title": "Système et soutenance",
        "outcome": "Livrer un système de contenu transmissible.",
        "lessons": [
          {
            "slug": "s8-a1",
            "title": "Documentation éditoriale",
            "objective": "Assembler charte, briefs et contrôle qualité.",
            "evidence": "Kit éditorial versionné et exemple complet.",
            "criteria": [
              "Complétude",
              "Réutilisation",
              "Contrôle",
              "Traçabilité"
            ]
          },
          {
            "slug": "s8-a2",
            "title": "Jury communication",
            "objective": "Défendre la stratégie et les apprentissages.",
            "evidence": "Portfolio éditorial et démonstration mesurée.",
            "criteria": [
              "Preuves",
              "Clarté",
              "Éthique",
              "Défense"
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "marketing-acquisition-ia",
    "tools": "Tableur, analytics, CRM, outils créatifs et comptes de test",
    "milestones": "Offre et canal testable au jour 14; campagne et CRM au mois 1; acquisition mesurée au mois 2.",
    "modules": [
      {
        "week": 1,
        "title": "Marché et segmentation",
        "outcome": "Définir une cible à partir de signaux réels.",
        "lessons": [
          {
            "slug": "s1-a1",
            "title": "Segmentation",
            "objective": "Comparer segments et problèmes observés.",
            "evidence": "Matrice segments et sources anonymisées.",
            "criteria": [
              "Sources",
              "Critères",
              "Priorisation",
              "Limites"
            ]
          },
          {
            "slug": "s1-a2",
            "title": "Offre et hypothèses",
            "objective": "Formuler une offre et ses hypothèses de conversion.",
            "evidence": "Fiche offre, objections et hypothèses.",
            "criteria": [
              "Valeur",
              "Cible",
              "Preuves",
              "Testabilité"
            ]
          }
        ]
      },
      {
        "week": 2,
        "title": "Entonnoir et landing",
        "outcome": "Créer un parcours mesurable.",
        "lessons": [
          {
            "slug": "s2-a1",
            "title": "Cartographie du funnel",
            "objective": "Identifier étapes et événements utiles.",
            "evidence": "Funnel avec définitions des conversions.",
            "criteria": [
              "Étapes",
              "Mesures",
              "Consentement",
              "Cohérence"
            ]
          },
          {
            "slug": "s2-a2",
            "title": "Landing et instrumentation",
            "objective": "Tester la capture d'un signal avec données de test.",
            "evidence": "Landing et rapport de test des événements.",
            "criteria": [
              "Fonctionnement",
              "Message",
              "Mesure",
              "Vie privée"
            ]
          }
        ]
      },
      {
        "week": 3,
        "title": "Création et contenu",
        "outcome": "Produire des créatifs adaptés à la cible.",
        "lessons": [
          {
            "slug": "s3-a1",
            "title": "Concepts créatifs",
            "objective": "Développer trois angles à partir de preuves.",
            "evidence": "Briefs, visuels et textes justifiés.",
            "criteria": [
              "Pertinence",
              "Originalité",
              "Preuves",
              "Accessibilité"
            ]
          },
          {
            "slug": "s3-a2",
            "title": "Calendrier organique",
            "objective": "Planifier contenus et réponses aux prospects.",
            "evidence": "Calendrier et premières publications autorisées.",
            "criteria": [
              "Objectifs",
              "Cadence",
              "Qualité",
              "Suivi"
            ]
          }
        ]
      },
      {
        "week": 4,
        "title": "CRM et qualification",
        "outcome": "Structurer la relation prospect.",
        "lessons": [
          {
            "slug": "s4-a1",
            "title": "Pipeline CRM",
            "objective": "Définir statuts, champs et règles de qualification.",
            "evidence": "CRM de test avec données fictives signalées.",
            "criteria": [
              "États",
              "Données minimales",
              "Permissions",
              "Test"
            ]
          },
          {
            "slug": "s4-a2",
            "title": "Suivi et relance",
            "objective": "Préparer des relances consenties et contrôlées.",
            "evidence": "Scripts, séquence test et règle d'arrêt.",
            "criteria": [
              "Pertinence",
              "Consentement",
              "Arrêt",
              "Traçabilité"
            ]
          }
        ]
      },
      {
        "week": 5,
        "title": "Expérimentations payantes",
        "outcome": "Préparer des campagnes sans dépenses non autorisées.",
        "lessons": [
          {
            "slug": "s5-a1",
            "title": "Plan média",
            "objective": "Calculer un budget plafond et hypothèses.",
            "evidence": "Plan média et scénarios de coûts.",
            "criteria": [
              "Hypothèses",
              "Budget",
              "Ciblage",
              "Risques"
            ]
          },
          {
            "slug": "s5-a2",
            "title": "Campagne test",
            "objective": "Préparer les créatifs et vérifier les paramètres en brouillon.",
            "evidence": "Campagne brouillon ou autorisée, checklist.",
            "criteria": [
              "Paramètres",
              "Créatifs",
              "Budget",
              "Validation humaine"
            ]
          }
        ]
      },
      {
        "week": 6,
        "title": "Mesure et attribution",
        "outcome": "Interpréter les signaux avec prudence.",
        "lessons": [
          {
            "slug": "s6-a1",
            "title": "Tableau de bord",
            "objective": "Calculer les indicateurs sur données documentées.",
            "evidence": "Tableau CTR, conversion, coût et sources.",
            "criteria": [
              "Formules",
              "Sources",
              "Dénominateurs",
              "Limites"
            ]
          },
          {
            "slug": "s6-a2",
            "title": "Attribution",
            "objective": "Comparer des modèles sans prétendre à la causalité.",
            "evidence": "Analyse des écarts et recommandation.",
            "criteria": [
              "Modèles",
              "Biais",
              "Traçabilité",
              "Décision"
            ]
          }
        ]
      },
      {
        "week": 7,
        "title": "Optimisation",
        "outcome": "Prioriser les expériences utiles.",
        "lessons": [
          {
            "slug": "s7-a1",
            "title": "Tests A/B",
            "objective": "Concevoir une expérience et un critère de décision.",
            "evidence": "Protocole et résultat réel ou simulation identifiée.",
            "criteria": [
              "Hypothèse",
              "Comparabilité",
              "Échantillon",
              "Interprétation"
            ]
          },
          {
            "slug": "s7-a2",
            "title": "Optimisation du funnel",
            "objective": "Corriger une friction à partir des données.",
            "evidence": "Version corrigée et plan de retest.",
            "criteria": [
              "Diagnostic",
              "Priorité",
              "Correction",
              "Mesure"
            ]
          }
        ]
      },
      {
        "week": 8,
        "title": "Campagne et jury",
        "outcome": "Présenter une stratégie et ses résultats vérifiables.",
        "lessons": [
          {
            "slug": "s8-a1",
            "title": "Bilan de campagne",
            "objective": "Assembler dépenses autorisées, résultats et limites.",
            "evidence": "Rapport et pièces justificatives anonymisées.",
            "criteria": [
              "Exactitude",
              "Coûts",
              "Résultats",
              "Limites"
            ]
          },
          {
            "slug": "s8-a2",
            "title": "Jury acquisition",
            "objective": "Démontrer le funnel et défendre les arbitrages.",
            "evidence": "Campagne, CRM, tableau de bord et soutenance.",
            "criteria": [
              "Démo",
              "Preuves",
              "Éthique",
              "Défense"
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "automatisation-integrations-agents-ia",
    "tools": "API de test, n8n ou équivalent, Node.js, Git, journaux, modèle IA",
    "milestones": "Flux de test au jour 14; automatisation supervisée au mois 1; fiabilité et évaluation au mois 2.",
    "modules": [
      {
        "week": 1,
        "title": "Analyse des processus",
        "outcome": "Choisir une automatisation utile et maîtrisable.",
        "lessons": [
          {
            "slug": "s1-a1",
            "title": "Cartographie métier",
            "objective": "Décomposer un processus et ses décisions humaines.",
            "evidence": "Diagramme actuel/cible et risques.",
            "criteria": [
              "Entrées",
              "Sorties",
              "Exceptions",
              "Validation humaine"
            ]
          },
          {
            "slug": "s1-a2",
            "title": "Contrats de données",
            "objective": "Définir schémas, types et données minimales.",
            "evidence": "Contrats JSON et exemples synthétiques.",
            "criteria": [
              "Schéma",
              "Validation",
              "Confidentialité",
              "Erreurs"
            ]
          }
        ]
      },
      {
        "week": 2,
        "title": "API et webhooks",
        "outcome": "Connecter deux services de test.",
        "lessons": [
          {
            "slug": "s2-a1",
            "title": "API et authentification",
            "objective": "Consommer une API autorisée avec secret serveur.",
            "evidence": "Client de test et journal expurgé.",
            "criteria": [
              "Auth",
              "Validation",
              "Erreurs",
              "Secrets"
            ]
          },
          {
            "slug": "s2-a2",
            "title": "Webhook idempotent",
            "objective": "Traiter événements répétés sans doublon.",
            "evidence": "Flux test avec duplicata et résultat.",
            "criteria": [
              "Signature",
              "Idempotence",
              "Tests",
              "Logs"
            ]
          }
        ]
      },
      {
        "week": 3,
        "title": "Orchestration",
        "outcome": "Construire des workflows maintenables.",
        "lessons": [
          {
            "slug": "s3-a1",
            "title": "Branches et transformations",
            "objective": "Router les entrées selon des règles explicites.",
            "evidence": "Workflow exporté et cas de test.",
            "criteria": [
              "Règles",
              "Transformation",
              "Cas limites",
              "Documentation"
            ]
          },
          {
            "slug": "s3-a2",
            "title": "Reprises et temporisation",
            "objective": "Gérer erreurs temporaires et échecs permanents.",
            "evidence": "Tests de retry borné et file d'erreurs.",
            "criteria": [
              "Bornes",
              "Classification",
              "Alerte",
              "Reprise"
            ]
          }
        ]
      },
      {
        "week": 4,
        "title": "Automatisation supervisée",
        "outcome": "Livrer un flux contrôlé par un humain.",
        "lessons": [
          {
            "slug": "s4-a1",
            "title": "Approbation humaine",
            "objective": "Intercaler une validation avant action sensible.",
            "evidence": "Flux d'approbation et test de refus.",
            "criteria": [
              "Autorisation",
              "Refus",
              "Audit",
              "Expiration"
            ]
          },
          {
            "slug": "s4-a2",
            "title": "Déploiement du flux",
            "objective": "Déployer en environnement isolé et documenter.",
            "evidence": "Workflow fonctionnel et procédure de retour.",
            "criteria": [
              "Déploiement",
              "Secrets",
              "Recette",
              "Rollback"
            ]
          }
        ]
      },
      {
        "week": 5,
        "title": "Agents IA",
        "outcome": "Limiter l'agent à un périmètre vérifiable.",
        "lessons": [
          {
            "slug": "s5-a1",
            "title": "Entrées et outils",
            "objective": "Définir un agent à outils autorisés et sorties structurées.",
            "evidence": "Contrat agent et tests d'outils fictifs.",
            "criteria": [
              "Périmètre",
              "Schéma",
              "Permissions",
              "Tests"
            ]
          },
          {
            "slug": "s5-a2",
            "title": "Protection contre injections",
            "objective": "Tester les instructions malveillantes en environnement isolé.",
            "evidence": "Jeu de tests et mesures de confinement.",
            "criteria": [
              "Séparation données",
              "Refus",
              "Contrôles",
              "Retest"
            ]
          }
        ]
      },
      {
        "week": 6,
        "title": "Évaluation",
        "outcome": "Mesurer l'utilité et les erreurs.",
        "lessons": [
          {
            "slug": "s6-a1",
            "title": "Jeu d'évaluation",
            "objective": "Créer des cas représentatifs et attendus humains.",
            "evidence": "Dataset synthétique et grille de jugement.",
            "criteria": [
              "Couverture",
              "Attendus",
              "Reproductibilité",
              "Limites"
            ]
          },
          {
            "slug": "s6-a2",
            "title": "Coûts et qualité",
            "objective": "Comparer configurations sur les mêmes cas.",
            "evidence": "Tableau qualité, latence et coûts mesurés.",
            "criteria": [
              "Protocole",
              "Mesures",
              "Analyse",
              "Décision"
            ]
          }
        ]
      },
      {
        "week": 7,
        "title": "Observabilité et sécurité",
        "outcome": "Rendre le service exploitable.",
        "lessons": [
          {
            "slug": "s7-a1",
            "title": "Logs et alertes",
            "objective": "Définir événements et alertes sans données sensibles.",
            "evidence": "Dashboard de test et alerte simulée.",
            "criteria": [
              "Corrélation",
              "Minimisation",
              "Seuils",
              "Test"
            ]
          },
          {
            "slug": "s7-a2",
            "title": "Permissions et incidents",
            "objective": "Tester révocation et arrêt manuel.",
            "evidence": "Rapport de tests sur environnement autorisé.",
            "criteria": [
              "Moindre privilège",
              "Arrêt",
              "Restauration",
              "Preuves"
            ]
          }
        ]
      },
      {
        "week": 8,
        "title": "Livraison et jury",
        "outcome": "Démontrer un système supervisé fiable.",
        "lessons": [
          {
            "slug": "s8-a1",
            "title": "Runbook et transfert",
            "objective": "Documenter lancement, panne et reprise.",
            "evidence": "Runbook et démonstration de restauration.",
            "criteria": [
              "Procédure",
              "Rôles",
              "Tests",
              "Maintenance"
            ]
          },
          {
            "slug": "s8-a2",
            "title": "Jury automatisation",
            "objective": "Défendre les limites et la valeur du flux.",
            "evidence": "Workflow, évaluations et soutenance.",
            "criteria": [
              "Démo",
              "Fiabilité",
              "Contrôle humain",
              "Défense"
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "infrastructure-devops-cybersecurite",
    "tools": "Git, Linux, Docker, CI/CD, VPS ou VM de test, observabilité",
    "milestones": "Service reproductible en test au jour 14; livraison et sauvegarde au mois 1; exploitation résiliente au mois 2.",
    "modules": [
      {
        "week": 1,
        "title": "Fondations et périmètre",
        "outcome": "Comprendre l'environnement autorisé et ses risques.",
        "lessons": [
          {
            "slug": "s1-a1",
            "title": "Cartographie infrastructure",
            "objective": "Documenter composants, flux et responsabilités.",
            "evidence": "Schéma d'un laboratoire personnel et inventaire.",
            "criteria": [
              "Périmètre",
              "Flux",
              "Actifs",
              "Risques"
            ]
          },
          {
            "slug": "s1-a2",
            "title": "Linux et accès",
            "objective": "Configurer comptes limités et journalisation en laboratoire.",
            "evidence": "Checklist et preuves de permissions.",
            "criteria": [
              "Moindre privilège",
              "Accès",
              "Logs",
              "Reproductibilité"
            ]
          }
        ]
      },
      {
        "week": 2,
        "title": "Conteneurs et réseau",
        "outcome": "Déployer un service isolé.",
        "lessons": [
          {
            "slug": "s2-a1",
            "title": "Images et Docker",
            "objective": "Construire une image minimale et reproductible.",
            "evidence": "Dockerfile, tests et inventaire dépendances.",
            "criteria": [
              "Build",
              "Non-root",
              "Versions",
              "Tests"
            ]
          },
          {
            "slug": "s2-a2",
            "title": "Réseau et reverse proxy",
            "objective": "Relier services de test avec ports limités.",
            "evidence": "Compose et recette réseau locale.",
            "criteria": [
              "Isolation",
              "Routage",
              "Ports",
              "Documentation"
            ]
          }
        ]
      },
      {
        "week": 3,
        "title": "Intégration continue",
        "outcome": "Fiabiliser les changements.",
        "lessons": [
          {
            "slug": "s3-a1",
            "title": "Pipeline CI",
            "objective": "Automatiser tests et compilation.",
            "evidence": "Pipeline avec succès et échec contrôlés.",
            "criteria": [
              "Tests",
              "Échec",
              "Artefacts",
              "Secrets"
            ]
          },
          {
            "slug": "s3-a2",
            "title": "Déploiement continu",
            "objective": "Créer une livraison versionnée en laboratoire.",
            "evidence": "Pipeline test et rollback démontré.",
            "criteria": [
              "Version",
              "Approbation",
              "Recette",
              "Rollback"
            ]
          }
        ]
      },
      {
        "week": 4,
        "title": "Sauvegarde et reprise",
        "outcome": "Prouver que les données sont restaurables.",
        "lessons": [
          {
            "slug": "s4-a1",
            "title": "Sauvegarde",
            "objective": "Mettre en place une sauvegarde chiffrée de données fictives.",
            "evidence": "Procédure et journal de sauvegarde.",
            "criteria": [
              "Périmètre",
              "Chiffrement",
              "Rétention",
              "Vérification"
            ]
          },
          {
            "slug": "s4-a2",
            "title": "Restauration",
            "objective": "Restaurer dans un environnement distinct.",
            "evidence": "Rapport intégrité et durée mesurée.",
            "criteria": [
              "Isolation",
              "Intégrité",
              "Durée",
              "Documentation"
            ]
          }
        ]
      },
      {
        "week": 5,
        "title": "Sécurité défensive",
        "outcome": "Réduire l'exposition des services autorisés.",
        "lessons": [
          {
            "slug": "s5-a1",
            "title": "Durcissement",
            "objective": "Appliquer mises à jour et réglages minimaux.",
            "evidence": "Checklist avant/après en laboratoire.",
            "criteria": [
              "Correctifs",
              "Accès",
              "Configuration",
              "Retest"
            ]
          },
          {
            "slug": "s5-a2",
            "title": "Audit de dépendances",
            "objective": "Analyser les dépendances de son propre projet.",
            "evidence": "Rapport priorisé et corrections testées.",
            "criteria": [
              "Inventaire",
              "Priorités",
              "Correctifs",
              "Retest"
            ]
          }
        ]
      },
      {
        "week": 6,
        "title": "Observabilité",
        "outcome": "Détecter les dégradations sans fuite de données.",
        "lessons": [
          {
            "slug": "s6-a1",
            "title": "Métriques et logs",
            "objective": "Instrumenter disponibilité et erreurs.",
            "evidence": "Tableau de bord de laboratoire.",
            "criteria": [
              "Métriques",
              "Logs expurgés",
              "Seuils",
              "Validation"
            ]
          },
          {
            "slug": "s6-a2",
            "title": "Alertes et incidents",
            "objective": "Simuler une panne et mesurer la réponse.",
            "evidence": "Chronologie et alerte testée.",
            "criteria": [
              "Détection",
              "Escalade",
              "Rétablissement",
              "Retex"
            ]
          }
        ]
      },
      {
        "week": 7,
        "title": "Infrastructure reproductible",
        "outcome": "Automatiser l'exploitation et maîtriser les coûts.",
        "lessons": [
          {
            "slug": "s7-a1",
            "title": "Configuration déclarative",
            "objective": "Recréer un environnement de test à partir du dépôt.",
            "evidence": "Scripts et preuve de reconstruction.",
            "criteria": [
              "Idempotence",
              "Versions",
              "Secrets",
              "Recette"
            ]
          },
          {
            "slug": "s7-a2",
            "title": "Capacité et performance",
            "objective": "Mesurer charge et ressources dans le laboratoire.",
            "evidence": "Rapport p50/p95, CPU et limites.",
            "criteria": [
              "Protocole",
              "Mesures",
              "Coûts",
              "Décision"
            ]
          }
        ]
      },
      {
        "week": 8,
        "title": "Exploitation et jury",
        "outcome": "Présenter un service fiable et défendable.",
        "lessons": [
          {
            "slug": "s8-a1",
            "title": "Runbook de production",
            "objective": "Documenter opérations et responsabilités.",
            "evidence": "Runbook et exercice de restauration.",
            "criteria": [
              "Procédure",
              "Rôles",
              "Restauration",
              "Traçabilité"
            ]
          },
          {
            "slug": "s8-a2",
            "title": "Jury DevOps",
            "objective": "Démontrer livraison, supervision et reprise.",
            "evidence": "Dépôt, service test, preuves et soutenance.",
            "criteria": [
              "Démo",
              "Sécurité",
              "Résilience",
              "Défense"
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "entrepreneuriat-numerique-monetisation",
    "tools": "Tableur, CRM, outil de prototypage, documents commerciaux et paiement sandbox",
    "milestones": "Offre testée au jour 14; système de vente au mois 1; essais commerciaux documentés au mois 2.",
    "modules": [
      {
        "week": 1,
        "title": "Opportunité et marché",
        "outcome": "Choisir un problème solvable et une cible.",
        "lessons": [
          {
            "slug": "s1-a1",
            "title": "Entretiens de marché",
            "objective": "Comprendre besoins et alternatives sans vendre immédiatement.",
            "evidence": "3 entretiens anonymisés et carte des alternatives.",
            "criteria": [
              "Questions",
              "Consentement",
              "Sources",
              "Synthèse"
            ]
          },
          {
            "slug": "s1-a2",
            "title": "Hypothèses d'entreprise",
            "objective": "Relier problème, cible et modèle économique.",
            "evidence": "Canvas et hypothèses priorisées.",
            "criteria": [
              "Cible",
              "Valeur",
              "Coûts",
              "Testabilité"
            ]
          }
        ]
      },
      {
        "week": 2,
        "title": "Offre et prototype",
        "outcome": "Tester une proposition avant d'investir.",
        "lessons": [
          {
            "slug": "s2-a1",
            "title": "Offre minimale",
            "objective": "Définir périmètre, bénéfices et conditions claires.",
            "evidence": "Fiche offre avec limites et prix hypothétique.",
            "criteria": [
              "Clarté",
              "Valeur",
              "Limites",
              "Prix"
            ]
          },
          {
            "slug": "s2-a2",
            "title": "Prototype commercial",
            "objective": "Présenter une démonstration et recueillir des objections.",
            "evidence": "Prototype et retours consentis.",
            "criteria": [
              "Démo",
              "Écoute",
              "Preuves",
              "Itération"
            ]
          }
        ]
      },
      {
        "week": 3,
        "title": "Prix et économie",
        "outcome": "Comprendre les coûts et la marge.",
        "lessons": [
          {
            "slug": "s3-a1",
            "title": "Coûts unitaires",
            "objective": "Calculer les coûts fixes, variables et marge.",
            "evidence": "Tableur avec scénarios et hypothèses.",
            "criteria": [
              "Formules",
              "Hypothèses",
              "Sensibilité",
              "Limites"
            ]
          },
          {
            "slug": "s3-a2",
            "title": "Tarification",
            "objective": "Comparer options de prix avec la cible.",
            "evidence": "Grille et tests de disposition à payer.",
            "criteria": [
              "Valeur",
              "Coûts",
              "Retours",
              "Décision"
            ]
          }
        ]
      },
      {
        "week": 4,
        "title": "Vente et opérations",
        "outcome": "Construire un processus de vente simple.",
        "lessons": [
          {
            "slug": "s4-a1",
            "title": "Pipeline commercial",
            "objective": "Définir étapes, qualification et suivi.",
            "evidence": "CRM et scripts de démonstration.",
            "criteria": [
              "Étapes",
              "Consentement",
              "Suivi",
              "Traçabilité"
            ]
          },
          {
            "slug": "s4-a2",
            "title": "Devis et paiement test",
            "objective": "Préparer devis, facture et paiement en bac à sable.",
            "evidence": "Documents de test et vérification du flux.",
            "criteria": [
              "Montants",
              "Conditions",
              "Test",
              "Conformité à vérifier"
            ]
          }
        ]
      },
      {
        "week": 5,
        "title": "Livraison client",
        "outcome": "Organiser l'accueil et le support.",
        "lessons": [
          {
            "slug": "s5-a1",
            "title": "Onboarding client",
            "objective": "Concevoir le parcours de prise en main.",
            "evidence": "Checklist, guide et test avec un utilisateur.",
            "criteria": [
              "Clarté",
              "Accessibilité",
              "Support",
              "Test"
            ]
          },
          {
            "slug": "s5-a2",
            "title": "Support et fidélisation",
            "objective": "Définir réponse, suivi et escalade.",
            "evidence": "Procédure et cas simulés.",
            "criteria": [
              "Délais cibles",
              "Responsabilités",
              "Suivi",
              "Confidentialité"
            ]
          }
        ]
      },
      {
        "week": 6,
        "title": "Acquisition et croissance",
        "outcome": "Choisir un canal viable et mesurable.",
        "lessons": [
          {
            "slug": "s6-a1",
            "title": "Plan d'acquisition",
            "objective": "Comparer canaux avec budget et hypothèses.",
            "evidence": "Plan d'expérience et plafond de dépenses.",
            "criteria": [
              "Cible",
              "Budget",
              "Mesure",
              "Risques"
            ]
          },
          {
            "slug": "s6-a2",
            "title": "Expérience commerciale",
            "objective": "Mener des essais autorisés et noter les objections.",
            "evidence": "Journal anonymisé et résultats sans extrapolation.",
            "criteria": [
              "Consentement",
              "Preuves",
              "Analyse",
              "Décision"
            ]
          }
        ]
      },
      {
        "week": 7,
        "title": "Pilotage économique",
        "outcome": "Décider à partir des données et contraintes.",
        "lessons": [
          {
            "slug": "s7-a1",
            "title": "Trésorerie et seuil de rentabilité",
            "objective": "Modéliser revenus hypothétiques et dépenses.",
            "evidence": "Prévision et scénarios prudent/central/haut.",
            "criteria": [
              "Formules",
              "Hypothèses",
              "Trésorerie",
              "Sensibilité"
            ]
          },
          {
            "slug": "s7-a2",
            "title": "Risques et conformité",
            "objective": "Lister obligations à vérifier selon le marché.",
            "evidence": "Registre risques, questions et actions.",
            "criteria": [
              "Périmètre",
              "Sources à vérifier",
              "Priorités",
              "Responsables"
            ]
          }
        ]
      },
      {
        "week": 8,
        "title": "Soutenance entrepreneuriale",
        "outcome": "Présenter une offre réelle et les apprentissages.",
        "lessons": [
          {
            "slug": "s8-a1",
            "title": "Dossier entreprise",
            "objective": "Assembler preuves, prix, opérations et plan 90 jours.",
            "evidence": "Dossier versionné et indicateurs réels.",
            "criteria": [
              "Preuves",
              "Cohérence",
              "Plan",
              "Limites"
            ]
          },
          {
            "slug": "s8-a2",
            "title": "Jury entrepreneuriat",
            "objective": "Défendre le modèle et démontrer le parcours client.",
            "evidence": "Offre, funnel, tableur et soutenance.",
            "criteria": [
              "Démo",
              "Économie",
              "Éthique",
              "Défense"
            ]
          }
        ]
      }
    ]
  }
];
export function getSpecializationProgram(slug:string){return specializationPrograms.find(p=>p.slug===slug);}
