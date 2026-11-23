# B5 — Studio de production du projet fil rouge V2

## Livraison

Pour chacun des 16 ateliers, l'URL privée `/espace/parcours/ingenierie-produit-ia/atelier/[slug]` fournit un espace pédagogique complet. Le catalogue hebdomadaire propose un lien « Entrer dans le studio pédagogique ». Les contenus sont rédigés spécifiquement pour chaque leçon du parcours V2, en complément du texte officiel publié dans PostgreSQL.

- **Brief métier** et rappel des consignes officielles, versionnées.
- **Cinq étapes pratiques** avec action, preuve intermédiaire, test de vérification et coche locale.
- **Quatre repères de qualité** (auto-évaluation, pas un barème officiel inventé).
- **Trois pièges à éviter**, un prompt de coaching IA à copier et un modèle de livrable.
- **Dépôt sur CT420** via la même action authentifiée existante, réponse redirigée sur le bon atelier, état pending / demande d'amélioration / validation et historique des tentatives.
- **Navigation** entre ateliers, sommaire de l'écran et responsive mobile.

## Sécurité et exactitude

Les 16 guides sont importés exclusivement par les routes serveur. **Ni le guide, ni le travail officiel, ni le modèle détaillé n'est rendu à un utilisateur non inscrit ou suspendu** : la page vérifie d'abord la session, l'accès `lesson_access=granted`, le statut d'inscription et la publication de la leçon concernée. Les inscriptions et XP ne peuvent jamais être modifiés via les coches ou les modèles.

L'auto-contrôle utilise un état client **éphémère et non sauvegardé** : il n'affiche jamais un progrès officiel. Seuls les dépôts et les corrections serveur génèrent les validations et récompenses. Les prompts sont copiés dans le presse-papiers à la demande ; il n'existe pas de génération IA, de collecte de données ni de téléchargement automatique des liens de livrable.

Les repères de qualité sont éditoriaux. Si une grille de correction est publiée en base, ses intitulés réels sont affichés séparément. Le seuil contractuel de validation reste **80/100** et la correction reste entre les mains du formateur.

Le contenu opérationnel est particulièrement approfondi pour les jalons **J14 flux réel en ligne**, **M1 MVP exploitable** et **M2 expérimentation commerciale**, tout en distinguant systématiquement observations réelles, simulations IA et tests fictifs.

## Maintenance

Les seize suppléments se trouvent dans `src/lib/v2-workshop-guides.ts`, avec une vérification du nombre de leçons, de leurs slugs et de la présence des étapes dans `tests/v2-workshop-studio.test.cjs`. En cas de nouvelle version d'une leçon publiée, vérifier l'alignement éditorial avant déploiement du nouveau guide.

Cette livraison ne nécessite aucune nouvelle migration de production ni modification des XP V1/V2. Elle améliore le parcours utilisateur et réutilise le backend déjà activé.
