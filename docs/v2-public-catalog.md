# Catalogue V2 public, ouvert sur `main`

Routes visibles sans authentification :
- `/catalogue` — vision des sept formations ; seule **Ingénierie produit et IA** dispose actuellement d'un programme détaillé. Les six autres sont indiquées comme « En préparation ».
- `/catalogue/ingenierie-produit-ia` — huit semaines, seize ateliers, compétences, objectifs et livrables attendus, extraits de `migrations/016_v2_product_engineering_draft.sql`.

Des liens d'accès sont présents dans la navigation apprenant/formateur, sur la page de connexion et dans le tableau de bord apprenant.

**Limite intentionnelle de cette livraison :** il s'agit du catalogue pédagogique **consultable**, pas d'un système d'achat ni de la publication des leçons protégées dans PostgreSQL. Ni une préinscription, ni un déblocage, ni une attribution XP ne sont créés par ces pages. Le parcours existant et son historique restent inchangés. Les modules ne sont pas présentés comme des cours ouverts aux inscriptions.

Pour rendre ensuite les ateliers interactifs et ouvrir les inscriptions : vérifier l'import historique (A3), restaurer une sauvegarde sur staging, appliquer `015/016` sur staging, tester RLS et le flux end-to-end, puis approuver l'activation des flags backend. Ne jamais prétendre que les tables V2 sont actives simplement parce que le catalogue HTML est visible.

Le contenu du fichier TS est un instantané éditorial des titres, objectifs et preuves de la migration `016`. Lors de la publication réelle, le système doit lire la version publiée en base et ne pas confondre ces aperçus avec des leçons validées.
