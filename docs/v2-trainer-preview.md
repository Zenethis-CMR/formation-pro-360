# Prévisualiser le parcours V2 en espace formateur

La branche principale `main` contient désormais une section de lecture **uniquement au formateur**, dans `/espace/formateur?onglet=programme`, depuis les tables `training_tracks`, `track_modules` et `module_lessons`.

Cette section est contrôlée côté serveur par `FORMATION_V2_PREVIEW_ENABLED`. Le défaut est `false` ; tant que la variable n'est pas `true`, **aucune requête vers les tables V2 n'est envoyée**, ce qui préserve l'ancien schéma de production.

Pour tester après déploiement de la migration backend 015/016 dans un **staging isolé**, configurer `FORMATION_V2_PREVIEW_ENABLED=true` sur le frontend staging et se connecter avec un formateur de test. Vérifier : huit modules, seize ateliers, chaque objectif et livrable attendu, statut Brouillon, aucune écriture, et aucun impact sur les missions existantes. Un apprenant n'a pas accès à cet écran. Vérifier aussi les permissions RLS depuis PostgREST, pas uniquement l'absence de liens dans l'interface.

La prévisualisation n'est pas une publication de programme et ne débloque aucun atelier. L'inscription et la publication restent à développer et tester avant que le nouveau parcours soit visible dans l'espace apprenant.

L'optimisation A2.1 et cet aperçu ont été réunis sur `main` ; le flag reste désactivé en production tant que les migrations n'ont pas été validées. Le cours détaillé s'ouvre via le contrôle accessible de chaque semaine.