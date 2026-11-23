# V2 — Suivi pédagogique et historique séparé

La page apprenant `/espace/apprenant?onglet=progression` présente d'abord le parcours **Ingénierie produit et IA** : progression par semaine basée sur les leçons publiées, décompte des ateliers validés, soumissions en correction, demandes de modification et XP V2 attribués par le serveur. Les quatre dernières tentatives et commentaires du formateur sont affichés pour le seul utilisateur connecté.

Les tentatives d'un atelier sont regroupées par clé `module_id + lesson_slug` afin qu'une révision de version pédagogique ne double pas le compteur. Le nombre de leçons uniques devient le dénominateur des progrès. Les récompenses V1 restent séparées derrière un en-tête explicite. Sans inscription active ou terminée, les données privées ne sont pas affichées ; l'accès au programme reste possible.

La page formateur `/espace/formateur?onglet=evaluations` affiche d'abord les statistiques anonymisées et les dix dernières corrections V2, issues de l'API `evaluation-overview` avec session formateur obligatoire. Les missions et corrections V1 restent sous « Historique V1 », sans aucun changement de leurs écritures. En cas de panne API, un état d'indisponibilité est affiché ; aucun compteur n'est inventé.

Les modifications portent sur la présentation et des lectures sécurisées ; aucune inscription, notation, soumission ou attribution de XP n'est effectuée.
