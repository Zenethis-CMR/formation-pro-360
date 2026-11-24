/** Propositions éditoriales privées à adapter et valider humainement. */
export type ProductionGuide={title:string;context:string;demonstration:string;guidedWork:string;prompt:string;verification:string;rubric:{label:string;descriptor:string}[]};
export const productionGuides:Record<string,Record<string,ProductionGuide>>={
  "infrastructure-devops-cybersecurite": {
    "s1-a1": {
      "title": "Cartographie infrastructure",
      "context": "VM de laboratoire, inventaire local",
      "demonstration": "Tracer services, stockage et frontières réseau depuis l'inventaire.",
      "guidedWork": "Comparer diagramme et configuration réelle; relever les inconnues.",
      "prompt": "Génère un diagramme des composants fournis, sans inventer de ports ni d'adresses. Associe un risque et un contrôle à chaque frontière.",
      "verification": "1. Périmètre autorisé et exclusions\n2. Flux avec origine destination protocole\n3. Actifs réellement inventoriés\n4. Risques et mesures de réduction. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Périmètre",
          "descriptor": "Preuve attendue : Périmètre autorisé et exclusions. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Flux",
          "descriptor": "Preuve attendue : Flux avec origine destination protocole. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Actifs",
          "descriptor": "Preuve attendue : Actifs réellement inventoriés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Risques",
          "descriptor": "Preuve attendue : Risques et mesures de réduction. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s1-a2": {
      "title": "Linux et accès",
      "context": "VM de test, deux comptes fictifs",
      "demonstration": "Montrer un accès réussi et un accès refusé avec un compte limité.",
      "guidedWork": "Créer un compte de test et vérifier permissions et traces sans secret.",
      "prompt": "Propose des permissions minimales à partir de ce besoin et de l'état actuel. Explique vérification et retour arrière.",
      "verification": "1. Privilèges strictement nécessaires\n2. Accès légitime réussi et interdit refusé\n3. Traces expurgées et observables\n4. Procédure et retour arrière reproductibles. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Moindre privilège",
          "descriptor": "Preuve attendue : Privilèges strictement nécessaires. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Accès",
          "descriptor": "Preuve attendue : Accès légitime réussi et interdit refusé. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Logs",
          "descriptor": "Preuve attendue : Traces expurgées et observables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Reproductibilité",
          "descriptor": "Preuve attendue : Procédure et retour arrière reproductibles. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s2-a1": {
      "title": "Images et Docker",
      "context": "Application exemple clonée, Docker installé",
      "demonstration": "Lire le manifeste, générer un Dockerfile minimal et expliquer image de base et utilisateur.",
      "guidedWork": "Construire puis démarrer l'image; contrôler l'utilisateur effectif et la réponse.",
      "prompt": "Lis le manifeste et le point d'entrée. Propose une image versionnée non-root, un build minimal et des tests locaux. Explique chaque instruction.",
      "verification": "1. Image construite sans erreur\n2. Processus effectivement non-root\n3. Base et dépendances versionnées\n4. Démarrage et réponse vérifiés. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Build",
          "descriptor": "Preuve attendue : Image construite sans erreur. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Non-root",
          "descriptor": "Preuve attendue : Processus effectivement non-root. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Versions",
          "descriptor": "Preuve attendue : Base et dépendances versionnées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Tests",
          "descriptor": "Preuve attendue : Démarrage et réponse vérifiés. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s2-a2": {
      "title": "Réseau et reverse proxy",
      "context": "Deux services locaux et proxy de test",
      "demonstration": "Illustrer un service interne accessible par le proxy, mais pas directement depuis l'hôte.",
      "guidedWork": "Écrire Compose, tester résolution et routes valides et invalides, vérifier les ports.",
      "prompt": "Propose une configuration réseau et proxy à partir des services fournis. N'expose que le point d'entrée nécessaire.",
      "verification": "1. Service interne non publié\n2. Proxy route vers le bon service\n3. Ports exposés limités et contrôlés\n4. Configuration et recette documentées. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Isolation",
          "descriptor": "Preuve attendue : Service interne non publié. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Routage",
          "descriptor": "Preuve attendue : Proxy route vers le bon service. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Ports",
          "descriptor": "Preuve attendue : Ports exposés limités et contrôlés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Documentation",
          "descriptor": "Preuve attendue : Configuration et recette documentées. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s3-a1": {
      "title": "Pipeline CI",
      "context": "Dépôt test, commande de test connue",
      "demonstration": "Lancer un pipeline vert puis provoquer un échec contrôlé.",
      "guidedWork": "Configurer CI et lancer deux exécutions; vérifier les artefacts et les logs.",
      "prompt": "Lis les scripts du dépôt. Propose une CI reproductible avec tests bloquants, artefact identifié et secrets externalisés.",
      "verification": "1. Tests réellement exécutés\n2. Test cassé bloque la livraison\n3. Artefact identifiable et traçable\n4. Secrets absents des fichiers et logs. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Tests",
          "descriptor": "Preuve attendue : Tests réellement exécutés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Échec",
          "descriptor": "Preuve attendue : Test cassé bloque la livraison. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Artefacts",
          "descriptor": "Preuve attendue : Artefact identifiable et traçable. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Secrets",
          "descriptor": "Preuve attendue : Secrets absents des fichiers et logs. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s3-a2": {
      "title": "Déploiement continu",
      "context": "Deux versions du service de laboratoire",
      "demonstration": "Déployer une version, vérifier sa santé puis revenir à la précédente.",
      "guidedWork": "Préparer livraison de test avec approbation et démontrer rollback sur une version défaillante.",
      "prompt": "Propose une livraison versionnée avec approbation et retour arrière en cas d'échec de santé. Sépare secrets et paramètres.",
      "verification": "1. Version déployée identifiable\n2. Approbation explicite avant bascule\n3. Recette de santé exécutée\n4. Retour arrière réellement testé. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Version",
          "descriptor": "Preuve attendue : Version déployée identifiable. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Approbation",
          "descriptor": "Preuve attendue : Approbation explicite avant bascule. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Recette",
          "descriptor": "Preuve attendue : Recette de santé exécutée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Rollback",
          "descriptor": "Preuve attendue : Retour arrière réellement testé. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s4-a1": {
      "title": "Sauvegarde",
      "context": "Données fictives, stockage distinct",
      "demonstration": "Créer une sauvegarde exemple et expliquer chiffrement, rétention et clé externe.",
      "guidedWork": "Sauvegarder l'échantillon et contrôler manifeste, accès et intégrité.",
      "prompt": "Propose une procédure pour ces données et cette destination. Sépare clés, rétention et vérification; aucune suppression automatique.",
      "verification": "1. Périmètre des données défini\n2. Chiffrement vérifié sans exposer clé\n3. Rétention et responsable définis\n4. Journal et preuve d'intégrité. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Périmètre",
          "descriptor": "Preuve attendue : Périmètre des données défini. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Chiffrement",
          "descriptor": "Preuve attendue : Chiffrement vérifié sans exposer clé. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Rétention",
          "descriptor": "Preuve attendue : Rétention et responsable définis. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Vérification",
          "descriptor": "Preuve attendue : Journal et preuve d'intégrité. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s4-a2": {
      "title": "Restauration",
      "context": "Sauvegarde fictive précédente",
      "demonstration": "Restaurer un fichier dans un dossier distinct et comparer son empreinte.",
      "guidedWork": "Restaurer l'ensemble de test, chronométrer et comparer les fichiers ou requêtes de contrôle.",
      "prompt": "Décris une restauration isolée sans écraser l'original, avec critères d'arrêt et vérification d'intégrité.",
      "verification": "1. Destination distincte confirmée\n2. Intégrité comparée à la référence\n3. Durée effectivement mesurée\n4. Rapport des étapes et écarts. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Isolation",
          "descriptor": "Preuve attendue : Destination distincte confirmée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Intégrité",
          "descriptor": "Preuve attendue : Intégrité comparée à la référence. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Durée",
          "descriptor": "Preuve attendue : Durée effectivement mesurée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Documentation",
          "descriptor": "Preuve attendue : Rapport des étapes et écarts. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s5-a1": {
      "title": "Durcissement",
      "context": "VM isolée, configuration initiale",
      "demonstration": "Montrer un réglage défensif réversible et retester le service.",
      "guidedWork": "Appliquer les correctifs autorisés un à un et conserver l'état initial.",
      "prompt": "Propose des réglages défensifs prioritaires pour cet inventaire, leurs effets, tests et retour arrière. Exclue tout système externe.",
      "verification": "1. Correctifs ciblés et documentés\n2. Accès limités sans verrouillage\n3. Configuration sauvegardée ou versionnée\n4. Tests avant/après concluants. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Correctifs",
          "descriptor": "Preuve attendue : Correctifs ciblés et documentés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Accès",
          "descriptor": "Preuve attendue : Accès limités sans verrouillage. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Configuration",
          "descriptor": "Preuve attendue : Configuration sauvegardée ou versionnée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Retest",
          "descriptor": "Preuve attendue : Tests avant/après concluants. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s5-a2": {
      "title": "Audit de dépendances",
      "context": "Projet test et manifeste dépendances",
      "demonstration": "Lire une alerte et distinguer vulnérabilité signalée et impact contextualisé.",
      "guidedWork": "Scanner, prioriser, corriger sur une copie et relancer scan et tests.",
      "prompt": "Analyse le rapport et manifeste fournis. Distingue faits et inconnues, propose un correctif minimal et tests de non-régression.",
      "verification": "1. Inventaire réel daté\n2. Priorités fondées sur risque\n3. Correction ciblée versionnée\n4. Scanner et tests relancés. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Inventaire",
          "descriptor": "Preuve attendue : Inventaire réel daté. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Priorités",
          "descriptor": "Preuve attendue : Priorités fondées sur risque. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Correctifs",
          "descriptor": "Preuve attendue : Correction ciblée versionnée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Retest",
          "descriptor": "Preuve attendue : Scanner et tests relancés. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s6-a1": {
      "title": "Métriques et logs",
      "context": "Service de test et requêtes locales",
      "demonstration": "Afficher disponibilité, erreur et journal expurgé.",
      "guidedWork": "Configurer un tableau minimal; provoquer requête saine et erreur, vérifier les signaux.",
      "prompt": "Propose trois métriques avec unités, seuils justifiés et logs expurgés. N'invente pas de mesures.",
      "verification": "1. Métriques définies avec unités\n2. Logs corrélables sans secrets\n3. Seuils justifiés\n4. Valeurs observées après test. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Métriques",
          "descriptor": "Preuve attendue : Métriques définies avec unités. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Logs expurgés",
          "descriptor": "Preuve attendue : Logs corrélables sans secrets. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Seuils",
          "descriptor": "Preuve attendue : Seuils justifiés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Validation",
          "descriptor": "Preuve attendue : Valeurs observées après test. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s6-a2": {
      "title": "Alertes et incidents",
      "context": "Service et supervision du défi précédent",
      "demonstration": "Simuler une panne autorisée puis rétablir le service.",
      "guidedWork": "Chronométrer détection, intervention et retour; contrôler le signal d'alerte.",
      "prompt": "Prépare un scénario de panne locale non destructif avec critères d'arrêt, escalade et chronologie.",
      "verification": "1. Alerte réellement déclenchée\n2. Escalade et rôle définis\n3. Rétablissement confirmé\n4. Retour d'expérience et action corrective. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Détection",
          "descriptor": "Preuve attendue : Alerte réellement déclenchée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Escalade",
          "descriptor": "Preuve attendue : Escalade et rôle définis. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Rétablissement",
          "descriptor": "Preuve attendue : Rétablissement confirmé. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Retex",
          "descriptor": "Preuve attendue : Retour d'expérience et action corrective. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s7-a1": {
      "title": "Configuration déclarative",
      "context": "VM jetable, configuration versionnée",
      "demonstration": "Reconstruire un composant puis répéter l'exécution.",
      "guidedWork": "Reproduire l'environnement dans une VM distincte et contrôler différences et service.",
      "prompt": "Propose une configuration déclarative idempotente à partir de l'état cible, avec versions et secrets externes.",
      "verification": "1. Seconde exécution sans changement inutile\n2. Versions identifiables\n3. Secrets hors dépôt\n4. Reconstruction et recette réussies. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Idempotence",
          "descriptor": "Preuve attendue : Seconde exécution sans changement inutile. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Versions",
          "descriptor": "Preuve attendue : Versions identifiables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Secrets",
          "descriptor": "Preuve attendue : Secrets hors dépôt. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Recette",
          "descriptor": "Preuve attendue : Reconstruction et recette réussies. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s7-a2": {
      "title": "Capacité et performance",
      "context": "Service local et charge bornée autorisée",
      "demonstration": "Mesurer une charge courte; expliquer médiane et percentile.",
      "guidedWork": "Comparer deux tests aux mêmes conditions, relever p50/p95, CPU et erreurs.",
      "prompt": "Prépare un protocole local avec concurrence, durée et arrêt bornés. Calcule les statistiques uniquement sur mesures fournies.",
      "verification": "1. Protocole et limites explicites\n2. Mesures observées avec unités\n3. Coûts documentés ou inconnus\n4. Décision proportionnée aux données. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Protocole",
          "descriptor": "Preuve attendue : Protocole et limites explicites. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Mesures",
          "descriptor": "Preuve attendue : Mesures observées avec unités. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Coûts",
          "descriptor": "Preuve attendue : Coûts documentés ou inconnus. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Décision",
          "descriptor": "Preuve attendue : Décision proportionnée aux données. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s8-a1": {
      "title": "Runbook de production",
      "context": "Service test et procédures éprouvées",
      "demonstration": "Suivre un runbook comme un opérateur extérieur au projet.",
      "guidedWork": "Rédiger démarrage, diagnostic et restauration, faire tester au formateur.",
      "prompt": "Transforme uniquement les étapes validées en runbook avec préconditions, rôles, critères d'arrêt et contrôles.",
      "verification": "1. Procédure reproductible sans deviner\n2. Responsables et escalade définis\n3. Restauration démontrée\n4. Version et résultats traçables. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Procédure",
          "descriptor": "Preuve attendue : Procédure reproductible sans deviner. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Rôles",
          "descriptor": "Preuve attendue : Responsables et escalade définis. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Restauration",
          "descriptor": "Preuve attendue : Restauration démontrée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Traçabilité",
          "descriptor": "Preuve attendue : Version et résultats traçables. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s8-a2": {
      "title": "Jury DevOps",
      "context": "Dépôt, service et preuves accumulées",
      "demonstration": "Présenter une démo : livraison, incident, restauration et limites.",
      "guidedWork": "Démontrer le service et un scénario de reprise; défendre les choix sans aide IA.",
      "prompt": "Simule un jury critique à partir des preuves. Interroge sur permissions, restauration, supervision et coût sans inventer de résultats.",
      "verification": "1. Démo reproductible\n2. Choix de sécurité justifiés\n3. Reprise et supervision prouvées\n4. Limites expliquées sans assistance. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Démo",
          "descriptor": "Preuve attendue : Démo reproductible. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Sécurité",
          "descriptor": "Preuve attendue : Choix de sécurité justifiés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Résilience",
          "descriptor": "Preuve attendue : Reprise et supervision prouvées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Défense",
          "descriptor": "Preuve attendue : Limites expliquées sans assistance. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    }
  },
  "automatisation-integrations-agents-ia": {
    "s1-a1": {
      "title": "Cartographie métier",
      "context": "Processus métier et données fictives",
      "demonstration": "Tracer une demande, ses états et décisions humaines.",
      "guidedWork": "Cartographier actuel/cible; comparer trois cas dont une exception.",
      "prompt": "Propose un diagramme actuel/cible à partir des acteurs et étapes. Liste les décisions qui doivent rester humaines.",
      "verification": "1. Entrées définies\n2. Sorties et destinataires définis\n3. Exceptions documentées\n4. Validation avant action sensible. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Entrées",
          "descriptor": "Preuve attendue : Entrées définies. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Sorties",
          "descriptor": "Preuve attendue : Sorties et destinataires définis. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Exceptions",
          "descriptor": "Preuve attendue : Exceptions documentées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Validation humaine",
          "descriptor": "Preuve attendue : Validation avant action sensible. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s1-a2": {
      "title": "Contrats de données",
      "context": "Exemples JSON synthétiques",
      "demonstration": "Montrer la différence entre champ absent et mauvais type.",
      "guidedWork": "Définir le contrat puis valider cas correct, incomplet et invalide.",
      "prompt": "Propose un schéma JSON minimal, exemples valides et invalides, erreurs sans données personnelles.",
      "verification": "1. Schéma versionné et précis\n2. Cas valides et invalides exécutés\n3. Données minimales synthétiques\n4. Erreurs explicites sans fuite. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Schéma",
          "descriptor": "Preuve attendue : Schéma versionné et précis. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Validation",
          "descriptor": "Preuve attendue : Cas valides et invalides exécutés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Confidentialité",
          "descriptor": "Preuve attendue : Données minimales synthétiques. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Erreurs",
          "descriptor": "Preuve attendue : Erreurs explicites sans fuite. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s2-a1": {
      "title": "API et authentification",
      "context": "API sandbox, documentation autorisée",
      "demonstration": "Montrer requête valide et refus d'authentification sans révéler jeton.",
      "guidedWork": "Créer client, contrôler réponse et tester refus et erreur.",
      "prompt": "Lis la documentation fournie. Propose un client test avec secret serveur, délai borné et gestion des statuts.",
      "verification": "1. Auth valide et refus testés\n2. Réponse validée\n3. Erreurs et délais gérés\n4. Secrets hors code et logs. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Auth",
          "descriptor": "Preuve attendue : Auth valide et refus testés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Validation",
          "descriptor": "Preuve attendue : Réponse validée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Erreurs",
          "descriptor": "Preuve attendue : Erreurs et délais gérés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Secrets",
          "descriptor": "Preuve attendue : Secrets hors code et logs. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s2-a2": {
      "title": "Webhook idempotent",
      "context": "Émetteur et récepteur webhook locaux",
      "demonstration": "Rejouer un événement et montrer le risque de double effet.",
      "guidedWork": "Valider signature, mémoriser identifiant et rejouer événement et signature invalide.",
      "prompt": "Propose un récepteur local signé et idempotent, avec test de duplicata et signature invalide.",
      "verification": "1. Signature invalide rejetée\n2. Duplicata sans double effet\n3. Tests exécutés\n4. Logs expurgés et corrélables. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Signature",
          "descriptor": "Preuve attendue : Signature invalide rejetée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Idempotence",
          "descriptor": "Preuve attendue : Duplicata sans double effet. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Tests",
          "descriptor": "Preuve attendue : Tests exécutés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Logs",
          "descriptor": "Preuve attendue : Logs expurgés et corrélables. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s3-a1": {
      "title": "Branches et transformations",
      "context": "Contrat JSON et règles métier",
      "demonstration": "Comparer sorties de deux branches déterministes.",
      "guidedWork": "Créer transformations et conditions; tester cas nominal et limites.",
      "prompt": "Propose une table entrées/sorties et transformations déterministes à partir des règles fournies.",
      "verification": "1. Branches conformes\n2. Transformation validée\n3. Cas limites testés\n4. Workflow exporté et documenté. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Règles",
          "descriptor": "Preuve attendue : Branches conformes. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Transformation",
          "descriptor": "Preuve attendue : Transformation validée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Cas limites",
          "descriptor": "Preuve attendue : Cas limites testés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Documentation",
          "descriptor": "Preuve attendue : Workflow exporté et documenté. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s3-a2": {
      "title": "Reprises et temporisation",
      "context": "Service simulant erreurs temporaires/permanentes",
      "demonstration": "Montrer reprise bornée et mise en file d'erreurs.",
      "guidedWork": "Configurer délai, maximum et traitement manuel; vérifier les tentatives.",
      "prompt": "Propose retry borné selon catégorie d'erreur et idempotence. Ne répète pas une action irréversible sans contrôle.",
      "verification": "1. Maximum et délai définis\n2. Erreurs classifiées\n3. File d'erreurs observable\n4. Reprise contrôlée sans double effet. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Bornes",
          "descriptor": "Preuve attendue : Maximum et délai définis. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Classification",
          "descriptor": "Preuve attendue : Erreurs classifiées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Alerte",
          "descriptor": "Preuve attendue : File d'erreurs observable. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Reprise",
          "descriptor": "Preuve attendue : Reprise contrôlée sans double effet. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s4-a1": {
      "title": "Approbation humaine",
      "context": "Action fictive à autorisation humaine",
      "demonstration": "Montrer refus et absence d'effet avant décision.",
      "guidedWork": "Créer approbation avec rôle, expiration et journal; tester accord et refus.",
      "prompt": "Propose états attente/accord/refus/expiration et contrôle de l'identité autorisée. L'action reste simulée.",
      "verification": "1. Décision réservée au rôle\n2. Refus sans effet\n3. Journal de décision\n4. Expiration sans effet. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Autorisation",
          "descriptor": "Preuve attendue : Décision réservée au rôle. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Refus",
          "descriptor": "Preuve attendue : Refus sans effet. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Audit",
          "descriptor": "Preuve attendue : Journal de décision. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Expiration",
          "descriptor": "Preuve attendue : Expiration sans effet. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s4-a2": {
      "title": "Déploiement du flux",
      "context": "Workflow test versionné et sandbox",
      "demonstration": "Importer et tester un workflow puis revenir à la version précédente.",
      "guidedWork": "Déployer une copie isolée, recette puis restauration.",
      "prompt": "Prépare installation et rollback pour ce workflow, paramètres et secrets séparés, tests de santé.",
      "verification": "1. Workflow fonctionnel en sandbox\n2. Secrets externalisés\n3. Recette vérifiée\n4. Rollback démontré. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Déploiement",
          "descriptor": "Preuve attendue : Workflow fonctionnel en sandbox. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Secrets",
          "descriptor": "Preuve attendue : Secrets externalisés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Recette",
          "descriptor": "Preuve attendue : Recette vérifiée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Rollback",
          "descriptor": "Preuve attendue : Rollback démontré. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s5-a1": {
      "title": "Entrées et outils",
      "context": "Classification et outils fictifs autorisés",
      "demonstration": "Montrer choix d'outil et sortie JSON validée.",
      "guidedWork": "Définir outils, budget et limite d'appels; tester outil inconnu et sortie invalide.",
      "prompt": "Propose instructions, schéma de sortie et outils autorisés. Toute action hors périmètre est refusée.",
      "verification": "1. Périmètre et limites explicites\n2. Sortie structurée validée\n3. Outils autorisés seulement\n4. Tests nominaux et refus. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Périmètre",
          "descriptor": "Preuve attendue : Périmètre et limites explicites. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Schéma",
          "descriptor": "Preuve attendue : Sortie structurée validée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Permissions",
          "descriptor": "Preuve attendue : Outils autorisés seulement. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Tests",
          "descriptor": "Preuve attendue : Tests nominaux et refus. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s5-a2": {
      "title": "Protection contre injections",
      "context": "Agent sandbox et documents fictifs non fiables",
      "demonstration": "Montrer qu'une instruction hors tâche dans un document reste une donnée.",
      "guidedWork": "Tester demandes synthétiques hors périmètre; vérifier le contrôle externe des outils.",
      "prompt": "Propose des tests bénins de séparation instruction/donnée dans ce laboratoire, avec refus attendu et sans cible réelle.",
      "verification": "1. Instructions et données distinctes\n2. Demandes hors périmètre refusées\n3. Permissions contrôlées hors modèle\n4. Tests avant/après conservés. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Séparation données",
          "descriptor": "Preuve attendue : Instructions et données distinctes. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Refus",
          "descriptor": "Preuve attendue : Demandes hors périmètre refusées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Contrôles",
          "descriptor": "Preuve attendue : Permissions contrôlées hors modèle. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Retest",
          "descriptor": "Preuve attendue : Tests avant/après conservés. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s6-a1": {
      "title": "Jeu d'évaluation",
      "context": "Dix cas synthétiques, contrat de sortie",
      "demonstration": "Montrer un exemple avec attendu explicite et jugement humain.",
      "guidedWork": "Construire un jeu normal/ambigu/refus, faire valider les attendus, le versionner.",
      "prompt": "Propose des exemples synthétiques à partir du contrat; distingue attendus déterministes et jugements humains.",
      "verification": "1. Couverture usages et refus\n2. Attendus validés humainement\n3. Jeu versionné reproductible\n4. Limites reconnues. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Couverture",
          "descriptor": "Preuve attendue : Couverture usages et refus. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Attendus",
          "descriptor": "Preuve attendue : Attendus validés humainement. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Reproductibilité",
          "descriptor": "Preuve attendue : Jeu versionné reproductible. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Limites",
          "descriptor": "Preuve attendue : Limites reconnues. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s6-a2": {
      "title": "Coûts et qualité",
      "context": "Jeu d'évaluation et deux configurations",
      "demonstration": "Comparer deux réponses sur le même exemple et relever les mesures.",
      "guidedWork": "Exécuter les mêmes cas; relever qualité, durée et coût observé ou inconnu.",
      "prompt": "Construis un tableau qualité/latence/coût pour les mesures fournies. Ne suppose ni prix ni résultats manquants.",
      "verification": "1. Protocole comparable\n2. Mesures observées avec unités\n3. Analyse des erreurs et limites\n4. Décision argumentée. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Protocole",
          "descriptor": "Preuve attendue : Protocole comparable. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Mesures",
          "descriptor": "Preuve attendue : Mesures observées avec unités. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Analyse",
          "descriptor": "Preuve attendue : Analyse des erreurs et limites. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Décision",
          "descriptor": "Preuve attendue : Décision argumentée. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s7-a1": {
      "title": "Logs et alertes",
      "context": "Workflow test et événements synthétiques",
      "demonstration": "Afficher début et erreur liés par identifiant de corrélation.",
      "guidedWork": "Configurer logs et seuil, simuler erreur et retrouver chemin d'exécution.",
      "prompt": "Propose un schéma de logs minimal avec corrélation, état et durée, sans contenu sensible.",
      "verification": "1. Événements corrélables\n2. Données sensibles exclues\n3. Seuil justifié\n4. Alerte réellement testée. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Corrélation",
          "descriptor": "Preuve attendue : Événements corrélables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Minimisation",
          "descriptor": "Preuve attendue : Données sensibles exclues. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Seuils",
          "descriptor": "Preuve attendue : Seuil justifié. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Test",
          "descriptor": "Preuve attendue : Alerte réellement testée. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s7-a2": {
      "title": "Permissions et incidents",
      "context": "Sandbox et jetons fictifs limités",
      "demonstration": "Révoquer un accès de test et arrêter manuellement le flux.",
      "guidedWork": "Vérifier permissions, arrêt, révocation puis reprise contrôlée.",
      "prompt": "Prépare un scénario d'incident autorisé en sandbox avec arrêt, révocation et retour contrôlé, sans toucher aux accès réels.",
      "verification": "1. Permissions minimales vérifiées\n2. Arrêt bloque les actions\n3. Reprise sans doublons\n4. Preuves expurgées datées. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Moindre privilège",
          "descriptor": "Preuve attendue : Permissions minimales vérifiées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Arrêt",
          "descriptor": "Preuve attendue : Arrêt bloque les actions. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Restauration",
          "descriptor": "Preuve attendue : Reprise sans doublons. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Preuves",
          "descriptor": "Preuve attendue : Preuves expurgées datées. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s8-a1": {
      "title": "Runbook et transfert",
      "context": "Workflow final et historique de tests",
      "demonstration": "Faire diagnostiquer une erreur à partir du runbook.",
      "guidedWork": "Documenter démarrage, erreur, reprise et maintenance; tester une restauration.",
      "prompt": "Transforme les preuves en runbook; marque les procédures non vérifiées et indique responsable et version.",
      "verification": "1. Procédure reproductible\n2. Rôles et escalade définis\n3. Restauration démontrée\n4. Maintenance et versions documentées. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Procédure",
          "descriptor": "Preuve attendue : Procédure reproductible. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Rôles",
          "descriptor": "Preuve attendue : Rôles et escalade définis. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Tests",
          "descriptor": "Preuve attendue : Restauration démontrée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Maintenance",
          "descriptor": "Preuve attendue : Maintenance et versions documentées. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s8-a2": {
      "title": "Jury automatisation",
      "context": "Workflow final, évaluations et preuves",
      "demonstration": "Présenter cas nominal, erreur et approbation humaine.",
      "guidedWork": "Démontrer les scénarios, défendre choix du modèle et limites sans aide.",
      "prompt": "Simule un jury critique sur idempotence, coût, refus et supervision à partir des preuves. Ne valide rien à la place du formateur.",
      "verification": "1. Démo sur cas vérifiables\n2. Erreur et reprise démontrées\n3. Contrôle humain avant action sensible\n4. Choix et limites expliqués. Conserver les preuves datées, corriger les écarts puis refaire les tests avec le formateur.",
      "rubric": [
        {
          "label": "Démo",
          "descriptor": "Preuve attendue : Démo sur cas vérifiables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Fiabilité",
          "descriptor": "Preuve attendue : Erreur et reprise démontrées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Contrôle humain",
          "descriptor": "Preuve attendue : Contrôle humain avant action sensible. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Défense",
          "descriptor": "Preuve attendue : Choix et limites expliqués. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    }
  },
  "design-produit-ux-ui-motion": {
    "s1-a1": {
      "title": "Entretiens et recherche",
      "context": "Hypothèse de problème, trois personnes volontaires et notes anonymisées",
      "demonstration": "Comparer une question orientée avec une question sur un comportement passé, puis montrer une synthèse sourcée.",
      "guidedWork": "Préparer cinq questions, réaliser trois échanges consentis et relier chaque insight à une observation.",
      "prompt": "À partir de ce problème et de ces notes anonymisées, propose des questions ouvertes et une synthèse faits/hypothèses. Ne simule ni réponses ni témoignages.",
      "verification": "1. Questions ouvertes sans solution suggérée\n2. Consentement obtenu et identité masquée\n3. Chaque insight relié à une note réelle\n4. Problème choisi selon fréquence gravité et incertitude. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Questions ouvertes",
          "descriptor": "Preuve attendue : Questions ouvertes sans solution suggérée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Consentement",
          "descriptor": "Preuve attendue : Consentement obtenu et identité masquée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Synthèse sourcée",
          "descriptor": "Preuve attendue : Chaque insight relié à une note réelle. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Problème priorisé",
          "descriptor": "Preuve attendue : Problème choisi selon fréquence gravité et incertitude. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s1-a2": {
      "title": "Parcours et architecture d'information",
      "context": "Notes de recherche et scénario principal",
      "demonstration": "Transformer une observation en tâche, puis visualiser chemin nominal, erreur et retour.",
      "guidedWork": "Tracer la carte actuelle et cible, organiser les contenus et faire tester une recherche de rubrique.",
      "prompt": "À partir des tâches observées, propose deux architectures et leurs compromis. Indique les points à tester sans présumer du comportement utilisateur.",
      "verification": "1. Tâches reliées aux observations\n2. Arborescence permettant de trouver la fonction\n3. Frottements localisés avec conséquences\n4. Choix justifié par le test et ses limites. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Tâches identifiées",
          "descriptor": "Preuve attendue : Tâches reliées aux observations. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Navigation logique",
          "descriptor": "Preuve attendue : Arborescence permettant de trouver la fonction. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Points de friction",
          "descriptor": "Preuve attendue : Frottements localisés avec conséquences. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Justification",
          "descriptor": "Preuve attendue : Choix justifié par le test et ses limites. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s2-a1": {
      "title": "Wireframes et flux",
      "context": "Scénario et arborescence validables",
      "demonstration": "Comparer deux wireframes basse fidélité d'une même tâche avec états d'erreur.",
      "guidedWork": "Générer deux alternatives, dessiner les transitions et parcourir le chemin clavier ou clic.",
      "prompt": "Propose deux flux basse fidélité répondant à ce scénario, incluant état vide, chargement, succès et erreur. Justifie chaque transition.",
      "verification": "1. Flux réalisable de début à fin\n2. États normaux et échecs visibles\n3. Hiérarchie lisible sans décoration\n4. Alternative comparée selon critères explicites. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Cohérence du flux",
          "descriptor": "Preuve attendue : Flux réalisable de début à fin. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "États couverts",
          "descriptor": "Preuve attendue : États normaux et échecs visibles. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Lisibilité",
          "descriptor": "Preuve attendue : Hiérarchie lisible sans décoration. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Alternatives",
          "descriptor": "Preuve attendue : Alternative comparée selon critères explicites. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s2-a2": {
      "title": "Prototype cliquable",
      "context": "Wireframes et trois testeurs volontaires",
      "demonstration": "Créer une interaction cliquable puis conduire une tâche sans guider le testeur.",
      "guidedWork": "Relier les écrans, observer trois personnes et corriger au moins un problème constaté.",
      "prompt": "Rédige un scénario de test neutre et une grille d'observation pour ce prototype. Analyse uniquement les notes fournies.",
      "verification": "1. Scénario réalisable et testable\n2. Consignes sans indication du chemin\n3. Observations datées et anonymisées\n4. Modification liée à une difficulté réelle. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Scénario testable",
          "descriptor": "Preuve attendue : Scénario réalisable et testable. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Consignes neutres",
          "descriptor": "Preuve attendue : Consignes sans indication du chemin. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Observations",
          "descriptor": "Preuve attendue : Observations datées et anonymisées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Corrections",
          "descriptor": "Preuve attendue : Modification liée à une difficulté réelle. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s3-a1": {
      "title": "Direction artistique",
      "context": "Brief de marque, public et références autorisées",
      "demonstration": "Comparer deux moodboards en explicitant intention, contraste et ton.",
      "guidedWork": "Produire deux directions visuelles, sélectionner palette et typographie, argumenter un choix.",
      "prompt": "Propose deux directions à partir de ce brief, avec palette, typographie et usages. Signale les risques d'accessibilité et de droits.",
      "verification": "1. Direction adaptée au public et au message\n2. Contrastes mesurés sur couples utiles\n3. Palette et typographies cohérentes\n4. Choix comparé à une autre direction. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Adéquation cible",
          "descriptor": "Preuve attendue : Direction adaptée au public et au message. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Contraste",
          "descriptor": "Preuve attendue : Contrastes mesurés sur couples utiles. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Cohérence",
          "descriptor": "Preuve attendue : Palette et typographies cohérentes. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Justification",
          "descriptor": "Preuve attendue : Choix comparé à une autre direction. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s3-a2": {
      "title": "Tokens et grille",
      "context": "Palette, typographie et tailles cibles",
      "demonstration": "Transformer valeurs brutes en tokens sémantiques et montrer une modification propagée.",
      "guidedWork": "Créer échelles d'espace, couleurs et texte, puis appliquer grille à deux tailles.",
      "prompt": "Propose des tokens primitifs et sémantiques pour ces choix visuels. Définis une grille responsive et vérifications de contraste.",
      "verification": "1. Noms explicites et stables\n2. Échelles cohérentes sans valeurs arbitraires\n3. Contrastes contrôlés sur usages réels\n4. Tokens réutilisés dans deux écrans. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Nommage",
          "descriptor": "Preuve attendue : Noms explicites et stables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Échelle",
          "descriptor": "Preuve attendue : Échelles cohérentes sans valeurs arbitraires. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Contrastes",
          "descriptor": "Preuve attendue : Contrastes contrôlés sur usages réels. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Réutilisation",
          "descriptor": "Preuve attendue : Tokens réutilisés dans deux écrans. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s4-a1": {
      "title": "Composants et variantes",
      "context": "Tokens et exemples de bouton, champ et carte",
      "demonstration": "Construire un composant auto layout, ajouter variantes normal/focus/erreur.",
      "guidedWork": "Créer bibliothèque minimale, documenter propriétés et tester changement de contenu.",
      "prompt": "Décris les propriétés et états de ces composants, y compris clavier et labels. Propose une structure de variantes sans duplication inutile.",
      "verification": "1. États principaux et erreur couverts\n2. Auto layout résiste à texte long\n3. Noms et propriétés compréhensibles\n4. Focus et labels explicités. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "États",
          "descriptor": "Preuve attendue : États principaux et erreur couverts. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Auto layout",
          "descriptor": "Preuve attendue : Auto layout résiste à texte long. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Noms",
          "descriptor": "Preuve attendue : Noms et propriétés compréhensibles. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Accessibilité",
          "descriptor": "Preuve attendue : Focus et labels explicités. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s4-a2": {
      "title": "Écrans responsive",
      "context": "Bibliothèque et flux central",
      "demonstration": "Montrer comment une même composition change à largeur réduite.",
      "guidedWork": "Assembler les trois tailles, tester contenu long, navigation et état vide.",
      "prompt": "Propose une stratégie responsive fondée sur contenu et composants. Indique ce qui change de disposition, pas seulement de taille.",
      "verification": "1. Trois tailles sans débordement\n2. Composants et tokens partagés\n3. États vides utiles et explicites\n4. Action principale identifiable à chaque taille. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Adaptation",
          "descriptor": "Preuve attendue : Trois tailles sans débordement. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Cohérence",
          "descriptor": "Preuve attendue : Composants et tokens partagés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "États vides",
          "descriptor": "Preuve attendue : États vides utiles et explicites. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Hiérarchie",
          "descriptor": "Preuve attendue : Action principale identifiable à chaque taille. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s5-a1": {
      "title": "Audit accessibilité",
      "context": "Prototype ou interface testable, outil de contraste",
      "demonstration": "Comparer un contraste mesuré et une navigation clavier défaillante.",
      "guidedWork": "Relever les écarts, prioriser deux obstacles, corriger et retester.",
      "prompt": "À partir de ces captures et observations clavier, propose une checklist d'accessibilité. Distingue hypothèses et contrôles réellement exécutés.",
      "verification": "1. Mesures de contraste et focus observées\n2. Priorités fondées sur blocage utilisateur\n3. Corrections visibles et documentées\n4. Retest sur mêmes conditions. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Mesures",
          "descriptor": "Preuve attendue : Mesures de contraste et focus observées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Priorités",
          "descriptor": "Preuve attendue : Priorités fondées sur blocage utilisateur. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Corrections",
          "descriptor": "Preuve attendue : Corrections visibles et documentées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Retest",
          "descriptor": "Preuve attendue : Retest sur mêmes conditions. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s5-a2": {
      "title": "Tests utilisateurs avancés",
      "context": "Deux versions du prototype et scénarios stables",
      "demonstration": "Comparer deux observations sur la même tâche, sans tirer de conclusion statistique abusive.",
      "guidedWork": "Exécuter le protocole avant/après, relever réussite et difficulté, modifier une interaction.",
      "prompt": "Analyse ces observations anonymisées à tâches constantes, distingue évolution et incertitude, propose une correction mesurable.",
      "verification": "1. Tâches et consignes identiques\n2. Mesures issues des observations\n3. Analyse mentionne biais et limites\n4. Itération liée aux résultats puis retestée. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Tâches stables",
          "descriptor": "Preuve attendue : Tâches et consignes identiques. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Mesures",
          "descriptor": "Preuve attendue : Mesures issues des observations. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Analyse",
          "descriptor": "Preuve attendue : Analyse mentionne biais et limites. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Itération",
          "descriptor": "Preuve attendue : Itération liée aux résultats puis retestée. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s6-a1": {
      "title": "Micro-interactions",
      "context": "Trois interactions : action, chargement et confirmation",
      "demonstration": "Comparer transition utile et animation purement décorative.",
      "guidedWork": "Prototyper trois retours avec déclencheur, durée et alternative réduite.",
      "prompt": "Propose des micro-interactions qui clarifient ces états. Décris déclencheur, durée, interruption et alternative mouvement réduit.",
      "verification": "1. Intention liée à une action\n2. Durées choisies et comparées\n3. Alternative sans mouvement testée\n4. Retour compréhensible sans animation. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Intention",
          "descriptor": "Preuve attendue : Intention liée à une action. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Durées",
          "descriptor": "Preuve attendue : Durées choisies et comparées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Mouvement réduit",
          "descriptor": "Preuve attendue : Alternative sans mouvement testée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Clarté",
          "descriptor": "Preuve attendue : Retour compréhensible sans animation. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s6-a2": {
      "title": "Motion et intégration",
      "context": "Prototypes motion et environnement de démonstration",
      "demonstration": "Transcrire une animation en spécification et vérifier une préférence de mouvement réduit.",
      "guidedWork": "Documenter tokens et déclencheurs, intégrer ou démontrer un exemple et tester le fallback.",
      "prompt": "Convertis ce storyboard en spécification de transition : états, déclencheurs, paramètres et fallback accessible.",
      "verification": "1. Tokens de durée et courbe définis\n2. Déclencheurs et interruptions décrits\n3. Fallback réduit ou statique disponible\n4. Exécution vérifiée dans la démonstration. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Tokens",
          "descriptor": "Preuve attendue : Tokens de durée et courbe définis. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Déclencheurs",
          "descriptor": "Preuve attendue : Déclencheurs et interruptions décrits. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Fallback",
          "descriptor": "Preuve attendue : Fallback réduit ou statique disponible. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Vérification",
          "descriptor": "Preuve attendue : Exécution vérifiée dans la démonstration. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s7-a1": {
      "title": "Handoff et documentation",
      "context": "Fichier design et composants terminés",
      "demonstration": "Montrer le parcours d'un développeur recherchant un état et sa spécification.",
      "guidedWork": "Nettoyer les pages, référencer tokens, règles et états, vérifier le transfert sur un écran.",
      "prompt": "Prépare une checklist de handoff à partir de ces écrans, signale les décisions manquantes sans les inventer.",
      "verification": "1. Fichier navigable avec noms utiles\n2. Spécifications et tokens accessibles\n3. États et cas limites documentés\n4. Liens versionnés vers les décisions. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Organisation",
          "descriptor": "Preuve attendue : Fichier navigable avec noms utiles. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Spécifications",
          "descriptor": "Preuve attendue : Spécifications et tokens accessibles. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "États",
          "descriptor": "Preuve attendue : États et cas limites documentés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Traçabilité",
          "descriptor": "Preuve attendue : Liens versionnés vers les décisions. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s7-a2": {
      "title": "Recette UI",
      "context": "Prototype de référence et interface intégrée",
      "demonstration": "Comparer deux captures de même largeur et distinguer défaut critique et cosmétique.",
      "guidedWork": "Relever écarts sur trois tailles, corriger un défaut prioritaire et refaire capture/test.",
      "prompt": "Compare ces références et captures à tailles identiques. Classe les écarts par impact et propose un test de correction.",
      "verification": "1. Comparaisons mêmes états et tailles\n2. Trois largeurs contrôlées\n3. Priorité liée à impact utilisateur\n4. Correction vérifiée par nouvelle capture. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Comparaison",
          "descriptor": "Preuve attendue : Comparaisons mêmes états et tailles. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Responsive",
          "descriptor": "Preuve attendue : Trois largeurs contrôlées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Priorisation",
          "descriptor": "Preuve attendue : Priorité liée à impact utilisateur. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Retest",
          "descriptor": "Preuve attendue : Correction vérifiée par nouvelle capture. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s8-a1": {
      "title": "Étude de cas",
      "context": "Journal de décisions, captures et résultats de tests",
      "demonstration": "Construire une narration problème, hypothèse, changement, preuve et limite.",
      "guidedWork": "Assembler une étude de cas avec avant/après et références anonymisées.",
      "prompt": "Structure une étude de cas uniquement à partir des preuves fournies. Signale les métriques absentes et les limites.",
      "verification": "1. Preuves vérifiables et sourcées\n2. Narration relie problème et décisions\n3. Résultats observés sans invention\n4. Données et visuels autorisés. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Preuves",
          "descriptor": "Preuve attendue : Preuves vérifiables et sourcées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Narration",
          "descriptor": "Preuve attendue : Narration relie problème et décisions. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Résultats",
          "descriptor": "Preuve attendue : Résultats observés sans invention. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Confidentialité",
          "descriptor": "Preuve attendue : Données et visuels autorisés. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s8-a2": {
      "title": "Jury design",
      "context": "Prototype, bibliothèque et rapport de recette",
      "demonstration": "Illustrer une soutenance centrée sur une tâche et une décision de design.",
      "guidedWork": "Démontrer le flux, un état d'erreur et un composant, puis défendre une correction sans IA.",
      "prompt": "Simule un jury de design à partir de ces pièces. Interroge sur cohérence, accessibilité et alternatives sans inventer de résultats.",
      "verification": "1. Flux démontré en direct\n2. Système cohérent dans plusieurs états\n3. Accessibilité prouvée par contrôles\n4. Arbitrages expliqués sans assistance. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Démo",
          "descriptor": "Preuve attendue : Flux démontré en direct. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Cohérence",
          "descriptor": "Preuve attendue : Système cohérent dans plusieurs états. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Accessibilité",
          "descriptor": "Preuve attendue : Accessibilité prouvée par contrôles. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Défense",
          "descriptor": "Preuve attendue : Arbitrages expliqués sans assistance. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    }
  },
  "copywriting-communication-contenu-ia": {
    "s1-a1": {
      "title": "Recherche d'audience",
      "context": "Corpus public autorisé ou notes consenties anonymisées",
      "demonstration": "Comparer un verbatim authentique avec une interprétation marketing.",
      "guidedWork": "Classer objections et besoins par segment en gardant référence à la source.",
      "prompt": "Analyse ce corpus en tableau segment/objection/extrait/source. Sépare faits et hypothèses, ne fabrique aucune citation.",
      "verification": "1. Corpus identifiable et daté\n2. Données consenties ou autorisées\n3. Segments fondés sur indices\n4. Synthèse reliée aux extraits. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Sources",
          "descriptor": "Preuve attendue : Corpus identifiable et daté. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Consentement",
          "descriptor": "Preuve attendue : Données consenties ou autorisées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Segmentation",
          "descriptor": "Preuve attendue : Segments fondés sur indices. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Synthèse",
          "descriptor": "Preuve attendue : Synthèse reliée aux extraits. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s1-a2": {
      "title": "Proposition de valeur",
      "context": "Corpus, fiche offre et preuves disponibles",
      "demonstration": "Comparer trois promesses et retirer une allégation non étayée.",
      "guidedWork": "Écrire trois versions, relier chaque bénéfice à une preuve et choisir pour une cible.",
      "prompt": "Génère trois propositions de valeur pour cette cible à partir des preuves fournies. Indique les allégations à vérifier.",
      "verification": "1. Message compris sans jargon\n2. Promesse liée au besoin\n3. Preuves présentes ou limites signalées\n4. Aucune garantie non fondée. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Clarté",
          "descriptor": "Preuve attendue : Message compris sans jargon. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Pertinence",
          "descriptor": "Preuve attendue : Promesse liée au besoin. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Preuves",
          "descriptor": "Preuve attendue : Preuves présentes ou limites signalées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Éthique",
          "descriptor": "Preuve attendue : Aucune garantie non fondée. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s2-a1": {
      "title": "Structure persuasive",
      "context": "Offre, objections et objectif de la page",
      "demonstration": "Montrer comment une page répond à une objection avant le CTA.",
      "guidedWork": "Composer titre, bénéfices, preuves, objections et action; tester la lecture rapide.",
      "prompt": "Propose deux structures de landing page pour cette offre. Utilise uniquement preuves disponibles et un CTA cohérent.",
      "verification": "1. Ordre des sections justifié\n2. Bénéfices spécifiques et clairs\n3. Objections traitées sans manipulation\n4. CTA précis et réalisable. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Hiérarchie",
          "descriptor": "Preuve attendue : Ordre des sections justifié. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Bénéfices",
          "descriptor": "Preuve attendue : Bénéfices spécifiques et clairs. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Objections",
          "descriptor": "Preuve attendue : Objections traitées sans manipulation. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "CTA",
          "descriptor": "Preuve attendue : CTA précis et réalisable. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s2-a2": {
      "title": "Page et test de compréhension",
      "context": "Wirecopy et trois lecteurs volontaires",
      "demonstration": "Conduire un test de compréhension sans expliquer le texte.",
      "guidedWork": "Mettre en page, recueillir trois reformulations anonymisées et corriger un passage.",
      "prompt": "Prépare des questions neutres sur compréhension, bénéfice et prochaine action. Analyse les réponses réelles fournies.",
      "verification": "1. Texte lisible et structuré\n2. Trois retours réellement obtenus\n3. Confusions identifiées à partir des notes\n4. Révision visible et justifiée. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Lisibilité",
          "descriptor": "Preuve attendue : Texte lisible et structuré. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Test",
          "descriptor": "Preuve attendue : Trois retours réellement obtenus. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Analyse",
          "descriptor": "Preuve attendue : Confusions identifiées à partir des notes. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Révision",
          "descriptor": "Preuve attendue : Révision visible et justifiée. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s3-a1": {
      "title": "Voix et ton",
      "context": "Exemples de marque autorisés et profils de public",
      "demonstration": "Transformer deux exemples en règles de ton avec contre-exemples.",
      "guidedWork": "Rédiger une charte de voix et tester un même message sur deux publics.",
      "prompt": "Extrais les caractéristiques de voix de ces exemples. Propose règles, formulations à éviter et variantes selon public.",
      "verification": "1. Règles cohérentes avec exemples\n2. Public et situation définis\n3. Exemples et contre-exemples utilisables\n4. Langage inclusif et compréhensible. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Cohérence",
          "descriptor": "Preuve attendue : Règles cohérentes avec exemples. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Public",
          "descriptor": "Preuve attendue : Public et situation définis. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Exemples",
          "descriptor": "Preuve attendue : Exemples et contre-exemples utilisables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Inclusion",
          "descriptor": "Preuve attendue : Langage inclusif et compréhensible. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s3-a2": {
      "title": "Storytelling",
      "context": "Expérience ou témoignage autorisé et sources",
      "demonstration": "Montrer la différence entre narration persuasive et anecdote inventée.",
      "guidedWork": "Écrire deux récits du même fait, vérifier détails et adapter au canal.",
      "prompt": "Structure deux récits à partir de ces faits seulement, signale les trous et n'attribue aucune citation non fournie.",
      "verification": "1. Début tension et résolution clairs\n2. Faits et citations vérifiables\n3. Lecture fluide sans ambiguïté\n4. Format adapté au canal. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Structure",
          "descriptor": "Preuve attendue : Début tension et résolution clairs. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Authenticité",
          "descriptor": "Preuve attendue : Faits et citations vérifiables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Clarté",
          "descriptor": "Preuve attendue : Lecture fluide sans ambiguïté. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Adaptation",
          "descriptor": "Preuve attendue : Format adapté au canal. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s4-a1": {
      "title": "Piliers et calendrier",
      "context": "Questions du public et objectifs éditoriaux",
      "demonstration": "Transformer une question en pilier, brief et indicateur.",
      "guidedWork": "Créer calendrier de quatre semaines avec responsables et objectifs par contenu.",
      "prompt": "Propose un calendrier à partir des questions et ressources disponibles, avec intention, format, responsable et indicateur.",
      "verification": "1. Piliers liés aux besoins\n2. Cadence réalisable selon capacité\n3. Objectifs explicites par contenu\n4. Responsables et dates définis. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Cohérence",
          "descriptor": "Preuve attendue : Piliers liés aux besoins. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Cadence",
          "descriptor": "Preuve attendue : Cadence réalisable selon capacité. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Objectifs",
          "descriptor": "Preuve attendue : Objectifs explicites par contenu. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Responsabilités",
          "descriptor": "Preuve attendue : Responsables et dates définis. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s4-a2": {
      "title": "Workflow IA supervisé",
      "context": "Brief, sources, brouillon et règles éditoriales",
      "demonstration": "Montrer une sortie IA erronée, vérifier source et corriger avant validation.",
      "guidedWork": "Construire workflow brouillon/vérification/révision/approbation; faire passer un contenu test.",
      "prompt": "Propose une procédure éditoriale avec registre des sources, contrôle d'originalité, confidentialité et approbation humaine.",
      "verification": "1. Sources vérifiées et traçables\n2. Réécriture originale contrôlée\n3. Approbation humaine avant diffusion\n4. Données sensibles exclues. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Sources",
          "descriptor": "Preuve attendue : Sources vérifiées et traçables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Originalité",
          "descriptor": "Preuve attendue : Réécriture originale contrôlée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Contrôle humain",
          "descriptor": "Preuve attendue : Approbation humaine avant diffusion. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Confidentialité",
          "descriptor": "Preuve attendue : Données sensibles exclues. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s5-a1": {
      "title": "Intentions de recherche",
      "context": "Questions clients et observations de recherche documentées",
      "demonstration": "Distinguer intention informationnelle, commerciale et navigationnelle.",
      "guidedWork": "Regrouper sujets, vérifier les résultats observables et préparer trois briefs.",
      "prompt": "Classe ces requêtes par intention à partir des éléments fournis. Propose sujets et briefs utiles sans inventer volumes ou positions.",
      "verification": "1. Intentions justifiées par observations\n2. Sources et date indiquées\n3. Structure répond à une question réelle\n4. Priorités fondées sur besoin. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Intentions",
          "descriptor": "Preuve attendue : Intentions justifiées par observations. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Sources",
          "descriptor": "Preuve attendue : Sources et date indiquées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Structure",
          "descriptor": "Preuve attendue : Structure répond à une question réelle. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Priorités",
          "descriptor": "Preuve attendue : Priorités fondées sur besoin. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s5-a2": {
      "title": "Article et optimisation",
      "context": "Brief SEO et sources de référence",
      "demonstration": "Rédiger un paragraphe sourcé et contrôler titre, description et lien.",
      "guidedWork": "Produire article en préproduction, relire les affirmations et tester les liens.",
      "prompt": "Rédige à partir de ce brief et de ces sources. Signale les affirmations non vérifiées, propose métadonnées sans promesse de classement.",
      "verification": "1. Faits contrôlés et liens sources\n2. Lecture claire et utile\n3. Métadonnées cohérentes\n4. Liens valides et pertinents. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Exactitude",
          "descriptor": "Preuve attendue : Faits contrôlés et liens sources. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Lisibilité",
          "descriptor": "Preuve attendue : Lecture claire et utile. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Métadonnées",
          "descriptor": "Preuve attendue : Métadonnées cohérentes. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Liens",
          "descriptor": "Preuve attendue : Liens valides et pertinents. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s6-a1": {
      "title": "Formats multicanaux",
      "context": "Contenu principal et contraintes de trois canaux",
      "demonstration": "Montrer la différence de format sans changer le fond du message.",
      "guidedWork": "Décliner texte, format court et visuel avec description accessible.",
      "prompt": "Adapte ce contenu à trois canaux, garde les preuves et la voix. Prévois alternatives textuelles et vérifie les droits.",
      "verification": "1. Format adapté à chaque canal\n2. Voix et faits cohérents\n3. Visuels accompagnés de texte utile\n4. Diffusion seulement autorisée. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Adaptation",
          "descriptor": "Preuve attendue : Format adapté à chaque canal. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Cohérence",
          "descriptor": "Preuve attendue : Voix et faits cohérents. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Accessibilité",
          "descriptor": "Preuve attendue : Visuels accompagnés de texte utile. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Consentement",
          "descriptor": "Preuve attendue : Diffusion seulement autorisée. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s6-a2": {
      "title": "Séquence e-mail",
      "context": "Offre et liste de test consentie",
      "demonstration": "Montrer un envoi fictif et la conséquence d'une désinscription.",
      "guidedWork": "Créer séquence, conditions d'arrêt et tester sur adresses de laboratoire.",
      "prompt": "Propose une séquence de trois messages pour contacts consentants. Prévois désinscription, arrêt après réponse et contrôle humain.",
      "verification": "1. Chaque message a un objectif pertinent\n2. Progression sans pression abusive\n3. Désinscription et arrêt prévus\n4. Scénario test exécuté. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Pertinence",
          "descriptor": "Preuve attendue : Chaque message a un objectif pertinent. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Progression",
          "descriptor": "Preuve attendue : Progression sans pression abusive. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Désinscription",
          "descriptor": "Preuve attendue : Désinscription et arrêt prévus. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Test",
          "descriptor": "Preuve attendue : Scénario test exécuté. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s7-a1": {
      "title": "Instrumentation éditoriale",
      "context": "Page test et événements disponibles",
      "demonstration": "Définir un événement puis vérifier sa remontée avec donnée fictive.",
      "guidedWork": "Documenter clic et conversion, déclencher tests et vérifier minimisation.",
      "prompt": "Propose un plan de mesure avec nom, déclencheur, unité et finalité de chaque événement. Exclue les données inutiles.",
      "verification": "1. Événements et indicateurs définis\n2. Déclenchement réellement testé\n3. Collecte minimale et justifiée\n4. Limites de mesure mentionnées. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Définitions",
          "descriptor": "Preuve attendue : Événements et indicateurs définis. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Test",
          "descriptor": "Preuve attendue : Déclenchement réellement testé. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Minimisation",
          "descriptor": "Preuve attendue : Collecte minimale et justifiée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Limites",
          "descriptor": "Preuve attendue : Limites de mesure mentionnées. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s7-a2": {
      "title": "Expérience de message",
      "context": "Deux variantes et hypothèse de message",
      "demonstration": "Montrer pourquoi changer deux variables rend le test ambigu.",
      "guidedWork": "Définir métrique, règle d'arrêt, variantes et analyser un résultat réel ou simulé étiqueté.",
      "prompt": "Construis un protocole comparatif avec une seule variable, critère de décision et limites d'échantillon. N'invente pas de données.",
      "verification": "1. Hypothèse réfutable\n2. Variantes comparables\n3. Analyse distingue simulation et réel\n4. Décision justifiée sans extrapolation. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Hypothèse",
          "descriptor": "Preuve attendue : Hypothèse réfutable. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Comparabilité",
          "descriptor": "Preuve attendue : Variantes comparables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Analyse",
          "descriptor": "Preuve attendue : Analyse distingue simulation et réel. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Décision",
          "descriptor": "Preuve attendue : Décision justifiée sans extrapolation. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s8-a1": {
      "title": "Documentation éditoriale",
      "context": "Charte, briefs, prompts et contrôle qualité",
      "demonstration": "Faire exécuter un brief par une autre personne et repérer une étape floue.",
      "guidedWork": "Assembler kit versionné avec exemple complet et checklist de validation.",
      "prompt": "Organise ces éléments en kit éditorial reproductible, indique entrées, sorties, contrôles et versions.",
      "verification": "1. Éléments essentiels présents\n2. Brief réutilisable sans deviner\n3. Contrôles et approbation documentés\n4. Versions et références traçables. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Complétude",
          "descriptor": "Preuve attendue : Éléments essentiels présents. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Réutilisation",
          "descriptor": "Preuve attendue : Brief réutilisable sans deviner. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Contrôle",
          "descriptor": "Preuve attendue : Contrôles et approbation documentés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Traçabilité",
          "descriptor": "Preuve attendue : Versions et références traçables. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s8-a2": {
      "title": "Jury communication",
      "context": "Kit éditorial, contenus et preuves de test",
      "demonstration": "Illustrer une démonstration du brief au contenu validé.",
      "guidedWork": "Présenter le workflow, une correction factuelle et le plan de suivi, répondre sans IA.",
      "prompt": "Joue un jury éditorial, interroge sur faits, cohérence, consentement et mesures à partir de ces preuves uniquement.",
      "verification": "1. Contenus et contrôles démontrés\n2. Explication structurée et claire\n3. Éthique et sources défendues\n4. Choix expliqués sans assistance. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Preuves",
          "descriptor": "Preuve attendue : Contenus et contrôles démontrés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Clarté",
          "descriptor": "Preuve attendue : Explication structurée et claire. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Éthique",
          "descriptor": "Preuve attendue : Éthique et sources défendues. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Défense",
          "descriptor": "Preuve attendue : Choix expliqués sans assistance. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    }
  },
  "marketing-acquisition-ia": {
    "s1-a1": {
      "title": "Segmentation",
      "context": "Données anonymisées autorisées et observations de marché",
      "demonstration": "Montrer deux segments issus de critères observables, pas de stéréotypes.",
      "guidedWork": "Construire matrice segments, besoin, signaux, capacité d'accès et incertitudes.",
      "prompt": "À partir des données fournies, propose des segments fondés sur comportements observés, preuves et limites. Ne déduis pas de traits sensibles.",
      "verification": "1. Sources identifiables et autorisées\n2. Critères observables et pertinents\n3. Priorisation expliquée\n4. Biais et données manquantes signalés. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Sources",
          "descriptor": "Preuve attendue : Sources identifiables et autorisées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Critères",
          "descriptor": "Preuve attendue : Critères observables et pertinents. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Priorisation",
          "descriptor": "Preuve attendue : Priorisation expliquée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Limites",
          "descriptor": "Preuve attendue : Biais et données manquantes signalés. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s1-a2": {
      "title": "Offre et hypothèses",
      "context": "Segment cible, fiche produit et retours",
      "demonstration": "Comparer une offre et une hypothèse de conversion non prouvée.",
      "guidedWork": "Formuler bénéfice, objections, preuve et hypothèse à tester.",
      "prompt": "Propose deux offres avec hypothèses de conversion testables à partir de ces retours, sans prédire de ventes.",
      "verification": "1. Valeur spécifique\n2. Cible clairement définie\n3. Preuves et objections reliées\n4. Hypothèse réfutable avec mesure. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Valeur",
          "descriptor": "Preuve attendue : Valeur spécifique. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Cible",
          "descriptor": "Preuve attendue : Cible clairement définie. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Preuves",
          "descriptor": "Preuve attendue : Preuves et objections reliées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Testabilité",
          "descriptor": "Preuve attendue : Hypothèse réfutable avec mesure. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s2-a1": {
      "title": "Cartographie du funnel",
      "context": "Scénario d'acquisition et page test",
      "demonstration": "Tracer de l'arrivée à la conversion et définir les événements.",
      "guidedWork": "Cartographier étapes, conversions et abandons, prévoir consentement.",
      "prompt": "Propose un funnel pour ce scénario avec événements, dénominateurs, consentement et inconnues. N'ajoute pas de données personnelles.",
      "verification": "1. Étapes reliées aux actions\n2. Mesures et dénominateurs définis\n3. Consentement prévu\n4. Correspondance entre parcours et événements. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Étapes",
          "descriptor": "Preuve attendue : Étapes reliées aux actions. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Mesures",
          "descriptor": "Preuve attendue : Mesures et dénominateurs définis. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Consentement",
          "descriptor": "Preuve attendue : Consentement prévu. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Cohérence",
          "descriptor": "Preuve attendue : Correspondance entre parcours et événements. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s2-a2": {
      "title": "Landing et instrumentation",
      "context": "Landing test et outil analytics configuré",
      "demonstration": "Déclencher un événement et le retrouver dans le mode test.",
      "guidedWork": "Créer page, tester CTA, vérifier événement et absence d'identifiants superflus.",
      "prompt": "À partir de ce brief, propose une landing et un plan de recette des événements. Ne collecte que les données nécessaires.",
      "verification": "1. CTA et page fonctionnels\n2. Message aligné sur offre\n3. Événement reçu une seule fois\n4. Collecte minimale et consentie. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Fonctionnement",
          "descriptor": "Preuve attendue : CTA et page fonctionnels. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Message",
          "descriptor": "Preuve attendue : Message aligné sur offre. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Mesure",
          "descriptor": "Preuve attendue : Événement reçu une seule fois. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Vie privée",
          "descriptor": "Preuve attendue : Collecte minimale et consentie. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s3-a1": {
      "title": "Concepts créatifs",
      "context": "Offre, public et références créatives autorisées",
      "demonstration": "Comparer trois angles et retirer une affirmation sans preuve.",
      "guidedWork": "Réaliser trois briefs ou visuels, annoter bénéfice, preuve et accessibilité.",
      "prompt": "Génère trois concepts créatifs distincts pour ce public, uniquement avec les preuves fournies. Indique les contrôles de droits.",
      "verification": "1. Angles répondent au besoin\n2. Créations distinctes et originales\n3. Allégations vérifiables\n4. Textes et visuels accessibles. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Pertinence",
          "descriptor": "Preuve attendue : Angles répondent au besoin. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Originalité",
          "descriptor": "Preuve attendue : Créations distinctes et originales. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Preuves",
          "descriptor": "Preuve attendue : Allégations vérifiables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Accessibilité",
          "descriptor": "Preuve attendue : Textes et visuels accessibles. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s3-a2": {
      "title": "Calendrier organique",
      "context": "Piliers, capacité de production et canaux",
      "demonstration": "Relier publication à un objectif et une réponse prospect.",
      "guidedWork": "Planifier contenus, préparer une publication autorisée et définir son suivi.",
      "prompt": "Propose un calendrier organique réaliste avec objectif, format, contrôle éditorial et indicateur par publication.",
      "verification": "1. Objectifs par contenu\n2. Cadence compatible avec ressources\n3. Contrôle qualité et autorisation\n4. Suivi et responsabilité définis. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Objectifs",
          "descriptor": "Preuve attendue : Objectifs par contenu. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Cadence",
          "descriptor": "Preuve attendue : Cadence compatible avec ressources. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Qualité",
          "descriptor": "Preuve attendue : Contrôle qualité et autorisation. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Suivi",
          "descriptor": "Preuve attendue : Suivi et responsabilité définis. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s4-a1": {
      "title": "Pipeline CRM",
      "context": "CRM sandbox et prospects fictifs signalés",
      "demonstration": "Faire évoluer un prospect dans le pipeline et tester un rôle limité.",
      "guidedWork": "Configurer états, champs minimaux et transition; tester droits et doublons.",
      "prompt": "Propose un schéma CRM à partir du processus fourni, champs minimaux, états et permissions. Utilise uniquement des données fictives.",
      "verification": "1. États et transitions clairs\n2. Champs justifiés et minimaux\n3. Accès selon rôle vérifié\n4. Scénario et doublon testés. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "États",
          "descriptor": "Preuve attendue : États et transitions clairs. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Données minimales",
          "descriptor": "Preuve attendue : Champs justifiés et minimaux. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Permissions",
          "descriptor": "Preuve attendue : Accès selon rôle vérifié. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Test",
          "descriptor": "Preuve attendue : Scénario et doublon testés. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s4-a2": {
      "title": "Suivi et relance",
      "context": "Prospects de test et consentements fictifs",
      "demonstration": "Montrer réponse, désinscription et arrêt d'une relance.",
      "guidedWork": "Créer séquence de test, règles d'arrêt et vérifier journal des actions.",
      "prompt": "Prépare des relances pertinentes pour contacts consentants avec arrêt sur réponse ou désinscription; aucune diffusion réelle.",
      "verification": "1. Message lié au contexte\n2. Consentement vérifié\n3. Arrêt testé sur réponse/retrait\n4. Actions et décisions journalisées. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Pertinence",
          "descriptor": "Preuve attendue : Message lié au contexte. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Consentement",
          "descriptor": "Preuve attendue : Consentement vérifié. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Arrêt",
          "descriptor": "Preuve attendue : Arrêt testé sur réponse/retrait. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Traçabilité",
          "descriptor": "Preuve attendue : Actions et décisions journalisées. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s5-a1": {
      "title": "Plan média",
      "context": "Objectif, plafond de dépense et hypothèses de coûts",
      "demonstration": "Comparer deux scénarios et montrer l'effet d'un coût plus élevé.",
      "guidedWork": "Préparer tableur budget, coûts unitaires et hypothèses; analyser scénario défavorable.",
      "prompt": "Modélise un plan média borné par ce budget. Sépare hypothèses et données mesurées; indique formule et risque pour chaque canal.",
      "verification": "1. Hypothèses explicites\n2. Plafond et calculs vérifiés\n3. Ciblage fondé sur besoin\n4. Risques et critères d'arrêt décrits. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Hypothèses",
          "descriptor": "Preuve attendue : Hypothèses explicites. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Budget",
          "descriptor": "Preuve attendue : Plafond et calculs vérifiés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Ciblage",
          "descriptor": "Preuve attendue : Ciblage fondé sur besoin. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Risques",
          "descriptor": "Preuve attendue : Risques et critères d'arrêt décrits. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s5-a2": {
      "title": "Campagne test",
      "context": "Compte campagne sandbox ou brouillon, créatifs validables",
      "demonstration": "Montrer les paramètres et la validation avant activation.",
      "guidedWork": "Préparer une campagne en brouillon, vérifier budget, ciblage et liens.",
      "prompt": "Construis une checklist de campagne selon ce brief; aucun achat ni publication sans accord humain explicite.",
      "verification": "1. Paramètres cohérents et contrôlés\n2. Créatifs et liens vérifiés\n3. Budget borné\n4. Autorisation requise avant activation. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Paramètres",
          "descriptor": "Preuve attendue : Paramètres cohérents et contrôlés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Créatifs",
          "descriptor": "Preuve attendue : Créatifs et liens vérifiés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Budget",
          "descriptor": "Preuve attendue : Budget borné. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Validation humaine",
          "descriptor": "Preuve attendue : Autorisation requise avant activation. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s6-a1": {
      "title": "Tableau de bord",
      "context": "Export de métriques fictives ou autorisées",
      "demonstration": "Recalculer CTR et coût à partir des numérateurs et dénominateurs.",
      "guidedWork": "Construire tableau avec formules, sources et traitement des valeurs manquantes.",
      "prompt": "Calcule les KPI uniquement à partir de ces données. Explique unités, dénominateurs, valeurs nulles et inconnues.",
      "verification": "1. Formules contrôlées\n2. Sources et dates indiquées\n3. Dénominateurs corrects\n4. Limites et données manquantes visibles. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Formules",
          "descriptor": "Preuve attendue : Formules contrôlées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Sources",
          "descriptor": "Preuve attendue : Sources et dates indiquées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Dénominateurs",
          "descriptor": "Preuve attendue : Dénominateurs corrects. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Limites",
          "descriptor": "Preuve attendue : Limites et données manquantes visibles. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s6-a2": {
      "title": "Attribution",
      "context": "Parcours de conversion et événements de test",
      "demonstration": "Comparer attribution premier et dernier contact sur un exemple.",
      "guidedWork": "Calculer deux modèles, relever écarts et éviter conclusion causale.",
      "prompt": "Compare ces modèles d'attribution sur les mêmes événements. Explique biais, limites et ce que les données ne prouvent pas.",
      "verification": "1. Modèles explicités\n2. Biais et causalité distingués\n3. Calculs reliés aux événements\n4. Décision proportionnée aux preuves. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Modèles",
          "descriptor": "Preuve attendue : Modèles explicités. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Biais",
          "descriptor": "Preuve attendue : Biais et causalité distingués. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Traçabilité",
          "descriptor": "Preuve attendue : Calculs reliés aux événements. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Décision",
          "descriptor": "Preuve attendue : Décision proportionnée aux preuves. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s7-a1": {
      "title": "Tests A/B",
      "context": "Deux variantes et jeu de données test",
      "demonstration": "Montrer une hypothèse et une seule différence entre variantes.",
      "guidedWork": "Définir protocole, échantillon, métrique, arrêt et analyse prudente.",
      "prompt": "Propose un test A/B à une variable, métrique et règle d'arrêt. Signale limites de taille et distingue simulation.",
      "verification": "1. Hypothèse réfutable\n2. Variantes comparables\n3. Échantillon et limites explicités\n4. Interprétation sans généralisation abusive. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Hypothèse",
          "descriptor": "Preuve attendue : Hypothèse réfutable. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Comparabilité",
          "descriptor": "Preuve attendue : Variantes comparables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Échantillon",
          "descriptor": "Preuve attendue : Échantillon et limites explicités. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Interprétation",
          "descriptor": "Preuve attendue : Interprétation sans généralisation abusive. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s7-a2": {
      "title": "Optimisation du funnel",
      "context": "Funnel instrumenté et observations",
      "demonstration": "Identifier une friction depuis les événements et comparer avant/après.",
      "guidedWork": "Corriger une étape et définir un retest aux mêmes conditions.",
      "prompt": "À partir de ces observations, classe les frictions par impact et confiance, propose une correction et un test de suivi.",
      "verification": "1. Diagnostic fondé sur données\n2. Priorité argumentée\n3. Correction visible et versionnée\n4. Retest prévu ou réalisé et identifié. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Diagnostic",
          "descriptor": "Preuve attendue : Diagnostic fondé sur données. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Priorité",
          "descriptor": "Preuve attendue : Priorité argumentée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Correction",
          "descriptor": "Preuve attendue : Correction visible et versionnée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Mesure",
          "descriptor": "Preuve attendue : Retest prévu ou réalisé et identifié. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s8-a1": {
      "title": "Bilan de campagne",
      "context": "Dépenses autorisées et résultats vérifiables",
      "demonstration": "Montrer un bilan qui distingue coût observé, hypothèse et résultat inconnu.",
      "guidedWork": "Assembler rapport, preuves anonymisées et recommandations sans extrapolation.",
      "prompt": "Prépare un bilan à partir des chiffres fournis; vérifie totaux et unités, signale données manquantes, ne fabrique aucune conversion.",
      "verification": "1. Chiffres rapprochés des sources\n2. Coûts et hypothèses séparés\n3. Résultats observés identifiables\n4. Limites et prochaine expérience explicites. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Exactitude",
          "descriptor": "Preuve attendue : Chiffres rapprochés des sources. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Coûts",
          "descriptor": "Preuve attendue : Coûts et hypothèses séparés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Résultats",
          "descriptor": "Preuve attendue : Résultats observés identifiables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Limites",
          "descriptor": "Preuve attendue : Limites et prochaine expérience explicites. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s8-a2": {
      "title": "Jury acquisition",
      "context": "Campagne test, CRM et tableau de bord",
      "demonstration": "Présenter une démo du clic à l'événement et à la décision d'optimisation.",
      "guidedWork": "Démontrer funnel, CRM et contrôle budget; défendre les résultats devant le formateur.",
      "prompt": "Simule un jury acquisition sur ces preuves : consentement, coûts, mesure, biais et optimisation, sans inventer de performance.",
      "verification": "1. Funnel et CRM démontrés\n2. Indicateurs et preuves vérifiables\n3. Consentement et budget défendus\n4. Arbitrages expliqués sans IA. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Démo",
          "descriptor": "Preuve attendue : Funnel et CRM démontrés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Preuves",
          "descriptor": "Preuve attendue : Indicateurs et preuves vérifiables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Éthique",
          "descriptor": "Preuve attendue : Consentement et budget défendus. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Défense",
          "descriptor": "Preuve attendue : Arbitrages expliqués sans IA. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    }
  },
  "entrepreneuriat-numerique-monetisation": {
    "s1-a1": {
      "title": "Entretiens de marché",
      "context": "Problème, trois volontaires et alternatives connues",
      "demonstration": "Comparer question sur un comportement passé et question de vente orientée.",
      "guidedWork": "Interroger trois personnes consentantes, noter faits et alternatives anonymisées.",
      "prompt": "Prépare un guide d'entretien ouvert et une synthèse faits/hypothèses à partir des notes. N'invente pas de clients.",
      "verification": "1. Questions ouvertes et non orientées\n2. Consentement et anonymisation\n3. Alternatives et notes sourcées\n4. Synthèse distingue besoin et hypothèse. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Questions",
          "descriptor": "Preuve attendue : Questions ouvertes et non orientées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Consentement",
          "descriptor": "Preuve attendue : Consentement et anonymisation. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Sources",
          "descriptor": "Preuve attendue : Alternatives et notes sourcées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Synthèse",
          "descriptor": "Preuve attendue : Synthèse distingue besoin et hypothèse. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s1-a2": {
      "title": "Hypothèses d'entreprise",
      "context": "Entretiens, alternatives et hypothèses de coûts",
      "demonstration": "Transformer une observation en hypothèse de valeur et test falsifiable.",
      "guidedWork": "Créer canvas, prioriser les inconnues et définir les tests.",
      "prompt": "Construis un canvas à partir des faits fournis, signale hypothèses de cible, valeur et coûts puis propose tests.",
      "verification": "1. Cible liée aux observations\n2. Valeur spécifique et crédible\n3. Coûts hypothétiques identifiés\n4. Hypothèses priorisées et testables. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Cible",
          "descriptor": "Preuve attendue : Cible liée aux observations. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Valeur",
          "descriptor": "Preuve attendue : Valeur spécifique et crédible. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Coûts",
          "descriptor": "Preuve attendue : Coûts hypothétiques identifiés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Testabilité",
          "descriptor": "Preuve attendue : Hypothèses priorisées et testables. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s2-a1": {
      "title": "Offre minimale",
      "context": "Problème prioritaire, capacité de livraison et coûts",
      "demonstration": "Comparer deux périmètres d'offre et leurs exclusions.",
      "guidedWork": "Rédiger fiche offre avec bénéfice, limites, prix hypothétique et conditions.",
      "prompt": "Propose deux offres minimales réalistes à partir de ces ressources. Indique exclusions, bénéfice et hypothèses de prix.",
      "verification": "1. Offre lisible sans jargon\n2. Bénéfice lié au besoin\n3. Limites et exclusions claires\n4. Prix identifié comme hypothèse. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Clarté",
          "descriptor": "Preuve attendue : Offre lisible sans jargon. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Valeur",
          "descriptor": "Preuve attendue : Bénéfice lié au besoin. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Limites",
          "descriptor": "Preuve attendue : Limites et exclusions claires. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Prix",
          "descriptor": "Preuve attendue : Prix identifié comme hypothèse. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s2-a2": {
      "title": "Prototype commercial",
      "context": "Offre et prototype de démonstration",
      "demonstration": "Montrer une démo courte et écouter une objection sans la contredire.",
      "guidedWork": "Présenter le prototype, recueillir retours consentis et modifier une partie.",
      "prompt": "Prépare une démo et des questions neutres. Analyse uniquement les objections observées et propose une itération.",
      "verification": "1. Démo montre un usage réel ou simulé déclaré\n2. Écoute sans induction\n3. Retours consentis documentés\n4. Itération liée à une objection. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Démo",
          "descriptor": "Preuve attendue : Démo montre un usage réel ou simulé déclaré. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Écoute",
          "descriptor": "Preuve attendue : Écoute sans induction. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Preuves",
          "descriptor": "Preuve attendue : Retours consentis documentés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Itération",
          "descriptor": "Preuve attendue : Itération liée à une objection. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s3-a1": {
      "title": "Coûts unitaires",
      "context": "Hypothèses de coûts et quantités, tableur",
      "demonstration": "Calculer marge unitaire et faire varier un coût.",
      "guidedWork": "Construire scénarios fixe/variable, vérifier formules et tester une hypothèse défavorable.",
      "prompt": "Propose un modèle de coûts avec formules explicites. Sépare chiffres réels et hypothèses; teste sensibilité sans inventer de données.",
      "verification": "1. Formules recalculées et exactes\n2. Hypothèses traçables\n3. Sensibilité à plusieurs variables\n4. Limites et coûts oubliés signalés. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Formules",
          "descriptor": "Preuve attendue : Formules recalculées et exactes. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Hypothèses",
          "descriptor": "Preuve attendue : Hypothèses traçables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Sensibilité",
          "descriptor": "Preuve attendue : Sensibilité à plusieurs variables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Limites",
          "descriptor": "Preuve attendue : Limites et coûts oubliés signalés. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s3-a2": {
      "title": "Tarification",
      "context": "Coûts, valeur perçue et retours de cible",
      "demonstration": "Comparer deux prix et distinguer intention d'achat et paiement.",
      "guidedWork": "Préparer grille tarifaire et test de disposition à payer, consigner retours.",
      "prompt": "Propose trois options tarifaires cohérentes avec coûts et valeur. Indique tests, objections et limites, sans prédire de revenus.",
      "verification": "1. Prix lié à valeur et périmètre\n2. Coûts et marge vérifiés\n3. Retours réels ou simulation déclarée\n4. Décision motivée et révisable. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Valeur",
          "descriptor": "Preuve attendue : Prix lié à valeur et périmètre. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Coûts",
          "descriptor": "Preuve attendue : Coûts et marge vérifiés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Retours",
          "descriptor": "Preuve attendue : Retours réels ou simulation déclarée. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Décision",
          "descriptor": "Preuve attendue : Décision motivée et révisable. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s4-a1": {
      "title": "Pipeline commercial",
      "context": "Parcours de vente et CRM sandbox",
      "demonstration": "Montrer qualification, prochaine action et refus d'un prospect.",
      "guidedWork": "Créer états et scripts, tester un contact fictif avec règle d'arrêt.",
      "prompt": "Propose un pipeline et questions de qualification respectueuses, avec consentement, suivi et arrêt.",
      "verification": "1. Étapes et critères définis\n2. Consentement et refus respectés\n3. Suivi et prochaine action clairs\n4. Historique traçable sans données inutiles. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Étapes",
          "descriptor": "Preuve attendue : Étapes et critères définis. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Consentement",
          "descriptor": "Preuve attendue : Consentement et refus respectés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Suivi",
          "descriptor": "Preuve attendue : Suivi et prochaine action clairs. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Traçabilité",
          "descriptor": "Preuve attendue : Historique traçable sans données inutiles. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s4-a2": {
      "title": "Devis et paiement test",
      "context": "Fiche offre et paiement sandbox",
      "demonstration": "Montrer devis de test, confirmation de paiement fictif et erreur.",
      "guidedWork": "Créer documents fictifs, vérifier totaux et tester succès/échec.",
      "prompt": "Prépare un devis et une facture de test à partir des conditions fournies. Signale les exigences locales à vérifier, n'initie aucun paiement réel.",
      "verification": "1. Montants et calculs vérifiés\n2. Conditions et exclusions lisibles\n3. Flux sandbox testé\n4. Obligations à vérifier explicitement. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Montants",
          "descriptor": "Preuve attendue : Montants et calculs vérifiés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Conditions",
          "descriptor": "Preuve attendue : Conditions et exclusions lisibles. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Test",
          "descriptor": "Preuve attendue : Flux sandbox testé. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Conformité à vérifier",
          "descriptor": "Preuve attendue : Obligations à vérifier explicitement. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s5-a1": {
      "title": "Onboarding client",
      "context": "Offre, guide et utilisateur volontaire",
      "demonstration": "Montrer prise en main et point de blocage d'un nouvel utilisateur.",
      "guidedWork": "Créer checklist et tester une tâche sans guidage, puis corriger.",
      "prompt": "Propose un parcours d'accueil pour ce produit avec tâches, critères de succès, accès support et alternatives accessibles.",
      "verification": "1. Étapes claires et ordonnées\n2. Guide accessible et compréhensible\n3. Accès au support explicite\n4. Test utilisateur et correction. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Clarté",
          "descriptor": "Preuve attendue : Étapes claires et ordonnées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Accessibilité",
          "descriptor": "Preuve attendue : Guide accessible et compréhensible. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Support",
          "descriptor": "Preuve attendue : Accès au support explicite. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Test",
          "descriptor": "Preuve attendue : Test utilisateur et correction. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s5-a2": {
      "title": "Support et fidélisation",
      "context": "Cas fictifs de support et règles de service",
      "demonstration": "Comparer réponse utile, escalade et demande de donnée inutile.",
      "guidedWork": "Rédiger procédure, tester trois cas dont incident et refus de divulgation.",
      "prompt": "Propose des réponses et règles d'escalade pour ces cas, sans inventer d'engagement ni exposer de données.",
      "verification": "1. Délais cibles réalistes\n2. Responsabilités et escalade définies\n3. Suivi des cas documenté\n4. Données minimales et protégées. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Délais cibles",
          "descriptor": "Preuve attendue : Délais cibles réalistes. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Responsabilités",
          "descriptor": "Preuve attendue : Responsabilités et escalade définies. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Suivi",
          "descriptor": "Preuve attendue : Suivi des cas documenté. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Confidentialité",
          "descriptor": "Preuve attendue : Données minimales et protégées. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s6-a1": {
      "title": "Plan d'acquisition",
      "context": "Public cible, canaux envisagés et plafond",
      "demonstration": "Comparer deux canaux à hypothèses explicites et budget borné.",
      "guidedWork": "Construire expérience, métrique, critères d'arrêt et responsable.",
      "prompt": "Propose deux expériences d'acquisition à partir de ce public et plafond. Sépare hypothèses de résultats observés.",
      "verification": "1. Cible et canal cohérents\n2. Budget limité et justifié\n3. Mesure et arrêt définis\n4. Risques et autorisations identifiés. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Cible",
          "descriptor": "Preuve attendue : Cible et canal cohérents. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Budget",
          "descriptor": "Preuve attendue : Budget limité et justifié. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Mesure",
          "descriptor": "Preuve attendue : Mesure et arrêt définis. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Risques",
          "descriptor": "Preuve attendue : Risques et autorisations identifiés. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s6-a2": {
      "title": "Expérience commerciale",
      "context": "Offre et interlocuteurs volontaires ou sandbox",
      "demonstration": "Montrer une présentation commerciale et noter une objection réelle.",
      "guidedWork": "Conduire essais autorisés, distinguer intérêt, devis et vente, noter limites.",
      "prompt": "Prépare un journal d'essais et analyse uniquement les retours documentés; ne transforme pas l'intérêt en revenu.",
      "verification": "1. Consentement et règles respectés\n2. Preuves des échanges anonymisées\n3. Analyse distingue intérêt et vente\n4. Décision fondée sur retours. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Consentement",
          "descriptor": "Preuve attendue : Consentement et règles respectés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Preuves",
          "descriptor": "Preuve attendue : Preuves des échanges anonymisées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Analyse",
          "descriptor": "Preuve attendue : Analyse distingue intérêt et vente. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Décision",
          "descriptor": "Preuve attendue : Décision fondée sur retours. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s7-a1": {
      "title": "Trésorerie et seuil de rentabilité",
      "context": "Coûts, revenus hypothétiques et solde initial",
      "demonstration": "Montrer différence entre chiffre d'affaires, marge et trésorerie.",
      "guidedWork": "Modéliser flux mensuels et trois scénarios, tester baisse de revenus.",
      "prompt": "Construis une prévision de trésorerie à partir de ces hypothèses avec formules explicites. Ne garantis aucun revenu.",
      "verification": "1. Formules et seuil recalculés\n2. Hypothèses identifiées\n3. Solde et flux cohérents\n4. Sensibilité et limites visibles. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Formules",
          "descriptor": "Preuve attendue : Formules et seuil recalculés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Hypothèses",
          "descriptor": "Preuve attendue : Hypothèses identifiées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Trésorerie",
          "descriptor": "Preuve attendue : Solde et flux cohérents. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Sensibilité",
          "descriptor": "Preuve attendue : Sensibilité et limites visibles. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s7-a2": {
      "title": "Risques et conformité",
      "context": "Description activité, pays et opérations envisagées",
      "demonstration": "Distinguer une obligation confirmée d'une question à vérifier.",
      "guidedWork": "Créer registre risques, sources compétentes à consulter et responsables.",
      "prompt": "À partir de ce périmètre, liste les questions juridiques, fiscales et données à vérifier auprès de sources compétentes. Ne conclus pas à la conformité.",
      "verification": "1. Périmètre et juridiction identifiés\n2. Sources officielles à vérifier listées\n3. Priorités selon impact\n4. Responsable et prochaine action. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Périmètre",
          "descriptor": "Preuve attendue : Périmètre et juridiction identifiés. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Sources à vérifier",
          "descriptor": "Preuve attendue : Sources officielles à vérifier listées. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Priorités",
          "descriptor": "Preuve attendue : Priorités selon impact. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Responsables",
          "descriptor": "Preuve attendue : Responsable et prochaine action. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s8-a1": {
      "title": "Dossier entreprise",
      "context": "Offre, tableur, CRM et journal de preuves",
      "demonstration": "Assembler les pièces et distinguer résultat observé de prévision.",
      "guidedWork": "Créer dossier versionné et plan 90 jours avec jalons et limites.",
      "prompt": "Structure le dossier à partir de ces pièces et propose un plan d'action vérifiable. Marque chiffres et hypothèses non confirmés.",
      "verification": "1. Pièces et preuves traçables\n2. Offre, coûts et opérations cohérents\n3. Plan avec actions et jalons\n4. Limites explicites. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Preuves",
          "descriptor": "Preuve attendue : Pièces et preuves traçables. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Cohérence",
          "descriptor": "Preuve attendue : Offre, coûts et opérations cohérents. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Plan",
          "descriptor": "Preuve attendue : Plan avec actions et jalons. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Limites",
          "descriptor": "Preuve attendue : Limites explicites. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    },
    "s8-a2": {
      "title": "Jury entrepreneuriat",
      "context": "Dossier, prototype, funnel et modèle financier",
      "demonstration": "Présenter une soutenance concise de la valeur à la livraison.",
      "guidedWork": "Démontrer parcours client, expliquer une hypothèse et défendre coûts et risques sans IA.",
      "prompt": "Simule un jury entrepreneur à partir de ce dossier. Interroge sur preuves, économie, risques et décisions sans promettre de ventes.",
      "verification": "1. Parcours client démontré\n2. Économie et calculs défendus\n3. Risques et éthique explicités\n4. Choix et limites expliqués. Conserver les preuves, noter les écarts et vérifier les corrections avec le formateur.",
      "rubric": [
        {
          "label": "Démo",
          "descriptor": "Preuve attendue : Parcours client démontré. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Économie",
          "descriptor": "Preuve attendue : Économie et calculs défendus. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Éthique",
          "descriptor": "Preuve attendue : Risques et éthique explicités. Le formateur vérifie la réalisation et sa justification."
        },
        {
          "label": "Défense",
          "descriptor": "Preuve attendue : Choix et limites expliqués. Le formateur vérifie la réalisation et sa justification."
        }
      ]
    }
  }
};
export function getProductionGuide(track:string,lesson:string){return productionGuides[track]?.[lesson];}
