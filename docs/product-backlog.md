# Mon backlog — Product Workspace
Tableau privé par apprenant et parcours, avec quatre colonnes, quatre priorités, titre, description, critère d'acceptation, atelier facultatif, échéance personnelle, estimation de charge et filtres. Maximum 80 tâches. Les tâches sont éditées dans un brouillon puis enregistrées explicitement; export JSON, révision indépendante du dossier produit et conflit non destructif. Les échéances dépassées concernent les tâches déclarées, pas les retards pédagogiques. Les minutes sont des estimations, pas du temps mesuré.
## Déploiement
Backend PR 11 (migration 022, routes privées) avant frontend. Aucun accès direct PostgREST. Aucun XP ou validation automatique, aucun partage formateur, aucune notification.
## Recette
- Créer, modifier, déplacer, filtrer, supprimer avec confirmation, sauvegarder puis recharger. Tester clavier et mobile.
- Refuser tâche terminée sans critère, doublons d'identifiant, dates impossibles, atelier inconnu et charge hors limites.
- Tester deux sessions concurrentes, brouillon conservé après échec, export et lecture seule sur compte terminé.
- Vérifier isolation entre apprenants, formateur, anonyme et inscription suspendue. Vérifier absence d'effet sur XP, dossier et portfolio.
