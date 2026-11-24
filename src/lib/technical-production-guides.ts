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
  }
};
export function getProductionGuide(track:string,lesson:string){return productionGuides[track]?.[lesson];}
