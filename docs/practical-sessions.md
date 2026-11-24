# Mes séances — Formation Pro 360
## Design et expérience
Agenda à deux niveaux : prochaine séance et repère de date en tête, filtres/recherche sur la page, liste à gauche et détail sélectionné à droite sur grand écran. Sur mobile, les cartes s'empilent et la sélection amène au détail. Le formateur peut créer depuis l'en-tête, enregistrer un brouillon, prévisualiser la vue apprenant, confirmer publication/annulation/clôture. L'apprenant voit la préparation, la démonstration avec le formateur puis le travail attendu et le compte rendu. Palette bleu marine/bleu, hiérarchie typographique, états textuels, cibles de 44 px et focus clavier; préférence de mouvement réduit.
## Contrat
Séances privées du parcours pilote, collectives ou individuelles; seule une inscription active autorise la prochaine séance. Les inscrits terminés peuvent consulter les séances clôturées/annulées. Brouillon invisible à l'apprenant. Publication et correction par le formateur auteur. Public ciblé non modifiable après publication. Conflits de révision non destructifs. Aucune présence, notification externe, validation ou XP automatique. Horaires en Africa/Douala. Pagination par 25 séances; filtre et compteurs de la page; sélection individuelle limitée aux 200 premiers inscrits actifs.
## Ordre de livraison
Backend PR 14, migration 023, puis frontend. Aucune fausse séance créée en production.
## Recette visuelle et fonctionnelle à réaliser
- Desktop 1440 et 1280, tablette 768, mobile 390 et 360 px : débordement, lisibilité, sélection du détail, clavier et zoom 200 %.
- Formateur : créer un brouillon incomplet, prévisualiser, publier, modifier une séance, annuler et clôturer une séance réellement passée.
- Apprenant : agenda sans séance, prochaine séance, lien de réunion, déroulé et compte rendu, absence des brouillons et des séances d'un autre apprenant.
- Erreurs API, conflits de révision, session suspendue, mode lecture seule après fin de parcours. Vérifier que le calendrier ne change ni notes ni XP.
La CI vérifie le code et les contrats; elle ne remplace pas une recette visuelle dans un navigateur authentifié.
