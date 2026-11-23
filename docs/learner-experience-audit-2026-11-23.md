# Recette transversale — espace apprenant, 23 novembre 2026

## Périmètre examiné
Inspection du code réel des dépôts `formation-pro-360` et `formation-pro-backend` sur `main`, des migrations et des tests de GitHub Actions. Le navigateur public de recherche ne peut pas ouvrir le domaine de production dans cette session ; les vues privées des vrais comptes n'ont **pas** été visitées avec une session apprenant.

## Matrice de vérification

| Surface apprenant | Source et vérification | État |
| --- | --- | --- |
| Tableau de bord | Route `/espace/apprenant` ; état d'inscription réel et priorité au cours principal, historique séparé | Corrigé |
| Mon parcours | `/espace/parcours/ingenierie-produit-ia` ; 8 modules, 16 leçons, contrôle d'inscription, remise, correction | Contrôlé par CI |
| 16 ateliers | Correspondance stricte catalogue ↔ 16 guides ; 5 étapes / 4 critères, carnet privé, coach, preuve et remise | Contrôlé par CI |
| Mes réalisations | Onglet `missions` ; anciens ateliers conservés avec leurs prérequis et évaluations | Conservé |
| Ma progression | Onglet `progression` ; statut des soumissions V2 + anciens XP et badges différenciés | Contrôlé |
| Mes ressources | Onglet `programme` ; bibliothèque actuelle 8 modules et accès aux outils de chaque atelier publié, calendrier complémentaire distinct | **Corrigé** |
| Catalogue | Sept domaines en preview, un programme détaillé ; lien /catalogue | Contrôlé par tests de route existants |
| Mes objectifs | Préférences sauvegardées ; prochain atelier principal prioritaire, historique seulement en repli | **Corrigé** |
| Mon compte | Page /espace/compte ; session protégée, changement de mot de passe, préférences | Contrôlé dans le code |
| Mon portfolio | Uniquement projets approuvés liés au XP ; export local et partage explicite révoquable | Contrôlé par backend PostgreSQL et frontend |
| Navigation ordinateur/mobile | Contrôle des destinations, de l'onglet actif, du retour au parcours et des accès sans session ; menu « Plus » pour portfolio, ressources, objectifs et compte sur téléphone | Corrigé |

## Corrections apportées
1. Le titre « Mes ressources » affichait encore principalement l'ancien calendrier. Une bibliothèque du cours principal ouvre désormais les ressources utiles de **chaque atelier publié** ; les anciens contenus restent accessibles en section complémentaire.
2. « Mes objectifs » et le bandeau personnel pouvaient recommander la prochaine mission historique alors qu'un apprenant est inscrit au cours actuel. Ils privilégient désormais le premier atelier principal non terminé, puis les activités complémentaires.
3. Les chiffres de la barre latérale, qui ne provenaient que des missions historiques, sont désormais explicitement libellés « Autres missions » et « XP autres », afin de ne pas donner l'impression qu'ils comptent tous les ateliers du programme.
4. Le lien de navigation du parcours principal reste marqué comme actif pendant la consultation de ses ateliers.
5. Le menu mobile avait seulement cinq raccourcis et ne permettait pas d'atteindre directement les ressources, le portfolio ou les objectifs. Un menu « Plus » fournit désormais les destinations restantes sans déplacer les rubriques principales.

## Garde-fous automatiques
`tests/learner-complete-audit.test.cjs` recoupe les 8 modules du catalogue, les 16 slugs d'atelier, les 16 guides (étapes, preuves, critères, modèles), les destinations des onglets, les restrictions de rôle et d'inscription, les ressources V2, la cohérence du suivi, les anciennes missions et le portfolio privé/public.

Le workflow de déploiement vérifie, **sans utilisateur connecté**, que tous les onglets apprenant, la page compte, le carnet et le portfolio exigent une session. Il conserve les contrôles précédents du catalogue public et de l'API du coach.

## Points exigeant une recette avec un compte réel
Il reste à effectuer, dans un navigateur authentifié et sur PC/mobile : inscription, 16 ateliers ouverts, sauvegarde/rechargement du carnet, réponse Qwen3 et question de suivi, remise, correction par formateur, XP et badges, export PDF, partage du portfolio et révocation. La CI ne remplace pas ces observations et n'utilise pas de comptes artificiels en production.

**Aucun projet, inscription, correction, XP ou portfolio public n'est créé par cette recette.**
