# Portfolio privé — Formation Pro 360

## Origine et garanties
La page `/espace/portfolio` est une nouvelle surface de l'espace apprenant qui appelle **uniquement l'API vérifiée** `GET /v1/training/catalog/ingenierie-produit-ia/portfolio`. L'identification et l'inscription sont contrôlées par CT420. Les cartes n'apparaissent que si la soumission a reçu une validation formateur d'au moins 80/100 **et** une attribution de 100 XP correspondant exactement au dépôt évalué.

Un compte sans inscription active ou terminée ne peut pas consulter le portfolio. Aucun accès public ni partage automatique n'est disponible. Les cours encore en préparation, les dépôts en attente, les refus de correction et les carnets privés sont exclus. Les anciens projets et XP des autres missions ne sont pas convertis silencieusement : ils restent présents dans la progression historique.

## Expérience
Le portfolio présente le nombre d'ateliers réellement validés sur 16, les XP du parcours inscrits dans le registre, les semaines représentées, les titres, notes et dates de correction, les compétences pédagogiques travaillées, la preuve officiellement attendue et un accès au livrable soumis.

La recherche et le filtrage fonctionnent localement, sans nouvelles requêtes. L'impression et la sauvegarde PDF sont déclenchées par un clic sur « Imprimer / exporter en PDF » puis par le navigateur de l'apprenant. Par défaut, l'export **n'inclut ni les descriptions déposées ni les adresses des projets** ; ces éléments ne sont ajoutés que si l'apprenant coche explicitement leur option. La page est donc un dossier personnel, **ni diplôme ni certificat professionnel**.

Les liens des livrables sont des références fournies par l'apprenant : ils peuvent évoluer après la correction. La page ne déclenche jamais de téléchargement ou de requête automatique sur les projets externes. Le site ne crée aucune note, évaluation, badge ou XP supplémentaire.

## Déploiement
Déployer d'abord le backend sur CT420 et vérifier le test d'intégration PostgreSQL de l'API privée. Déployer ensuite le frontend sur CT410 via GitHub Actions. Vérifier un compte inscrit avec un dépôt validé (nombre, lien, note, date), un compte inscrit sans dépôt validé (portfolio vide) et un compte suspendu (403). Les tests de compilation et de confidentialité sont automatiques ; le contrôle fonctionnel avec les comptes réels reste nécessaire.
