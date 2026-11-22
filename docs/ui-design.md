# Identité visuelle : Formation Pro 360

## Orientation UX
Direction : tableau de bord éducatif professionnel inspiré de la capture de référence communiquée par le commanditaire, sans reprise du logo, de l'avatar ou de la marque de cette référence.

- Fond lavande très clair et surface blanche avec arrondis généreux.
- Navigation latérale, espace de travail principal, panneau de profil et progression.
- Bannière bleue illustrant un cours pratique, recherche de missions.
- Hiérarchie typographique lisible, feedback d'état, mises en avant des actions utiles.
- Responsive : rail de profil masqué sur tablette, barre de navigation inférieure sur mobile.
- Conservation des formulaires de remise et d'évaluation du prototype fonctionnel.

## Visuels et licences
**Photographie de programmation** : « Laptop with code, headphones, phone, and mouse on desk » par **Daniil Komov**, publiée sur Unsplash le 19 novembre 2025.
- Photo : https://unsplash.com/photos/laptop-with-code-headphones-phone-and-mouse-on-desk-41cG8-U74lc
- Licence : https://unsplash.com/license
- Utilisation : bannière principale via `images.unsplash.com`. La licence autorise l'utilisation gratuite, y compris commerciale, sous ses conditions.
- Les superpositions (fenêtre de code, cartes de progression, personnage stylisé) sont produites directement en CSS et SVG par le projet. Elles restent intégrées au code source et ne sont pas des images tierces.

Le chargement de la photo utilise l'hébergement Unsplash ; l'interface contient un fond bleu et des éléments graphiques CSS utilisables si la photo ne charge pas. Pour une livraison de production à long terme, envisager de servir une copie optimisée depuis une solution de stockage avec les licences et crédits documentés.

## Limitations
- Les espaces de démo sur `/apprenant` et `/formateur` restent publics et enregistrent localement les données du navigateur.
- Cette note décrit une ancienne piste de développement. La production utilise désormais les comptes, les rôles et la persistance via l'API Node.js ; voir [`proxmox-deployment.md`](./proxmox-deployment.md).
