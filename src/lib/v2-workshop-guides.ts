import "server-only";
/**
 * Instructor-authored, V2-aligned pedagogical supplements for the 16 official
 * published lessons. These do NOT replace versioned DB instructions, grant
 * enrollments, assign grades or record XP. Server-render only for enrolled users.
 */
export type V2WorkshopGuide={
  slug:string;minutes:number;brief:string;
  steps:{title:string;action:string;proof:string;verify:string}[];
  checks:string[];errors:string[];prompt:string;template:string;
};
export const v2WorkshopGuides:Record<string,V2WorkshopGuide>={
  "valider-probleme": {
    "slug": "valider-probleme",
    "minutes": 100,
    "brief": "Tu es chargé de valider un problème avant toute ligne de code. Ton produit doit répondre à un besoin observé, et non à une solution imaginée.",
    "steps": [
      {
        "title": "Formuler une hypothèse falsifiable",
        "action": "Décris la cible, la situation, la difficulté observée et la conséquence mesurable. Écris aussi ce qui pourrait invalider ton idée.",
        "proof": "Hypothèse de problème en une phrase et deux indicateurs observables.",
        "verify": "Un utilisateur concerné peut-il comprendre le problème sans entendre parler de ton application ?"
      },
      {
        "title": "Préparer l'entretien",
        "action": "Élabore cinq questions ouvertes sur les comportements passés, les alternatives actuelles et le coût de la difficulté. Évite « aimerais-tu mon produit ? ».",
        "proof": "Guide de cinq questions et invitation sollicitant le consentement.",
        "verify": "Aucune question n'induit une réponse positive ou ne suppose l'usage de ton outil."
      },
      {
        "title": "Conduire trois entretiens réels",
        "action": "Échange avec au moins trois personnes de la cible. Note des faits, exemples et citations anonymisés ; différencie constat et interprétation.",
        "proof": "Trois comptes rendus anonymisés comportant contexte et exemples vécus.",
        "verify": "Les réponses sont-elles réelles, consenties et débarrassées des identifiants personnels ?"
      },
      {
        "title": "Comparer les signaux",
        "action": "Regroupe les problèmes récurrents, les contournements et les divergences. Classe les observations selon fréquence, gravité et confiance.",
        "proof": "Tableau d'insights avec cinq enseignements et contradictions éventuelles.",
        "verify": "L'analyse cite-t-elle des observations distinctes plutôt qu'une opinion ?"
      },
      {
        "title": "Décider de la suite",
        "action": "Choisis un seul problème prioritaire, la cible principale, et la prochaine hypothèse à tester. Indique ce qui reste incertain.",
        "proof": "Note de décision « poursuivre / reformuler / arrêter » et prochaines questions.",
        "verify": "Pourrais-tu défendre cette décision devant un formateur sans inventer de chiffres ?"
      }
    ],
    "checks": [
      "Trois entretiens consentis, authentiques et anonymisés",
      "Cinq enseignements distinguant faits et hypothèses",
      "Problème et cible délimités sans proposer d'emblée une solution",
      "Décision justifiée et limites de l'échantillon explicites"
    ],
    "errors": [
      "Transformer une préférence personnelle en fait utilisateur",
      "Interviewer des proches sans vérifier leur appartenance à la cible",
      "Inventer des témoignages ou publier des données identifiantes"
    ],
    "prompt": "Agis comme un coach en recherche utilisateur. Analyse cette hypothèse de problème sans proposer directement une application. Fais-moi cinq questions ouvertes non biaisées, identifie ce qui est réfutable, puis aide-moi à distinguer faits, interprétations et inconnues. Ne fabrique jamais de réponses d'entretien.",
    "template": "# Validation du problème\nCible :\nSituation :\nProblème observé :\nHypothèse falsifiable :\n\n## Entretiens (anonymisés)\n| Personne | Contexte | Comportement passé | Difficulté | Citation consentie |\n|---|---|---|---|---|\n\n## 5 enseignements\n1.\n2.\n3.\n4.\n5.\n\n## Décision\nHypothèses confirmées :\nHypothèses infirmées :\nProchain test :"
  },
  "prd-prototype": {
    "slug": "prd-prototype",
    "minutes": 110,
    "brief": "Transforme le problème validé en une spécification courte et un prototype cliquable. Le même scénario devra fonctionner en ligne à J14.",
    "steps": [
      {
        "title": "Choisir le scénario prioritaire",
        "action": "Rédige le persona fonctionnel, le déclencheur, le bénéfice attendu et le critère de succès du parcours.",
        "proof": "Phrase « en tant que …, je peux …, afin de … ».",
        "verify": "Le scénario répond-il à l'observation prioritaire de la semaine 1 ?"
      },
      {
        "title": "Rédiger un PRD d'une page",
        "action": "Décris portée MVP, exclusions, règles métier, acteurs, données minimales et critères d'acceptation.",
        "proof": "PRD versionné avec 3 à 5 critères testables.",
        "verify": "Une personne extérieure pourrait-elle implémenter le flux sans deviner les règles ?"
      },
      {
        "title": "Dessiner le parcours",
        "action": "Trace les écrans et transitions incluant état vide, validation, chargement, échec et réussite.",
        "proof": "Schéma de parcours + cartographie des erreurs.",
        "verify": "Chaque action a-t-elle une réponse compréhensible pour l'utilisateur ?"
      },
      {
        "title": "Prototyper et faire tester",
        "action": "Réalise dans Figma ou un outil équivalent un prototype cliquable. Fais exécuter une tâche à deux personnes et note les hésitations.",
        "proof": "Lien prototype et notes anonymisées de deux tests.",
        "verify": "La personne arrive-t-elle à l'objectif sans explication pendant la tâche ?"
      },
      {
        "title": "Verrouiller la portée J14",
        "action": "Relie problème, écran, donnée et critère. Identifie le minimum qui doit être réellement déployé la semaine suivante.",
        "proof": "Matrice problème → acteur → écran → preuve + décision de portée.",
        "verify": "Le flux tient-il dans une démo réalisable en moins de 3 minutes ?"
      }
    ],
    "checks": [
      "PRD lisible, versionné et limité au MVP",
      "Prototype cliquable incluant états d'erreur",
      "Deux retours de test réels et une correction visible",
      "Matrice de traçabilité problème → fonctionnalité → preuve"
    ],
    "errors": [
      "Écrire une liste de fonctionnalités sans critère d'acceptation",
      "Oublier les écrans vides ou les erreurs",
      "Confondre une maquette cliquable avec une application réellement déployée"
    ],
    "prompt": "Joue le rôle d'un product manager exigeant. À partir de mon problème documenté, aide-moi à écrire un PRD d'une page, un parcours utilisateur de bout en bout et cinq critères d'acceptation vérifiables. Pose-moi des questions si les acteurs, erreurs ou exclusions manquent.",
    "template": "# PRD — v1\nProblème / cible :\nProposition de valeur :\nDéclencheur :\nParcours principal :\nFonctionnalités incluses :\nFonctionnalités exclues :\nDonnées strictement nécessaires :\nÉtats de chargement / erreur / succès :\n\n## Critères d'acceptation\n- [ ] Étant donné …, lorsque …, alors …\n- [ ]\n- [ ]\n\n## Tests du prototype\nPersonne A / tâche / blocage :\nPersonne B / tâche / blocage :\nDécision UX :"
  },
  "architecture-repo": {
    "slug": "architecture-repo",
    "minutes": 120,
    "brief": "Pose les fondations techniques les plus simples permettant de démontrer le flux métier au jour 14, sans empiler les technologies.",
    "steps": [
      {
        "title": "Dessiner l'architecture minimale",
        "action": "Schématise navigateur → interface → API → base. Identifie ce qui doit être sécurisé sur le serveur.",
        "proof": "Diagramme léger et légende des responsabilités.",
        "verify": "Les secrets, permissions et requêtes sensibles restent-ils côté serveur ?"
      },
      {
        "title": "Créer le dépôt reproductible",
        "action": "Initialise un dépôt GitHub, des scripts de démarrage, un README, .gitignore et un exemple d'environnement sans vrais secrets.",
        "proof": "Dépôt avec historique Git, scripts et .env.example.",
        "verify": "Un camarade peut-il lancer le projet avec le README uniquement ?"
      },
      {
        "title": "Modéliser les données",
        "action": "Écris les entités métier, identifiants, relations, contraintes et données d'exemple non personnelles.",
        "proof": "Diagramme entité-relation et première migration SQL.",
        "verify": "Les règles d'unicité et les dépendances sont-elles explicites ?"
      },
      {
        "title": "Définir les points d'entrée",
        "action": "Crée la page du scénario, la route serveur et les types d'entrée/sortie prévus. Valide les données à l'entrée.",
        "proof": "Prototype technique d'un flux interface → serveur → données.",
        "verify": "Un argument erroné est-il refusé avant toute écriture ?"
      },
      {
        "title": "Prouver la reproductibilité",
        "action": "Lance les vérifications locales et note la commande de migration, les tests et les compromis d'architecture.",
        "proof": "README « installation / migration / test / limites ».",
        "verify": "Les prérequis et l'absence de vrais secrets sont-ils vérifiables ?"
      }
    ],
    "checks": [
      "Dépôt initialisé et commandes reproductibles",
      "Migration SQL versionnée avec contraintes",
      "Schéma clair des données et responsabilités",
      "Aucun identifiant ou secret exposé dans le dépôt"
    ],
    "errors": [
      "Copier des clés API dans un commit",
      "Multiplier les microservices avant un premier flux utile",
      "Omettre la procédure de démarrage et la gestion des variables"
    ],
    "prompt": "Tu es mon reviewer d'architecture. Propose la plus petite architecture sécurisée pour mon flux principal Next.js + PostgreSQL. Challenge les dépendances inutiles et exige un README reproductible, une migration SQL et une validation serveur.",
    "template": "# Architecture v1\nScénario métier :\nActeurs :\nFlux : Navigateur → Route serveur → Base\nDonnées et contraintes :\nRoutes et droits requis :\n\n## Reproductibilité\nPrérequis :\nInstallation :\nConfiguration sans secrets :\nMigration :\nDémarrage :\nTests :\nLimites connues :"
  },
  "flux-deploye": {
    "slug": "flux-deploye",
    "minutes": 135,
    "brief": "J14 : prouve qu'une vraie personne peut accomplir la tâche principale de ton produit sur une URL en ligne, avec données persistantes.",
    "steps": [
      {
        "title": "Achever un chemin heureux",
        "action": "Relie le formulaire, les messages de validation et la persistance avec un scénario principal simple.",
        "proof": "Capture ou enregistrement de la tâche complète.",
        "verify": "L'opération reste-t-elle enregistrée après actualisation ?"
      },
      {
        "title": "Traiter les erreurs",
        "action": "Gère au moins saisie invalide, API indisponible et résultat vide. Ajoute un retour visible et une possibilité de reprise.",
        "proof": "Trois scénarios d'échec testables et leurs messages.",
        "verify": "Une erreur peut-elle survenir sans laisser l'utilisateur bloqué ?"
      },
      {
        "title": "Automatiser un contrôle",
        "action": "Écris un test automatisé du flux ou un protocole reproductible de recette bout en bout.",
        "proof": "Test ou procédure exécutée avec résultat daté.",
        "verify": "Le résultat peut-il être reproduit par une autre personne ?"
      },
      {
        "title": "Déployer prudemment",
        "action": "Configure les variables côté serveur, le build et l'hébergement ; vérifie les logs sans exposer les secrets.",
        "proof": "URL HTTPS et version Git correspondant au déploiement.",
        "verify": "La bonne version est-elle identifiable et le service accessible depuis l'extérieur ?"
      },
      {
        "title": "Tester sur smartphone",
        "action": "Rejoue le parcours sur mobile, mesure les points de friction et corrige un défaut réellement observé.",
        "proof": "Preuve mobile, résultat du test et bref compte rendu des corrections.",
        "verify": "Un utilisateur peut-il accomplir la tâche sans accéder à ton ordinateur ?"
      }
    ],
    "checks": [
      "Flux complet déployé sous URL HTTPS",
      "Persistance et validation côté serveur démontrées",
      "États d'erreur, de succès et vide vérifiés",
      "Essai mobile daté, reproductible et sans secrets"
    ],
    "errors": [
      "Ne livrer qu'une jolie landing page sans fonctionnalité",
      "Déclarer « déployé » après un simple localhost",
      "Publier des captures contenant des identifiants ou données privées"
    ],
    "prompt": "Aide-moi à préparer une recette J14 sans complaisance. Établis une matrice chemin heureux, validation erronée, panne serveur, état vide et test mobile, avec étapes et résultats attendus. Ne considère pas la page comme fonctionnelle sans preuve.",
    "template": "# Recette du flux J14\nURL HTTPS :\nCommit Git :\nScénario utilisateur :\n\n| Étape | Action | Résultat attendu | Résultat réel | OK ? |\n|---|---|---|---|---|\n| 1 | Ouvrir le flux | | | |\n| 2 | Soumettre une donnée valide | | | |\n| 3 | Recharger la page | Donnée conservée | | |\n| 4 | Soumettre une donnée invalide | Erreur compréhensible | | |\n| 5 | Refaire sur mobile | Flux utilisable | | |\n\nBlocages / correctifs :"
  },
  "crud-permissions": {
    "slug": "crud-permissions",
    "minutes": 130,
    "brief": "Passe d'un flux de démonstration à une application multiutilisateur dont les données et les actions sont correctement isolées.",
    "steps": [
      {
        "title": "Écrire la matrice des droits",
        "action": "Pour chaque rôle et opération CRUD, note ce qui est autorisé, refusé et réservé à l'administrateur.",
        "proof": "Matrice rôles × ressources × opérations.",
        "verify": "Aucune case ne repose uniquement sur le masquage d'un bouton ?"
      },
      {
        "title": "Implémenter les opérations",
        "action": "Crée, liste, modifie et supprime uniquement les ressources appartenant au bon utilisateur, avec validations et contrôles serveur.",
        "proof": "Routes opérationnelles et exemples fictifs.",
        "verify": "Le serveur décide-t-il de l'identité plutôt que de faire confiance au client ?"
      },
      {
        "title": "Tester deux comptes",
        "action": "Crée deux comptes de test non personnels. Tente la lecture et la modification croisée des données.",
        "proof": "Journal tests utilisateur A / utilisateur B.",
        "verify": "La modification d'identifiant dans une URL suffit-elle à obtenir un accès interdit ? (elle ne doit pas)"
      },
      {
        "title": "Tester les règles SQL",
        "action": "Vérifie RLS, contraintes, transactions et absence d'écritures directes interdites selon l'architecture.",
        "proof": "Tests de refus et revue des privilèges.",
        "verify": "Les droits subsistent-ils même si l'interface est contournée ?"
      },
      {
        "title": "Corriger et documenter",
        "action": "Répare au moins un défaut observé et ajoute un test pour éviter sa réapparition.",
        "proof": "Code, test de régression et note de sécurité.",
        "verify": "La défaillance serait-elle détectée lors du prochain déploiement ?"
      }
    ],
    "checks": [
      "Matrice CRUD et rôles claire",
      "Deux comptes distincts testés sans fuite croisée",
      "Validations serveur et SQL paramétré",
      "Au moins un test de régression négatif reproductible"
    ],
    "errors": [
      "Faire confiance au userId envoyé dans le formulaire",
      "Tester seulement avec un compte administrateur",
      "Supposer que cacher un bouton constitue une autorisation"
    ],
    "prompt": "Audite mon modèle d'autorisation comme un ingénieur sécurité. Demande-moi la matrice CRUD puis prépare des tests négatifs avec deux comptes fictifs. Ne propose aucune attaque contre des comptes tiers ou la production.",
    "template": "# Contrôle d'accès CRUD\nRôles :\nRessources :\n\n| Rôle | Créer | Lire | Modifier | Supprimer |\n|---|---|---|---|---|\n| Apprenant A | | | | |\n| Apprenant B | | | | |\n| Formateur | | | | |\n\n## Tests négatifs\nAction :\nIdentité :\nRésultat attendu : accès refusé\nRésultat observé :\nCorrectif / test ajouté :"
  },
  "tests-accessibilite": {
    "slug": "tests-accessibilite",
    "minutes": 115,
    "brief": "Ta démonstration doit fonctionner avec le clavier, sur téléphone et lorsque les données sont absentes ou que le réseau échoue.",
    "steps": [
      {
        "title": "Définir les cas critiques",
        "action": "Liste les parcours de succès, les validations invalides, l'absence de résultats et l'indisponibilité du serveur.",
        "proof": "Tableau de scénarios avec résultat attendu.",
        "verify": "Le scénario sans réseau est-il traité de manière compréhensible ?"
      },
      {
        "title": "Écrire des tests",
        "action": "Ajoute des tests de validation et des assertions sur les erreurs et états vides, puis exécute-les.",
        "proof": "Commandes et résultats de la suite de tests.",
        "verify": "Une régression dans le flux principal ferait-elle échouer le contrôle ?"
      },
      {
        "title": "Auditer le clavier",
        "action": "Navigue au clavier seul ; vérifie focus visible, ordre, libellés, annonces d'erreur et utilisation d'un lecteur d'écran si possible.",
        "proof": "Checklist de navigation et trois anomalies observées.",
        "verify": "Chaque action interactive est-elle accessible sans souris ?"
      },
      {
        "title": "Tester le mobile et les contrastes",
        "action": "Vérifie différentes largeurs, tailles de texte, contraste et zones cliquables, puis corrige les éléments gênants.",
        "proof": "Captures avant/après anonymisées sur téléphone.",
        "verify": "Un utilisateur peut-il soumettre le formulaire à 320–375 px de large ?"
      },
      {
        "title": "Prouver trois corrections",
        "action": "Priorise, corrige et vérifie au moins trois défauts réels ; consigne les résultats des retests.",
        "proof": "Journal de trois améliorations vérifiées avec tests ou captures.",
        "verify": "Les correctifs sont-ils présents dans la version déployée ?"
      }
    ],
    "checks": [
      "Scénarios critiques exécutés et documentés",
      "Navigation au clavier fonctionnelle et focus visible",
      "Interface réellement utilisable sur mobile",
      "Trois corrections vérifiées avec preuve avant/après"
    ],
    "errors": [
      "Vérifier uniquement l'affichage desktop",
      "Masquer les erreurs dans la console",
      "Déclarer conforme sans test de focus ni de formulaire"
    ],
    "prompt": "Aide-moi à mener un audit UX et accessibilité de mon flux. Construis une checklist testable clavier, erreurs, mobile, contraste et état vide, puis priorise trois défauts observables. N'affirme pas une conformité non testée.",
    "template": "# Recette qualité et accessibilité\nVersion déployée :\nAppareil / navigateur :\n\n| Cas | Résultat attendu | Observé | Correction | Retest |\n|---|---|---|---|---|\n| Clavier | | | | |\n| Focus | | | | |\n| Erreur formulaire | | | | |\n| Données absentes | | | | |\n| Mobile | | | | |\n\n3 correctifs livrés :"
  },
  "livraison-observable": {
    "slug": "livraison-observable",
    "minutes": 125,
    "brief": "À la fin du premier mois, l'utilisateur doit disposer d'un MVP stable, exploitable et déployé par un processus vérifiable.",
    "steps": [
      {
        "title": "Établir les conditions de livraison",
        "action": "Fixe environnement, version, contrôle sanitaire, critères de réussite et personne responsable.",
        "proof": "Checklist de mise en production MVP.",
        "verify": "Un échec bloque-t-il le déploiement plutôt que de laisser une version incohérente ?"
      },
      {
        "title": "Mettre de l'observabilité",
        "action": "Configure logs utiles sans secrets ni données personnelles, erreurs structurées et route de santé.",
        "proof": "Exemple anonymisé de log et test de la route de santé.",
        "verify": "Peux-tu diagnostiquer une panne sans afficher un mot de passe ?"
      },
      {
        "title": "Préparer un retour arrière",
        "action": "Documente la sauvegarde, restauration sur environnement isolé, variables et procédure de rollback.",
        "proof": "Runbook de déploiement et retour arrière.",
        "verify": "Une mauvaise release peut-elle être annulée sans perte inattendue ?"
      },
      {
        "title": "Exécuter la recette MVP",
        "action": "Teste inscription/connexion si présentes, flux principal, permissions, mobile et données enregistrées.",
        "proof": "Résultats de recette datés avec URL et commit.",
        "verify": "Les vérifications couvrent-elles une action utilisateur complète ?"
      },
      {
        "title": "Publier et mesurer",
        "action": "Livre une version identifiable, observe au moins une mesure réelle et consigne les problèmes ouverts.",
        "proof": "Lien du MVP, checklist signée, capture de supervision anonymisée.",
        "verify": "Le produit a-t-il été réellement livré, plutôt qu'uniquement compilé ?"
      }
    ],
    "checks": [
      "MVP accessible sur HTTPS avec commit identifié",
      "Procédure de livraison et rollback reproductible",
      "Logs et contrôles sanitaires sans informations sensibles",
      "Recette fonctionnelle datée et anomalies restantes documentées"
    ],
    "errors": [
      "Enregistrer des cookies ou identifiants dans les logs",
      "Absence de plan de restauration testé",
      "Confondre résultat CI vert et validation métier sur le produit"
    ],
    "prompt": "Agis comme responsable release. Construis un plan go/no-go pour mon MVP : version, santé, sauvegarde isolée, migrations, sécurité, flux mobile et rollback. Sépare les preuves déjà obtenues des éléments encore à vérifier.",
    "template": "# Livraison MVP — go/no-go\nURL / commit :\nDate / responsable :\n\n## Préparation\n- [ ] Sauvegarde vérifiée\n- [ ] Plan de rollback\n- [ ] Secrets masqués\n- [ ] Route santé\n- [ ] Migrations contrôlées\n\n## Recette\nParcours heureux :\nÉchecs contrôlés :\nMobile :\nLogs anonymisés :\n\nDécision et réserves :"
  },
  "retours-utilisateurs": {
    "slug": "retours-utilisateurs",
    "minutes": 110,
    "brief": "Un MVP n'est utile que si des personnes de la cible réussissent une tâche réelle. Mesure et corrige plutôt que collectionner des compliments.",
    "steps": [
      {
        "title": "Choisir une tâche observable",
        "action": "Définis la tâche, son résultat attendu, le temps indicatif et les critères de réussite sans guider la personne.",
        "proof": "Protocole d'observation d'une page.",
        "verify": "La tâche peut-elle échouer objectivement ?"
      },
      {
        "title": "Recruter trois testeurs",
        "action": "Fais tester au moins trois personnes de la cible avec consentement et notes anonymisées.",
        "proof": "Trois sessions datées avec contexte non identifiant.",
        "verify": "Les testeurs représentent-ils une partie pertinente de la cible ?"
      },
      {
        "title": "Observer sans influencer",
        "action": "Note succès, abandon, clics hésitants, erreurs et verbatims consentis, sans aider pendant la tâche.",
        "proof": "Tableau observations factuelles et hypothèses séparées.",
        "verify": "La réussite est-elle mesurée et non supposée ?"
      },
      {
        "title": "Prioriser les défauts",
        "action": "Regroupe les frictions et les classe selon fréquence, gravité et effort ; choisis la dominante.",
        "proof": "Backlog avec au moins trois entrées justifiées.",
        "verify": "La priorité découle-t-elle des observations plutôt que d'une préférence ?"
      },
      {
        "title": "Corriger et retester",
        "action": "Livrer au moins une amélioration et refaire la tâche avec un protocole similaire.",
        "proof": "Commit, URL corrigée, mesure avant/après et limites.",
        "verify": "L'amélioration a-t-elle été vérifiée avec une vraie interaction ?"
      }
    ],
    "checks": [
      "Trois essais réels, consentis et anonymisés",
      "Mesure objective de réussite et de friction",
      "Backlog priorisé à partir des observations",
      "Correctif déployé avec un retest comparable"
    ],
    "errors": [
      "Guider le testeur vers le bon bouton",
      "Omettre les résultats négatifs",
      "Confondre une suggestion de fonctionnalité avec une friction bloquante"
    ],
    "prompt": "Joue le rôle d'un chercheur UX. Prépare un script de test de tâche sans guider le participant, une grille d'observation et une méthode de priorisation. Exige des mesures réelles, aucune donnée personnelle et aucune citation inventée.",
    "template": "# Tests utilisateur du MVP\nTâche :\nRéussite observable si :\n\n| Session | Profil anonymisé | Succès ? | Temps | Frictions | Commentaire |\n|---|---|---|---|---|---|\n| A | | | | | |\n| B | | | | | |\n| C | | | | | |\n\n## Décisions\nFriction dominante :\nCorrectif déployé / commit :\nRetest et limites :"
  },
  "offre-marche": {
    "slug": "offre-marche",
    "minutes": 120,
    "brief": "Définis une proposition commerciale testable sans promettre de revenus ni inventer de prospects.",
    "steps": [
      {
        "title": "Délimiter le segment",
        "action": "Écris industrie, persona acheteur, situation, pouvoir de décision et alternative actuelle.",
        "proof": "Fiche cible et critères d'exclusion.",
        "verify": "Le segment est-il assez précis pour identifier dix interlocuteurs pertinents ?"
      },
      {
        "title": "Formuler trois offres",
        "action": "Compare bénéfice concret, preuve, différenciation, coût pour le client et résultat vérifiable.",
        "proof": "Trois propositions de valeur avec hypothèses explicites.",
        "verify": "Chaque promesse pourrait-elle être vérifiée dans le produit ?"
      },
      {
        "title": "Préparer les conversations",
        "action": "Rédige questions sur douleur, solution actuelle, impact et modalités d'achat, sans pousser une vente artificielle.",
        "proof": "Trame d'échange et registre de consentement.",
        "verify": "Les questions cherchent-elles la réalité plutôt qu'une approbation ?"
      },
      {
        "title": "Mener dix conversations",
        "action": "Échange avec dix prospects ou décideurs pertinents, anonymise les observations et documente objections et signaux faibles.",
        "proof": "Tableau de dix échanges anonymisés avec faits et inconnues.",
        "verify": "Les dix échanges sont-ils réels et distingués d'un entraînement IA ?"
      },
      {
        "title": "Choisir une offre testable",
        "action": "Classe les hypothèses de prix et l'argumentaire selon les réponses, et note ce qui doit encore être testé.",
        "proof": "Offre retenue, hypothèses de prix et décisions argumentées.",
        "verify": "Tu n'as ni fabriqué des intentions d'achat ni promis un chiffre d'affaires ?"
      }
    ],
    "checks": [
      "Segment et persona acheteur précis",
      "Dix conversations véridiques et anonymisées",
      "Offre fondée sur bénéfice et preuve",
      "Hypothèses tarifaires explicites, sans chiffre d'affaires garanti"
    ],
    "errors": [
      "Présenter des réponses simulées comme des prospects réels",
      "Mesurer des likes au lieu de besoins",
      "Affirmer un marché sans vérifier les objections"
    ],
    "prompt": "Examine mon positionnement sans complaisance. Propose trois formulations, cinq questions de découverte et une grille d'analyse de dix conversations réelles. Sépare les signaux observés des hypothèses. Ne promets pas de ventes.",
    "template": "# Fiche offre et marché\nCible / décideur :\nProblème prioritaire :\nAlternative actuelle :\nBénéfice prouvable :\nHypothèse de prix :\n\n## Conversations anonymisées\n| # | Profil | Problème cité | Objection | Signal observé | Suite |\n|---|---|---|---|---|---|\n\nDécision et inconnues :"
  },
  "landing-analytics": {
    "slug": "landing-analytics",
    "minutes": 125,
    "brief": "Construis une page d'offre qui aide la personne à comprendre et à demander une démonstration, puis mesure sans traçage intrusif.",
    "steps": [
      {
        "title": "Écrire une promesse spécifique",
        "action": "Rédige titre, public cible, résultat, preuve et objections ; évite les superlatifs non démontrés.",
        "proof": "Structure éditoriale de la landing page.",
        "verify": "Le bénéfice est-il compréhensible sans vocabulaire technique ?"
      },
      {
        "title": "Dessiner le chemin de conversion",
        "action": "Choisis un CTA principal, une confirmation de demande, un écran mobile et un état d'erreur.",
        "proof": "Parcours visite → intérêt → demande → confirmation.",
        "verify": "L'utilisateur sait-il ce qui se passera après le clic ?"
      },
      {
        "title": "Implémenter la page",
        "action": "Ajoute titres accessibles, exemples honnêtes, contenu responsable, formulaires validés et politique de confidentialité adaptée.",
        "proof": "Page HTTPS responsive et formulaire fonctionnel.",
        "verify": "Aucune donnée personnelle n'est collectée sans finalité ni information ?"
      },
      {
        "title": "Mesurer le strict nécessaire",
        "action": "Définis événements utiles (vue, clic CTA, demande validée), avec données agrégées et respect du consentement applicable.",
        "proof": "Plan d'événements et tableau de mesures.",
        "verify": "Peux-tu calculer un taux sans identifier individuellement les visiteurs ?"
      },
      {
        "title": "Tester et interpréter",
        "action": "Fais un test sur mobile et rapporte les premiers volumes réels ; si l'échantillon est faible, signale cette limite.",
        "proof": "URL, captures, résultats datés et une amélioration proposée.",
        "verify": "Les événements fonctionnent-ils et les chiffres sont-ils honnêtes ?"
      }
    ],
    "checks": [
      "Landing claire et mobile sous HTTPS",
      "Demande de démo fonctionnelle et erreurs comprises",
      "Événements définis sans suivi intrusif",
      "Mesures réelles, limites et calcul de conversion documentés"
    ],
    "errors": [
      "Mettre plusieurs CTA concurrents sans hiérarchie",
      "Compter des clics fictifs comme de vrais leads",
      "Activer un suivi personnel sans consentement ou information"
    ],
    "prompt": "Tu es mon mentor en conversion responsable. Audite une landing page sur la clarté, un CTA principal, l'accessibilité, les états d'erreur et un plan d'événements agrégés. Refuse tout chiffre inventé et signale les limites d'échantillon.",
    "template": "# Landing + analytics\nURL / commit :\nCible :\nPromesse :\nCTA principal :\nRéponse après CTA :\n\n## Événements\n| Événement | Définition | Donnée minimale | Résultat réel |\n|---|---|---|---|\n| Page vue | | | |\n| CTA cliqué | | | |\n| Demande validée | | | |\n\nTaux de conversion (si mesurable) :\nLimites :"
  },
  "canal-acquisition": {
    "slug": "canal-acquisition",
    "minutes": 120,
    "brief": "Tester un seul canal à petite échelle permet de comprendre l'acquisition sans brûler le budget ni spammer.",
    "steps": [
      {
        "title": "Poser l'hypothèse",
        "action": "Définis segment, message, canal choisi, fenêtre de test et indicateur primaire.",
        "proof": "Hypothèse de canal et critère d'arrêt.",
        "verify": "Sauras-tu conclure même si aucun prospect ne répond ?"
      },
      {
        "title": "Définir budget et garde-fous",
        "action": "Fixe une limite de temps/argent et des règles de respect des utilisateurs ; aucune publicité lancée sans accord du formateur.",
        "proof": "Budget maximal et check d'approbation.",
        "verify": "Le test peut-il s'arrêter sans dette ou automatisation non maîtrisée ?"
      },
      {
        "title": "Créer deux messages",
        "action": "Prépare deux variantes honnêtes, vérifie les affirmations, les droits d'image et l'usage transparent de contenus IA.",
        "proof": "Deux créations avec leurs variantes et hypothèses.",
        "verify": "Les visuels et chiffres sont-ils vérifiables et autorisés ?"
      },
      {
        "title": "Déployer le test",
        "action": "Publie les contenus réellement autorisés ou exécute la campagne validée ; trace les liens sans suivi intrusif.",
        "proof": "URLs des publications et journal d'exécution.",
        "verify": "Peux-tu prouver quand, où et avec quelle autorisation le message a été diffusé ?"
      },
      {
        "title": "Analyser et itérer",
        "action": "Relève portée, clics, demandes, coût et objections selon les données disponibles ; propose une modification.",
        "proof": "Tableau de résultats et décision continuer/arrêter.",
        "verify": "Les indicateurs mesurent-ils le canal et non des résultats inventés ?"
      }
    ],
    "checks": [
      "Hypothèse et objectif testables",
      "Coût et durée plafonnés, diffusion autorisée",
      "Publications réelles et variantes documentées",
      "Analyse des indicateurs réels et décision d'itération"
    ],
    "errors": [
      "Diffuser automatiquement à des inconnus sans consentement",
      "Augmenter une dépense sans limite validée",
      "Utiliser des métriques simulées comme preuve d'acquisition"
    ],
    "prompt": "Agis comme analyste d'acquisition responsable. Aide-moi à tester un canal avec un budget plafonné, deux messages et des KPIs réels. Exige l'autorisation avant une dépense, refuse le spam et sépare simulation et exécution.",
    "template": "# Expérience acquisition\nCible :\nCanal :\nHypothèse :\nDurée :\nBudget maximal approuvé :\nCritère d'arrêt :\n\n| Création | Publication réelle | Portée | Clics | Demandes | Coût |\n|---|---|---|---|---|---|\n| A | | | | | |\n| B | | | | | |\n\nDécision et apprentissage :"
  },
  "crm-suivi": {
    "slug": "crm-suivi",
    "minutes": 115,
    "brief": "Construis un pipeline de suivi qui rend les démonstrations et les prochaines actions visibles, sans relances intempestives.",
    "steps": [
      {
        "title": "Définir le pipeline",
        "action": "Choisis des étapes prospect → contact → démo → décision, des critères de passage et un responsable.",
        "proof": "Schéma CRM et définitions de statuts.",
        "verify": "Chaque prospect est-il dans un état clair, sans étape inventée ?"
      },
      {
        "title": "Concevoir les données minimales",
        "action": "Limite les champs au nécessaire, documente finalité, durée de conservation et accès autorisés.",
        "proof": "Schéma et matrice de permissions du CRM.",
        "verify": "Les identifiants personnels sont-ils accessibles uniquement aux personnes habilitées ?"
      },
      {
        "title": "Implémenter les actions",
        "action": "Crée une fiche fictive, ajoute une note de rencontre, fais évoluer l'état et programme une relance manuelle.",
        "proof": "Démonstration de création, mise à jour et historique.",
        "verify": "Le système conserve-t-il la chronologie sans envoyer de message à l'insu de l'utilisateur ?"
      },
      {
        "title": "Réaliser des démos consenties",
        "action": "Présente le produit à de vrais prospects volontaires ; note faits, objections et prochaines étapes sans données sensibles dans le rendu.",
        "proof": "Journal anonymisé de démos effectivement réalisées.",
        "verify": "Chaque rendez-vous est-il réel, sans métrique fabriquée ?"
      },
      {
        "title": "Calculer le passage",
        "action": "Compte les passages par étape sur une période définie et les pertes, puis recommande une amélioration.",
        "proof": "Tableau de conversion par étape et conclusion prudente.",
        "verify": "Les dénominateurs et faibles échantillons sont-ils explicités ?"
      }
    ],
    "checks": [
      "Pipeline défini et démontré",
      "Données minimisées et droits documentés",
      "Relances non envoyées automatiquement sans autorisation",
      "Taux calculés sur observations réelles et anonymisées"
    ],
    "errors": [
      "Utiliser un tableur exposant les coordonnées de prospects",
      "Automatiser des relances sans consentement ni vérification",
      "Mélanger démos simulées et rendez-vous réels"
    ],
    "prompt": "Agis comme expert CRM responsable. Conçois un pipeline minimal avec stades et critères de passage, en explicitant la confidentialité, le consentement et des indicateurs calculables. Aucune relance ne doit être envoyée automatiquement.",
    "template": "# Pipeline CRM\nÉtapes et conditions de passage :\nChamps strictement nécessaires :\nDurée et finalité de conservation :\n\n| Prospect anonymisé | Stade | Source autorisée | Dernier échange | Prochaine action |\n|---|---|---|---|---|\n\n## Mesures agrégées\nEntrées :\nDémos :\nDécisions :\nLimites :"
  },
  "prix-facturation": {
    "slug": "prix-facturation",
    "minutes": 120,
    "brief": "Une offre crédible expose la valeur, les coûts et un processus de facturation testable, sans prélèvement réel non autorisé.",
    "steps": [
      {
        "title": "Estimer les coûts",
        "action": "Répertorie infrastructure, support, acquisition, temps et frais variables. Marque les inconnues.",
        "proof": "Tableau de coût mensuel avec hypothèses.",
        "verify": "Les coûts de support et d'exploitation sont-ils pris en compte ?"
      },
      {
        "title": "Comparer trois tarifications",
        "action": "Évalue fixe, abonnement et usage selon valeur client, marge, risque et fréquence.",
        "proof": "Tableau comparatif de trois prix hypothétiques.",
        "verify": "Le modèle reste-t-il viable sous une demande raisonnablement faible ?"
      },
      {
        "title": "Créer une grille claire",
        "action": "Définis ce qui est inclus, limites, support, fréquence et conditions de sortie.",
        "proof": "Fiche tarifaire testable sans promesse abusive.",
        "verify": "Un prospect comprend-il exactement ce qu'il achète ?"
      },
      {
        "title": "Préparer la facturation test",
        "action": "Produis une facture de démonstration avec identifiants fictifs et processus de paiement en sandbox, sans débit réel.",
        "proof": "Facture factice et captures de mode test anonymisées.",
        "verify": "Un paiement de test est-il clairement distinct d'un encaissement réel ?"
      },
      {
        "title": "Contrôler la conformité locale",
        "action": "Note les questions de fiscalité, mentions de facture, protection des données et conditions commerciales à confirmer auprès d'un professionnel compétent.",
        "proof": "Note de conformité, sources et points à faire valider.",
        "verify": "Aucune hypothèse juridique locale n'est présentée comme une certification ?"
      }
    ],
    "checks": [
      "Trois options tarifaires chiffrées à partir d'hypothèses",
      "Coûts et marges explicités",
      "Facture de test sans débit réel",
      "Questions de conformité locale identifiées et à confirmer"
    ],
    "errors": [
      "Affirmer un prix rentable sans calculer les coûts",
      "Tester avec de vraies coordonnées ou carte bancaire",
      "Présenter des conseils génériques comme avis juridique définitif"
    ],
    "prompt": "Tu es mon analyste pricing. Challenge trois modèles de tarification sur coûts, valeur, support et risque ; prépare un scénario de facturation 100 % fictif et une liste de conformité à faire vérifier localement.",
    "template": "# Prix et facturation\nCoût fixe mensuel :\nCoût variable / client :\nHypothèses de volume :\n\n| Modèle | Prix hypothétique | Coût | Risque | Pour qui |\n|---|---|---|---|---|\n| Forfait | | | | |\n| Abonnement | | | | |\n| Usage | | | | |\n\n## Facture de test\nClient fictif :\nProduit / quantité :\nTaxes à vérifier :\nMention MODE TEST :\n\nQuestions légales à valider :"
  },
  "essais-vente": {
    "slug": "essais-vente",
    "minutes": 110,
    "brief": "Apprends de vrais échanges de vente sans transformer des conversations simulées en résultats commerciaux.",
    "steps": [
      {
        "title": "Préparer une démo courte",
        "action": "Structure contexte client → problème → scénario réel → résultat → prochaine action.",
        "proof": "Script de démonstration de 5 minutes.",
        "verify": "Le produit démontré fonctionne-t-il réellement sur une URL accessible ?"
      },
      {
        "title": "Préparer les objections",
        "action": "Liste au moins cinq objections plausibles et réponds par faits, limites et prochaine vérification.",
        "proof": "FAQ objections et preuves correspondantes.",
        "verify": "Une objection reçoit-elle une réponse factuelle et non une promesse impossible ?"
      },
      {
        "title": "Réaliser des essais consentis",
        "action": "Présente le produit à des personnes volontaires et note questions, blocages, signaux et suites convenues.",
        "proof": "Journal anonymisé d'échanges réels.",
        "verify": "Les séances d'entraînement avec l'IA sont-elles clairement exclues des chiffres de vente ?"
      },
      {
        "title": "Analyser les objections",
        "action": "Regroupe les objections par valeur, prix, confiance, sécurité et intégration ; classe les freins principaux.",
        "proof": "Matrice d'objections avec fréquence et importance.",
        "verify": "Les freins dominants correspondent-ils à des échanges réels ?"
      },
      {
        "title": "Améliorer l'offre",
        "action": "Révise une partie de la démonstration, du prix ou du message et documente l'effet observé.",
        "proof": "Deux versions de l'argumentaire et justification.",
        "verify": "Les itérations répondent-elles aux objections plutôt qu'à l'intuition ?"
      }
    ],
    "checks": [
      "Démonstration produit de cinq minutes reproductible",
      "Objections réelles anonymisées et réponse étayée",
      "Différence claire entre simulation et vente réelle",
      "Révision justifiée de la proposition commerciale"
    ],
    "errors": [
      "Inventer des contrats ou des intentions d'achat",
      "Réciter une démo sans montrer le produit",
      "Ignorer les objections techniques ou de confiance"
    ],
    "prompt": "Joue le rôle d'un prospect sceptique mais réaliste. Challenge ma démonstration sur valeur, prix, sécurité, intégration et ROI. Après le jeu de rôle, rappelle-moi que ce dialogue simulé ne compte pas comme une vraie vente.",
    "template": "# Journal de démonstration\nProduit / URL :\nPublic cible :\nScénario montré :\n\n| Démo réelle | Objection anonymisée | Réponse et preuve | Prochaine action |\n|---|---|---|---|\n\n## Argumentaire\nAvant :\nAprès :\nÉlément observé qui motive le changement :"
  },
  "fiabilite-runbook": {
    "slug": "fiabilite-runbook",
    "minutes": 135,
    "brief": "Rends ton produit exploitable après une erreur de déploiement ou une panne, avec des preuves de restauration effectuée hors production.",
    "steps": [
      {
        "title": "Identifier les défaillances",
        "action": "Liste risques de base, secrets, réseau, stockage, dépendances, logs et erreurs humaines.",
        "proof": "Registre de risques classés par probabilité/impact.",
        "verify": "Les incidents les plus critiques ont-ils une mesure préventive ?"
      },
      {
        "title": "Écrire le runbook",
        "action": "Documente surveillance, accès, sauvegarde, vérification des sauvegardes, contacts et procédure d'escalade.",
        "proof": "Runbook versionné en dépôt, sans secrets.",
        "verify": "Une personne autorisée pourrait-elle agir sans deviner les étapes ?"
      },
      {
        "title": "Tester la restauration isolée",
        "action": "Restaure une copie de sauvegarde dans un environnement de test sans toucher à la base production.",
        "proof": "Journal d'essai restauration, checks d'intégrité et temps mesuré.",
        "verify": "La procédure a-t-elle réellement été exécutée sans modifier la production ?"
      },
      {
        "title": "Diagnostiquer la performance",
        "action": "Mesure un trajet utilisateur, identifie un goulet confirmé et compare avant/après correction.",
        "proof": "Mesures reproductibles et capture de monitoring anonymisée.",
        "verify": "Les gains mesurés concernent-ils le même scénario et le même environnement ?"
      },
      {
        "title": "Estimer l'exploitation",
        "action": "Compte ressources, stockage, maintenance, coût de sauvegarde et dépendances ; ajoute les limites connues.",
        "proof": "Budget mensuel et seuils d'alerte documentés.",
        "verify": "Le produit reste-t-il maintenable par une autre personne ?"
      }
    ],
    "checks": [
      "Runbook opérationnel versionné et sans secrets",
      "Restauration testée hors production avec preuve",
      "Mesure de performance avant/après comparable",
      "Coûts et risques d'exploitation estimés avec limites"
    ],
    "errors": [
      "Tester une restauration directement sur la base active",
      "Mettre les mots de passe dans le runbook",
      "Conclure à un gain de performance sans même scénario de mesure"
    ],
    "prompt": "Agis comme SRE et réviseur d'incident. Transforme mon architecture en runbook concret : sauvegarde/restauration isolée, déploiement, rollback, santé, journaux sans données sensibles, alerte et mesures comparables. Ne lance aucune action destructive.",
    "template": "# Runbook produit\nService / URL :\nDépôt / version :\nResponsable :\n\n## Santé et diagnostic\nRoute de santé :\nLogs anonymisés :\nAlertes et seuils :\n\n## Sauvegarde\nFréquence et rétention :\nTest de restauration isolée / résultat :\nRetour arrière :\n\n## Performance\nScénario mesuré :\nAvant :\nAprès :\nCoûts mensuels estimés :"
  },
  "jury-portfolio": {
    "slug": "jury-portfolio",
    "minutes": 120,
    "brief": "Le jury doit pouvoir suivre ton produit de l'observation initiale jusqu'au déploiement et aux apprentissages commerciaux sans chiffres inventés.",
    "steps": [
      {
        "title": "Structurer l'histoire",
        "action": "Organise problème, cible, preuve utilisateur, choix MVP, version en ligne, tests, commercialisation et limites.",
        "proof": "Plan de présentation de cinq minutes.",
        "verify": "Chaque affirmation majeure dispose-t-elle d'une preuve présentable ?"
      },
      {
        "title": "Préparer la démonstration",
        "action": "Choisis un scénario qui fonctionne et un plan B pour réseau ou service indisponible ; répète en conditions réelles.",
        "proof": "Script 5 minutes, URL et vidéo de secours si autorisée.",
        "verify": "Le scénario est-il exécutable en direct par un autre compte de test ?"
      },
      {
        "title": "Expliquer les choix",
        "action": "Expose architecture, permissions, compromis, tests, bugs corrigés, sauvegarde et coût estimé.",
        "proof": "Diagramme, dépôt, tests et décision technique.",
        "verify": "Peux-tu justifier une décision sans réciter un outil ?"
      },
      {
        "title": "Présenter les signaux de marché",
        "action": "Montre des observations anonymisées, mesures d'acquisition ou retours réels, et indique les absences de preuve.",
        "proof": "Tableau de résultats mesurés et inconnues.",
        "verify": "Les chiffres commerciaux sont-ils explicitement distingués des simulations ?"
      },
      {
        "title": "Répéter la soutenance",
        "action": "Effectue une répétition chronométrée, recueille des questions critiques et réécris les passages imprécis.",
        "proof": "Portfolio final et liste des objections du jury.",
        "verify": "Les preuves tiennent-elles dans le temps imparti et respectent-elles la confidentialité ?"
      }
    ],
    "checks": [
      "Lien produit en ligne, dépôt et tests consultables",
      "Narration claire du problème à la solution",
      "Choix de sécurité/architecture justifiés",
      "Résultats réels et limites honnêtement expliqués"
    ],
    "errors": [
      "Utiliser des métriques inventées pour impressionner",
      "Présenter une maquette à la place d'un flux fonctionnel",
      "Montrer des secrets ou données personnelles lors de la démo"
    ],
    "prompt": "Simule un jury critique pendant cinq minutes. Interroge-moi sur la preuve du problème, le flux réellement déployé, la sécurité, les tests, les coûts et l'impact commercial. N'accepte aucune affirmation non documentée.",
    "template": "# Portfolio produit 360\nURL de démo :\nDépôt / commit :\nProblème / public :\nEntretiens et preuves anonymisées :\nPrototype :\nFlux métier :\nTests / sécurité :\nDéploiement / runbook :\nRésultats commerciaux observés :\nLimites :\n\n## Pitch (5 min)\n0–1 min — Problème :\n1–2 min — Démo :\n2–3 min — Choix techniques :\n3–4 min — Tests et signaux :\n4–5 min — Prochaines étapes :"
  }
};
export const v2WorkshopGuideCount=Object.keys(v2WorkshopGuides).length;
