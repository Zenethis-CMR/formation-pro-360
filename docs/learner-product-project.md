# Mon projet — espace produit fil rouge
## Périmètre livré
Un dossier privé par apprenant inscrit et parcours, à renseigner progressivement dans sept rubriques : vision, recherche, UX, ingénierie, livraison, business, pilotage. 23 champs bornés, liens HTTPS, enregistrement explicite, protection contre les conflits de révision, export Markdown privé et conservation du brouillon dans l'écran en cas d'erreur. Les champs renseignés ne sont pas des preuves.
## Preuves et jalons
Le frontend consulte le portfolio officiel (source trainer_approved_with_xp_ledger) et les dernières corrections du catalogue. J14 : quatre premiers ateliers vérifiés ; J30 : huit premiers ; J56 : seize. Les jalons indiquent des repères pédagogiques et non une date limite calculée, ni une certification indépendante du produit. Les résultats indisponibles ne sont pas remplacés par des zéros.
## Déploiement
Backend PR 10 en premier : migration additive 021 et routes privées, mêmes conditions V2 que le carnet. Frontend ensuite. En cas d'absence de route ou de panne, l'espace affiche un état indisponible et renvoie au parcours. Aucune modification des tables de récompenses, des anciens comptes, du portfolio publié ou des droits.
## Recette authentifiée
- Apprenant inscrit : créer un dossier, modifier les 23 champs au fil des ateliers, recharger, vérifier la persistance et l'export.
- Deux onglets : enregistrer dans le premier puis dans le second ; le second affiche un conflit et conserve son brouillon sans écraser la version récente.
- Compte sans inscription ou suspendu : accès refusé ; compte terminé : lecture seule ; formateur et autre apprenant : aucune lecture du dossier privé via l'API.
- Liens non HTTPS, champs trop longs et propriétés étrangères : rejet. Aucun secret ni donnée personnelle client dans les champs.
- Vérifier J14, J30, J56 à partir des preuves exactes et des XP ; pas d'augmentation en remplissant le dossier.
- Tester mobile 360/390 px, tablette, clavier, navigation des huit modules, sauvegarde en cas de panne et retour vers les ateliers.
## Suites distinctes
Le dossier est volontairement privé : pas de consultation directe par le formateur, pas de partage public, pas d'automatisation commerciale et pas de transmission au modèle IA. Une phase ultérieure peut ajouter un partage explicite et révocable avec un formateur autorisé, des commentaires, des versions historiques, un backlog de tâches et du coaching ciblé. Les corrections officielles existantes sont déjà visibles dans le cockpit.
