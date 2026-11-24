/** Proposed workload and AI mastery overlay. Existing official lesson IDs/rubrics are unchanged. */
export type AiActivity={hours:number;procedure:string;minutes:number;understandingMinutes:number;productionMinutes:number;verificationMinutes:number};
export type AiTrainingPlan={slug:string;title:string;modules:{activities:AiActivity[]}[]};
export const aiTrainingPlans:AiTrainingPlan[]=[
  {
    "slug": "ingenierie-produit-ia",
    "title": "Ingénierie produit et IA",
    "modules": [
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Recherche augmentée : cadrer le contexte, synthétiser les entretiens anonymisés, distinguer observations et hypothèses.",
            "minutes": 240,
            "understandingMinutes": 70,
            "productionMinutes": 100,
            "verificationMinutes": 70
          },
          {
            "hours": 4,
            "procedure": "PRD structuré et prototype : demander des alternatives, spécifier les contraintes et les critères d'acceptation.",
            "minutes": 240,
            "understandingMinutes": 70,
            "productionMinutes": 100,
            "verificationMinutes": 70
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 5,
            "procedure": "Agent de code : fournir conventions, architecture et fichiers pertinents, planifier les changements avant exécution.",
            "minutes": 300,
            "understandingMinutes": 90,
            "productionMinutes": 120,
            "verificationMinutes": 90
          },
          {
            "hours": 6,
            "procedure": "Déployer un flux vertical : petits commits, tests de bout en bout, vérification manuelle et rollback.",
            "minutes": 360,
            "understandingMinutes": 110,
            "productionMinutes": 140,
            "verificationMinutes": 110
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 5,
            "procedure": "Développer avec contrats typés, permissions explicites et tests négatifs générés puis vérifiés.",
            "minutes": 300,
            "understandingMinutes": 90,
            "productionMinutes": 120,
            "verificationMinutes": 90
          },
          {
            "hours": 4,
            "procedure": "Faire auditer le code et l'UX par l'IA, reproduire les anomalies et mesurer les corrections.",
            "minutes": 240,
            "understandingMinutes": 70,
            "productionMinutes": 100,
            "verificationMinutes": 70
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 5,
            "procedure": "Livraison reproductible : CI, variables d'environnement, logs expurgés et contrôle des migrations.",
            "minutes": 300,
            "understandingMinutes": 90,
            "productionMinutes": 120,
            "verificationMinutes": 90
          },
          {
            "hours": 4,
            "procedure": "Synthétiser les retours réels, classifier les frictions, prioriser et retester sans inventer les données.",
            "minutes": 240,
            "understandingMinutes": 70,
            "productionMinutes": 100,
            "verificationMinutes": 70
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Comparer offres et objections à partir de sources réelles, tester les hypothèses de valeur.",
            "minutes": 180,
            "understandingMinutes": 55,
            "productionMinutes": 70,
            "verificationMinutes": 55
          },
          {
            "hours": 4,
            "procedure": "Créer une landing avec IA, instrumenter les événements et vérifier consentement et mesure.",
            "minutes": 240,
            "understandingMinutes": 70,
            "productionMinutes": 100,
            "verificationMinutes": 70
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Préparer des créatifs et expériences d'acquisition avec hypothèses, limites et budget.",
            "minutes": 180,
            "understandingMinutes": 55,
            "productionMinutes": 70,
            "verificationMinutes": 55
          },
          {
            "hours": 3,
            "procedure": "Automatiser le CRM avec validation humaine, dédoublonnage et règles d'arrêt.",
            "minutes": 180,
            "understandingMinutes": 55,
            "productionMinutes": 70,
            "verificationMinutes": 55
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 3,
            "procedure": "Modéliser prix et coûts avec calculs vérifiés, tester la facturation en sandbox.",
            "minutes": 180,
            "understandingMinutes": 55,
            "productionMinutes": 70,
            "verificationMinutes": 55
          },
          {
            "hours": 3,
            "procedure": "Simuler les objections, conduire de vrais entretiens et distinguer intérêt et vente.",
            "minutes": 180,
            "understandingMinutes": 55,
            "productionMinutes": 70,
            "verificationMinutes": 55
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 4,
            "procedure": "Générer runbook et tests de résilience, vérifier sauvegarde, restauration et coût.",
            "minutes": 240,
            "understandingMinutes": 70,
            "productionMinutes": 100,
            "verificationMinutes": 70
          },
          {
            "hours": 3,
            "procedure": "Présenter le dépôt, démontrer le produit et défendre les choix et limites de l'IA.",
            "minutes": 180,
            "understandingMinutes": 55,
            "productionMinutes": 70,
            "verificationMinutes": 55
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
            "hours": 1.5,
            "procedure": "Synthétiser des entretiens anonymisés avec citations et contre-exemples.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          },
          {
            "hours": 1,
            "procedure": "Cartographier le parcours, générer des alternatives et vérifier l'architecture avec des utilisateurs.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.25,
            "procedure": "Générer puis comparer wireframes sous contraintes métier et accessibilité.",
            "minutes": 75,
            "understandingMinutes": 25,
            "productionMinutes": 25,
            "verificationMinutes": 25
          },
          {
            "hours": 2,
            "procedure": "Prototyper le flux, observer les utilisateurs et corriger les points de friction.",
            "minutes": 120,
            "understandingMinutes": 35,
            "productionMinutes": 50,
            "verificationMinutes": 35
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.5,
            "procedure": "Produire des références visuelles et variantes, contrôler cohérence, droits et originalité.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          },
          {
            "hours": 1,
            "procedure": "Convertir la direction artistique en tokens et vérifier les contrastes.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 2,
            "procedure": "Construire des composants, variantes et états réutilisables avec IA.",
            "minutes": 120,
            "understandingMinutes": 35,
            "productionMinutes": 50,
            "verificationMinutes": 35
          },
          {
            "hours": 2,
            "procedure": "Générer des écrans responsive puis vérifier les contraintes dans le navigateur.",
            "minutes": 120,
            "understandingMinutes": 35,
            "productionMinutes": 50,
            "verificationMinutes": 35
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.25,
            "procedure": "Utiliser l'IA pour proposer un audit, confirmer clavier, focus et contrastes manuellement.",
            "minutes": 75,
            "understandingMinutes": 25,
            "productionMinutes": 25,
            "verificationMinutes": 25
          },
          {
            "hours": 1.5,
            "procedure": "Préparer des scénarios de test neutres, analyser les observations réelles.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1,
            "procedure": "Explorer micro-interactions et storyboard, vérifier intention et mouvement réduit.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          },
          {
            "hours": 1,
            "procedure": "Spécifier déclencheurs, durées et fallbacks puis tester l'intégration.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.25,
            "procedure": "Produire un handoff structuré, tokens et spécifications vérifiables.",
            "minutes": 75,
            "understandingMinutes": 25,
            "productionMinutes": 25,
            "verificationMinutes": 25
          },
          {
            "hours": 1.25,
            "procedure": "Comparer captures et prototype, classer les écarts et retester.",
            "minutes": 75,
            "understandingMinutes": 25,
            "productionMinutes": 25,
            "verificationMinutes": 25
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1,
            "procedure": "Structurer une étude de cas à partir de preuves, sans inventer d'indicateurs.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          },
          {
            "hours": 1.5,
            "procedure": "Démontrer la bibliothèque, le flux et défendre les arbitrages sans assistance.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
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
            "hours": 0.75,
            "procedure": "Constituer un corpus sourcé et anonymisé ; demander une analyse des objections avec extraits.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          },
          {
            "hours": 0.75,
            "procedure": "Créer des propositions de valeur contrastées avec preuves, public et contraintes.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 0.75,
            "procedure": "Générer des structures de page et variantes de CTA ; choisir selon le besoin.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          },
          {
            "hours": 1,
            "procedure": "Tester la compréhension du texte et réécrire à partir des retours.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 0.5,
            "procedure": "Construire une charte de voix à partir d'exemples et contre-exemples.",
            "minutes": 30,
            "understandingMinutes": 10,
            "productionMinutes": 10,
            "verificationMinutes": 10
          },
          {
            "hours": 0.75,
            "procedure": "Rédiger des récits vérifiables ; contrôler les citations, droits et authenticité.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 0.75,
            "procedure": "Transformer les questions du public en briefs éditoriaux structurés.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          },
          {
            "hours": 1,
            "procedure": "Mettre en place un workflow IA : brouillon, fact-check, validation humaine, version.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 0.5,
            "procedure": "Explorer intentions SEO, vérifier sources et éviter les mots-clés artificiels.",
            "minutes": 30,
            "understandingMinutes": 10,
            "productionMinutes": 10,
            "verificationMinutes": 10
          },
          {
            "hours": 0.75,
            "procedure": "Rédiger et auditer un article utile, contrôler faits, liens et métadonnées.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 0.5,
            "procedure": "Adapter un contenu aux canaux en gardant voix et cohérence.",
            "minutes": 30,
            "understandingMinutes": 10,
            "productionMinutes": 10,
            "verificationMinutes": 10
          },
          {
            "hours": 0.5,
            "procedure": "Créer une séquence e-mail consentie, testée et désinscriptible.",
            "minutes": 30,
            "understandingMinutes": 10,
            "productionMinutes": 10,
            "verificationMinutes": 10
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 0.5,
            "procedure": "Définir événements, métriques, sources et dénominateurs.",
            "minutes": 30,
            "understandingMinutes": 10,
            "productionMinutes": 10,
            "verificationMinutes": 10
          },
          {
            "hours": 0.75,
            "procedure": "Concevoir un test de message, distinguer simulation et données réelles.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 0.75,
            "procedure": "Assembler briefs, prompts versionnés, contrôle qualité et documentation.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          },
          {
            "hours": 1,
            "procedure": "Livrer le système éditorial et expliquer les corrections effectuées.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
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
            "hours": 1.25,
            "procedure": "Segmenter des données autorisées avec critères explicites et vérification des biais.",
            "minutes": 75,
            "understandingMinutes": 25,
            "productionMinutes": 25,
            "verificationMinutes": 25
          },
          {
            "hours": 1,
            "procedure": "Construire offre, hypothèses de conversion et preuves à tester.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1,
            "procedure": "Cartographier le funnel et définir un schéma d'événements.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          },
          {
            "hours": 2,
            "procedure": "Créer une landing instrumentée et contrôler la remontée des événements.",
            "minutes": 120,
            "understandingMinutes": 35,
            "productionMinutes": 50,
            "verificationMinutes": 35
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.5,
            "procedure": "Produire plusieurs angles créatifs et vérifier les allégations.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          },
          {
            "hours": 1,
            "procedure": "Planifier et adapter des contenus aux canaux ; valider humainement les publications.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.5,
            "procedure": "Configurer un CRM de test et faire vérifier les permissions et données minimales.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          },
          {
            "hours": 1.25,
            "procedure": "Élaborer des séquences avec consentement, règles d'arrêt et journalisation.",
            "minutes": 75,
            "understandingMinutes": 25,
            "productionMinutes": 25,
            "verificationMinutes": 25
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.25,
            "procedure": "Comparer scénarios de budget et coûts à l'aide de calculs reproductibles.",
            "minutes": 75,
            "understandingMinutes": 25,
            "productionMinutes": 25,
            "verificationMinutes": 25
          },
          {
            "hours": 1.5,
            "procedure": "Préparer une campagne en brouillon, contrôler paramètres et approbation des dépenses.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.25,
            "procedure": "Calculer et vérifier les KPI à partir des données sources.",
            "minutes": 75,
            "understandingMinutes": 25,
            "productionMinutes": 25,
            "verificationMinutes": 25
          },
          {
            "hours": 1,
            "procedure": "Comparer modèles d'attribution, limites et risques de causalité abusive.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.25,
            "procedure": "Préparer un test A/B avec hypothèse, mesure et règle d'arrêt.",
            "minutes": 75,
            "understandingMinutes": 25,
            "productionMinutes": 25,
            "verificationMinutes": 25
          },
          {
            "hours": 1.5,
            "procedure": "Identifier une friction, corriger et mesurer à nouveau.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1,
            "procedure": "Produire un bilan avec sources, dépenses et limites ; exclure les chiffres inventés.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          },
          {
            "hours": 1,
            "procedure": "Démontrer le funnel, le CRM et la méthode d'optimisation.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
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
            "hours": 1,
            "procedure": "Modéliser le processus et décider quelles actions doivent rester humaines.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          },
          {
            "hours": 1,
            "procedure": "Définir des schémas JSON, exemples synthétiques et validations.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.5,
            "procedure": "Utiliser l'IA pour générer un client API de test, vérifier secrets et contrats.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          },
          {
            "hours": 2,
            "procedure": "Construire un webhook signé, idempotent et testé avec duplicatas.",
            "minutes": 120,
            "understandingMinutes": 35,
            "productionMinutes": 50,
            "verificationMinutes": 35
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.5,
            "procedure": "Orchestrer des branches et transformations déterministes ; tester les cas limites.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          },
          {
            "hours": 1.5,
            "procedure": "Configurer reprises bornées, délais et file d'erreurs, vérifier par simulation.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.5,
            "procedure": "Créer une approbation humaine explicite avant toute action sensible.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          },
          {
            "hours": 2,
            "procedure": "Déployer en environnement isolé, tester rollback et reprise.",
            "minutes": 120,
            "understandingMinutes": 35,
            "productionMinutes": 50,
            "verificationMinutes": 35
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 2.5,
            "procedure": "Concevoir un agent avec outils autorisés, sorties structurées et limites de coût.",
            "minutes": 150,
            "understandingMinutes": 45,
            "productionMinutes": 60,
            "verificationMinutes": 45
          },
          {
            "hours": 2,
            "procedure": "Tester les injections sur cas synthétiques et vérifier le confinement des outils.",
            "minutes": 120,
            "understandingMinutes": 35,
            "productionMinutes": 50,
            "verificationMinutes": 35
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.5,
            "procedure": "Construire un jeu d'évaluation avec résultats attendus validés humainement.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          },
          {
            "hours": 1.5,
            "procedure": "Comparer modèles sur le même jeu : qualité, latence, coût et erreurs.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.25,
            "procedure": "Journaliser les événements sans secrets, simuler une alerte.",
            "minutes": 75,
            "understandingMinutes": 25,
            "productionMinutes": 25,
            "verificationMinutes": 25
          },
          {
            "hours": 1.5,
            "procedure": "Vérifier permissions minimales, révocation, arrêt et reprise.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.5,
            "procedure": "Produire runbook reproductible et tester une restauration.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          },
          {
            "hours": 1.25,
            "procedure": "Démontrer le système supervisé, ses limites et les preuves d'évaluation.",
            "minutes": 75,
            "understandingMinutes": 25,
            "productionMinutes": 25,
            "verificationMinutes": 25
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
            "hours": 1.5,
            "procedure": "Cartographier un laboratoire autorisé ; utiliser l'IA pour identifier risques et hypothèses.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          },
          {
            "hours": 1.5,
            "procedure": "Relire chaque commande Linux, appliquer moindre privilège et vérifier les accès.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 0.75,
            "procedure": "Générer Dockerfile minimal et contrôles de dépendances ; vérifier build et non-root.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          },
          {
            "hours": 1,
            "procedure": "Configurer un réseau isolé, contrôler ports et routage par tests locaux.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.5,
            "procedure": "Générer un pipeline CI, provoquer un échec contrôlé, vérifier secrets et artefacts.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          },
          {
            "hours": 2.5,
            "procedure": "Automatiser une livraison en laboratoire avec approbation et rollback testé.",
            "minutes": 150,
            "understandingMinutes": 45,
            "productionMinutes": 60,
            "verificationMinutes": 45
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1,
            "procedure": "Concevoir une sauvegarde chiffrée et vérifier rétention et intégrité.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          },
          {
            "hours": 1.5,
            "procedure": "Restaurer dans un environnement séparé et mesurer durée et résultat.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.5,
            "procedure": "Utiliser l'IA pour suggérer des réglages défensifs, vérifier les changements un à un.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          },
          {
            "hours": 1.5,
            "procedure": "Analyser les dépendances de son projet, confirmer les alertes et retester les correctifs.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 2,
            "procedure": "Instrumenter métriques et logs expurgés, vérifier unités et seuils.",
            "minutes": 120,
            "understandingMinutes": 35,
            "productionMinutes": 50,
            "verificationMinutes": 35
          },
          {
            "hours": 2,
            "procedure": "Simuler une panne autorisée, déclencher l'alerte et documenter le rétablissement.",
            "minutes": 120,
            "understandingMinutes": 35,
            "productionMinutes": 50,
            "verificationMinutes": 35
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 2.5,
            "procedure": "Recréer l'infrastructure à partir de configuration versionnée, tester idempotence.",
            "minutes": 150,
            "understandingMinutes": 45,
            "productionMinutes": 60,
            "verificationMinutes": 45
          },
          {
            "hours": 1.5,
            "procedure": "Préparer des tests de charge bornés en laboratoire, mesurer p50/p95 et coûts.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1.5,
            "procedure": "Écrire et éprouver un runbook d'exploitation et de restauration.",
            "minutes": 90,
            "understandingMinutes": 25,
            "productionMinutes": 40,
            "verificationMinutes": 25
          },
          {
            "hours": 2,
            "procedure": "Démontrer reconstruction, supervision et reprise ; défendre les choix de sécurité.",
            "minutes": 120,
            "understandingMinutes": 35,
            "productionMinutes": 50,
            "verificationMinutes": 35
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
            "hours": 0.75,
            "procedure": "Analyser des entretiens sourcés, différencier demande observée et hypothèse.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          },
          {
            "hours": 0.75,
            "procedure": "Comparer modèles économiques et construire une carte d'hypothèses testables.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 0.75,
            "procedure": "Générer des variantes d'offre, clarifier conditions, limites et prix.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          },
          {
            "hours": 1,
            "procedure": "Créer un prototype commercial et analyser les objections consenties.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 0.75,
            "procedure": "Modéliser coûts et marges avec formules vérifiées et scénarios.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          },
          {
            "hours": 0.75,
            "procedure": "Tester des hypothèses tarifaires sans inventer de volonté d'achat.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1,
            "procedure": "Préparer CRM et scripts de vente avec qualification et consentement.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          },
          {
            "hours": 1,
            "procedure": "Produire devis et facture de test ; contrôler calculs et paiement sandbox.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 0.5,
            "procedure": "Concevoir et tester un onboarding client avec critères de réussite.",
            "minutes": 30,
            "understandingMinutes": 10,
            "productionMinutes": 10,
            "verificationMinutes": 10
          },
          {
            "hours": 0.5,
            "procedure": "Créer un support documenté, règles d'escalade et tests de cas.",
            "minutes": 30,
            "understandingMinutes": 10,
            "productionMinutes": 10,
            "verificationMinutes": 10
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 0.75,
            "procedure": "Comparer canaux et budgets d'expérimentation avec hypothèses explicites.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          },
          {
            "hours": 1,
            "procedure": "Mener des essais autorisés, documenter retours et limites.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 1,
            "procedure": "Construire prévision de trésorerie et seuil de rentabilité, vérifier les calculs.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
          },
          {
            "hours": 0.75,
            "procedure": "Identifier obligations à vérifier auprès de sources compétentes ; prioriser les risques.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          }
        ]
      },
      {
        "activities": [
          {
            "hours": 0.75,
            "procedure": "Assembler dossier d'entreprise, preuves et plan d'action réaliste.",
            "minutes": 45,
            "understandingMinutes": 15,
            "productionMinutes": 15,
            "verificationMinutes": 15
          },
          {
            "hours": 1,
            "procedure": "Démontrer le parcours commercial et défendre les décisions sans promesse de revenus.",
            "minutes": 60,
            "understandingMinutes": 20,
            "productionMinutes": 20,
            "verificationMinutes": 20
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
export function trainingMinutes(plan:AiTrainingPlan){return plan.modules.reduce((n,m)=>n+m.activities.reduce((a,l)=>a+l.minutes,0),0);}
export function trainingHours(plan:AiTrainingPlan){return trainingMinutes(plan)/60;}
export function formatWorkload(minutes:number){const n=Math.round(minutes),h=Math.floor(n/60),m=n%60;return h?h+' h'+(m?' '+String(m).padStart(2,'0'):''):m+' min';}
export type StudyRhythm={regular_days:number[]|null;minutes_per_day:number;optional_days?:number[]};
export function estimateTraining(hours:number,rhythm:StudyRhythm|null){
 if(!rhythm||!Number.isFinite(hours)||hours<=0||![300,360,480,600].includes(rhythm.minutes_per_day))return null;
 const days=rhythm.regular_days;
 if(!Array.isArray(days)||days.length<3||days.length>7||new Set(days).size!==days.length||days.some(d=>!Number.isInteger(d)||d<1||d>7))return null;
 const dailyHours=rhythm.minutes_per_day/60,weeklyHours=dailyHours*days.length;
 const sessions=Math.ceil(Math.round(hours*60)/rhythm.minutes_per_day),fullWeeks=Math.floor(sessions/days.length),extraSessions=sessions%days.length;
 return {dailyHours,weeklyHours,sessions,fullWeeks,extraSessions,weeks:hours/weeklyHours};
}
export function estimateLabel(hours:number,rhythm:StudyRhythm|null){
 const e=estimateTraining(hours,rhythm);if(!e)return null;
 const parts=[e.fullWeeks?e.fullWeeks+" sem.":null,e.extraSessions?e.extraSessions+" séance"+(e.extraSessions>1?"s":""):null].filter(Boolean);
 return parts.join(" + ");
}
