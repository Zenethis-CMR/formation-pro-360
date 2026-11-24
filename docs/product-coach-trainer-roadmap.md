# Formation Pro 360 — assistance produit et pilotage humain
Le formateur dirige les démonstrations, exercices, accompagnement et validations. Qwen3 est une aide ponctuelle facultative, sans rôle de décision ni de correction. Il propose une seule piste testable et une question à discuter; aucun accès automatique aux documents privés et aucune modification automatique.
## Lot 1 — présent dans cette PR
- Six domaines dans Mon accompagnement : analyse projet, backlog, UX/UI, technique, qualité, business. Une intention et un domaine par demande. Consentement explicite, contexte limité, transport SSE existant, aucune importation automatique des suggestions.
- Cockpit formateur V2 : liste paginée d'inscrits, état de chaque atelier publié, dernier dépôt, score/commentaire officiel et XP uniquement si preuve vérifiée. Indicateurs par page, distingués des anciens projets complémentaires. Les travaux à reprendre sont des signaux de discussion, pas un diagnostic de difficulté.
- Aucun nouveau schéma, aucun changement de notes ou récompenses; backend PR 13 avant frontend.
## Lots suivants — non implémentés
2. Séances pratiques : calendrier défini par le formateur, objectifs, démonstrations, liens, publication explicite, visibilité apprenant.
3. Consignes personnalisées : exercices et défis attribués par le formateur à un apprenant ou groupe autorisé; réponse/retour humain, échéances personnelles distinctes des XP.
4. Suivi des blocages : remontée volontaire et persistante de difficultés, traitement par le formateur, historique et résolution explicite.
5. Revue collaborative : partage explicite et révocable du dossier par l'apprenant, périmètre d'accès et commentaires humains; ne pas exposer les brouillons privés sans mécanisme d'autorisation.
6. Rapports : synthèse par atelier et compétences, preuves et sources officielles, export, distinction entre données manquantes et zéro, absence de classement par IA.
## Recette
Vérifier six domaines et demandes non conformes sur Qwen3 réel, fonctionnement sans IA, consentement, absence de lecture privée. Vérifier le cockpit avec inscrit sans dépôt, dépôt en attente, correction demandée, preuve vérifiée, pagination, comptes non autorisés et mobile. Aucun résultat de production n'est déduit de la CI.
