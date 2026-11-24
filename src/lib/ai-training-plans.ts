/** Proposed workload and AI mastery overlay. Existing official lesson IDs/rubrics are unchanged. */
export type AiActivity={hours:number;procedure:string};
export type AiTrainingPlan={slug:string;title:string;modules:{activities:AiActivity[]}[]};
export const aiTrainingPlans:AiTrainingPlan[]=[
  {
    "slug": "ingenierie-produit-ia",
    "title": "Ingénierie produit et IA",
    "modules": [
      {
        "activities": [
          {
            "hours": 8,
            "procedure": "Recherche augmentée : cadrer le contexte, synthétiser les entretiens anonymisés, distinguer observations et hypothèses."
          },
          {
            "hours": 8,
            "procedure": "PRD structuré et prototype : demander des alternatives, spécifier les contraintes et les critères d'acceptation."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 12,
            "procedure": "Agent de code : fournir conventions, architecture et fichiers pertinents, planifier les changements avant exécution."
          },
          {
            "hours": 16,
            "procedure": "Déployer un flux vertical : petits commits, tests de bout en bout, vérification manuelle et rollback."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 12,
            "procedure": "Développer avec contrats typés, permissions explicites et tests négatifs générés puis vérifiés."
          },
          {
            "hours": 12,
            "procedure": "Faire auditer le code et l'UX par l'IA, reproduire les anomalies et mesurer les corrections."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 12,
            "procedure": "Livraison reproductible : CI, variables d'environnement, logs expurgés et contrôle des migrations."
          },
          {
            "hours": 12,
            "procedure": "Synthétiser les retours réels, classifier les frictions, prioriser et retester sans inventer les données."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 8,
            "procedure": "Comparer offres et objections à partir de sources réelles, tester les hypothèses de valeur."
          },
          {
            "hours": 8,
            "procedure": "Créer une landing avec IA, instrumenter les événements et vérifier consentement et mesure."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 8,
            "procedure": "Préparer des créatifs et expériences d'acquisition avec hypothèses, limites et budget."
          },
          {
            "hours": 8,
            "procedure": "Automatiser le CRM avec validation humaine, dédoublonnage et règles d'arrêt."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 8,
            "procedure": "Modéliser prix et coûts avec calculs vérifiés, tester la facturation en sandbox."
          },
          {
            "hours": 8,
            "procedure": "Simuler les objections, conduire de vrais entretiens et distinguer intérêt et vente."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 10,
            "procedure": "Générer runbook et tests de résilience, vérifier sauvegarde, restauration et coût."
          },
          {
            "hours": 10,
            "procedure": "Présenter le dépôt, démontrer le produit et défendre les choix et limites de l'IA."
          }
        ]
      }
    ]
  },
  {
    "slug": "design-produit-ux-ui-motion",
    "title": "Design produit, UX/UI et motion",
    "modules": [
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Synthétiser des entretiens anonymisés avec citations et contre-exemples."
          },
          {
            "hours": 3,
            "procedure": "Cartographier le parcours, générer des alternatives et vérifier l'architecture avec des utilisateurs."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Générer puis comparer wireframes sous contraintes métier et accessibilité."
          },
          {
            "hours": 4,
            "procedure": "Prototyper le flux, observer les utilisateurs et corriger les points de friction."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Produire des références visuelles et variantes, contrôler cohérence, droits et originalité."
          },
          {
            "hours": 3,
            "procedure": "Convertir la direction artistique en tokens et vérifier les contrastes."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 5,
            "procedure": "Construire des composants, variantes et états réutilisables avec IA."
          },
          {
            "hours": 5,
            "procedure": "Générer des écrans responsive puis vérifier les contraintes dans le navigateur."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Utiliser l'IA pour proposer un audit, confirmer clavier, focus et contrastes manuellement."
          },
          {
            "hours": 4,
            "procedure": "Préparer des scénarios de test neutres, analyser les observations réelles."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Explorer micro-interactions et storyboard, vérifier intention et mouvement réduit."
          },
          {
            "hours": 3,
            "procedure": "Spécifier déclencheurs, durées et fallbacks puis tester l'intégration."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Produire un handoff structuré, tokens et spécifications vérifiables."
          },
          {
            "hours": 4,
            "procedure": "Comparer captures et prototype, classer les écarts et retester."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Structurer une étude de cas à partir de preuves, sans inventer d'indicateurs."
          },
          {
            "hours": 4,
            "procedure": "Démontrer la bibliothèque, le flux et défendre les arbitrages sans assistance."
          }
        ]
      }
    ]
  },
  {
    "slug": "copywriting-communication-contenu-ia",
    "title": "Copywriting, communication et contenu IA",
    "modules": [
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Constituer un corpus sourcé et anonymisé ; demander une analyse des objections avec extraits."
          },
          {
            "hours": 3,
            "procedure": "Créer des propositions de valeur contrastées avec preuves, public et contraintes."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Générer des structures de page et variantes de CTA ; choisir selon le besoin."
          },
          {
            "hours": 3,
            "procedure": "Tester la compréhension du texte et réécrire à partir des retours."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 2,
            "procedure": "Construire une charte de voix à partir d'exemples et contre-exemples."
          },
          {
            "hours": 2,
            "procedure": "Rédiger des récits vérifiables ; contrôler les citations, droits et authenticité."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Transformer les questions du public en briefs éditoriaux structurés."
          },
          {
            "hours": 3,
            "procedure": "Mettre en place un workflow IA : brouillon, fact-check, validation humaine, version."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 2,
            "procedure": "Explorer intentions SEO, vérifier sources et éviter les mots-clés artificiels."
          },
          {
            "hours": 3,
            "procedure": "Rédiger et auditer un article utile, contrôler faits, liens et métadonnées."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 2,
            "procedure": "Adapter un contenu aux canaux en gardant voix et cohérence."
          },
          {
            "hours": 2,
            "procedure": "Créer une séquence e-mail consentie, testée et désinscriptible."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 2,
            "procedure": "Définir événements, métriques, sources et dénominateurs."
          },
          {
            "hours": 2,
            "procedure": "Concevoir un test de message, distinguer simulation et données réelles."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 2,
            "procedure": "Assembler briefs, prompts versionnés, contrôle qualité et documentation."
          },
          {
            "hours": 3,
            "procedure": "Livrer le système éditorial et expliquer les corrections effectuées."
          }
        ]
      }
    ]
  },
  {
    "slug": "marketing-acquisition-ia",
    "title": "Marketing, acquisition et IA",
    "modules": [
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Segmenter des données autorisées avec critères explicites et vérification des biais."
          },
          {
            "hours": 4,
            "procedure": "Construire offre, hypothèses de conversion et preuves à tester."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Cartographier le funnel et définir un schéma d'événements."
          },
          {
            "hours": 5,
            "procedure": "Créer une landing instrumentée et contrôler la remontée des événements."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Produire plusieurs angles créatifs et vérifier les allégations."
          },
          {
            "hours": 3,
            "procedure": "Planifier et adapter des contenus aux canaux ; valider humainement les publications."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Configurer un CRM de test et faire vérifier les permissions et données minimales."
          },
          {
            "hours": 4,
            "procedure": "Élaborer des séquences avec consentement, règles d'arrêt et journalisation."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Comparer scénarios de budget et coûts à l'aide de calculs reproductibles."
          },
          {
            "hours": 4,
            "procedure": "Préparer une campagne en brouillon, contrôler paramètres et approbation des dépenses."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Calculer et vérifier les KPI à partir des données sources."
          },
          {
            "hours": 4,
            "procedure": "Comparer modèles d'attribution, limites et risques de causalité abusive."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Préparer un test A/B avec hypothèse, mesure et règle d'arrêt."
          },
          {
            "hours": 4,
            "procedure": "Identifier une friction, corriger et mesurer à nouveau."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Produire un bilan avec sources, dépenses et limites ; exclure les chiffres inventés."
          },
          {
            "hours": 3,
            "procedure": "Démontrer le funnel, le CRM et la méthode d'optimisation."
          }
        ]
      }
    ]
  },
  {
    "slug": "automatisation-integrations-agents-ia",
    "title": "Automatisation, intégrations et agents IA",
    "modules": [
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Modéliser le processus et décider quelles actions doivent rester humaines."
          },
          {
            "hours": 3,
            "procedure": "Définir des schémas JSON, exemples synthétiques et validations."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 5,
            "procedure": "Utiliser l'IA pour générer un client API de test, vérifier secrets et contrats."
          },
          {
            "hours": 5,
            "procedure": "Construire un webhook signé, idempotent et testé avec duplicatas."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Orchestrer des branches et transformations déterministes ; tester les cas limites."
          },
          {
            "hours": 4,
            "procedure": "Configurer reprises bornées, délais et file d'erreurs, vérifier par simulation."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Créer une approbation humaine explicite avant toute action sensible."
          },
          {
            "hours": 4,
            "procedure": "Déployer en environnement isolé, tester rollback et reprise."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 5,
            "procedure": "Concevoir un agent avec outils autorisés, sorties structurées et limites de coût."
          },
          {
            "hours": 5,
            "procedure": "Tester les injections sur cas synthétiques et vérifier le confinement des outils."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Construire un jeu d'évaluation avec résultats attendus validés humainement."
          },
          {
            "hours": 4,
            "procedure": "Comparer modèles sur le même jeu : qualité, latence, coût et erreurs."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Journaliser les événements sans secrets, simuler une alerte."
          },
          {
            "hours": 4,
            "procedure": "Vérifier permissions minimales, révocation, arrêt et reprise."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Produire runbook reproductible et tester une restauration."
          },
          {
            "hours": 3,
            "procedure": "Démontrer le système supervisé, ses limites et les preuves d'évaluation."
          }
        ]
      }
    ]
  },
  {
    "slug": "infrastructure-devops-cybersecurite",
    "title": "Infrastructure, DevOps et cybersécurité",
    "modules": [
      {
        "activities": [
          {
            "hours": 5,
            "procedure": "Cartographier un laboratoire autorisé ; utiliser l'IA pour identifier risques et hypothèses."
          },
          {
            "hours": 5,
            "procedure": "Relire chaque commande Linux, appliquer moindre privilège et vérifier les accès."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 6,
            "procedure": "Générer Dockerfile minimal et contrôles de dépendances ; vérifier build et non-root."
          },
          {
            "hours": 6,
            "procedure": "Configurer un réseau isolé, contrôler ports et routage par tests locaux."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 6,
            "procedure": "Générer un pipeline CI, provoquer un échec contrôlé, vérifier secrets et artefacts."
          },
          {
            "hours": 7,
            "procedure": "Automatiser une livraison en laboratoire avec approbation et rollback testé."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 6,
            "procedure": "Concevoir une sauvegarde chiffrée et vérifier rétention et intégrité."
          },
          {
            "hours": 7,
            "procedure": "Restaurer dans un environnement séparé et mesurer durée et résultat."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 5,
            "procedure": "Utiliser l'IA pour suggérer des réglages défensifs, vérifier les changements un à un."
          },
          {
            "hours": 5,
            "procedure": "Analyser les dépendances de son projet, confirmer les alertes et retester les correctifs."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 6,
            "procedure": "Instrumenter métriques et logs expurgés, vérifier unités et seuils."
          },
          {
            "hours": 6,
            "procedure": "Simuler une panne autorisée, déclencher l'alerte et documenter le rétablissement."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 6,
            "procedure": "Recréer l'infrastructure à partir de configuration versionnée, tester idempotence."
          },
          {
            "hours": 6,
            "procedure": "Préparer des tests de charge bornés en laboratoire, mesurer p50/p95 et coûts."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Écrire et éprouver un runbook d'exploitation et de restauration."
          },
          {
            "hours": 4,
            "procedure": "Démontrer reconstruction, supervision et reprise ; défendre les choix de sécurité."
          }
        ]
      }
    ]
  },
  {
    "slug": "entrepreneuriat-numerique-monetisation",
    "title": "Entrepreneuriat numérique et monétisation",
    "modules": [
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Analyser des entretiens sourcés, différencier demande observée et hypothèse."
          },
          {
            "hours": 3,
            "procedure": "Comparer modèles économiques et construire une carte d'hypothèses testables."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Générer des variantes d'offre, clarifier conditions, limites et prix."
          },
          {
            "hours": 3,
            "procedure": "Créer un prototype commercial et analyser les objections consenties."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Modéliser coûts et marges avec formules vérifiées et scénarios."
          },
          {
            "hours": 3,
            "procedure": "Tester des hypothèses tarifaires sans inventer de volonté d'achat."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Préparer CRM et scripts de vente avec qualification et consentement."
          },
          {
            "hours": 3,
            "procedure": "Produire devis et facture de test ; contrôler calculs et paiement sandbox."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 2,
            "procedure": "Concevoir et tester un onboarding client avec critères de réussite."
          },
          {
            "hours": 2,
            "procedure": "Créer un support documenté, règles d'escalade et tests de cas."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 2,
            "procedure": "Comparer canaux et budgets d'expérimentation avec hypothèses explicites."
          },
          {
            "hours": 3,
            "procedure": "Mener des essais autorisés, documenter retours et limites."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Construire prévision de trésorerie et seuil de rentabilité, vérifier les calculs."
          },
          {
            "hours": 2,
            "procedure": "Identifier obligations à vérifier auprès de sources compétentes ; prioriser les risques."
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 2,
            "procedure": "Assembler dossier d'entreprise, preuves et plan d'action réaliste."
          },
          {
            "hours": 3,
            "procedure": "Démontrer le parcours commercial et défendre les décisions sans promesse de revenus."
          }
        ]
      }
    ]
  }
];
export const aiMastery=[
 {title:"Cadrer et contextualiser",detail:"Objectif, sources autorisées, contraintes, format de sortie, exemples et critères de réussite."},
 {title:"Choisir et orchestrer",detail:"Comparer modèles et outils selon qualité, coût, confidentialité et capacité; décomposer les tâches et versionner les instructions."},
 {title:"Vérifier et corriger",detail:"Contrôler faits, calculs, code et références; tester cas limites, mesurer et documenter les corrections."},
 {title:"Sécuriser et défendre",detail:"Minimiser les données, isoler les secrets, borner les actions et justifier les choix devant le formateur."}
];
export function getAiTrainingPlan(slug:string){return aiTrainingPlans.find(p=>p.slug===slug);}
export function trainingHours(plan:AiTrainingPlan){return plan.modules.reduce((n,m)=>n+m.activities.reduce((a,l)=>a+l.hours,0),0);}
export type StudyRhythm={regular_days:number[]|null;minutes_per_day:number;optional_days?:number[]};
export function estimateTraining(hours:number,rhythm:StudyRhythm|null){
 if(!rhythm||!Number.isFinite(hours)||hours<=0||![300,360,480,600].includes(rhythm.minutes_per_day))return null;
 const days=rhythm.regular_days;
 if(!Array.isArray(days)||days.length<3||days.length>7||new Set(days).size!==days.length||days.some(d=>!Number.isInteger(d)||d<1||d>7))return null;
 const dailyHours=rhythm.minutes_per_day/60,weeklyHours=dailyHours*days.length;
 const sessions=Math.ceil(hours/dailyHours),fullWeeks=Math.floor(sessions/days.length),extraSessions=sessions%days.length;
 return {dailyHours,weeklyHours,sessions,fullWeeks,extraSessions,weeks:hours/weeklyHours};
}
export function estimateLabel(hours:number,rhythm:StudyRhythm|null){
 const e=estimateTraining(hours,rhythm);if(!e)return null;
 const parts=[e.fullWeeks?e.fullWeeks+" sem.":null,e.extraSessions?e.extraSessions+" séance"+(e.extraSessions>1?"s":""):null].filter(Boolean);
 return parts.join(" + ");
}
