# Formation Pro 360 : accès privé et organisation des espaces

## Règle d'accès

La plateforme se consulte uniquement après inscription ou connexion sur
`https://formation-pro-360.vercel.app/login`.

Les anciennes routes publiques `/`, `/apprenant` et `/formateur` ne présentent
plus de données de démonstration : elles dirigent vers `/espace`.
Ce point d'entrée vérifie l'identité Supabase et le rôle puis ouvre
`/espace/apprenant` ou `/espace/formateur`.

Le parcours de connexion, l'inscription, le lien magique pour les anciens comptes,
la récupération du mot de passe et la confirmation e-mail restent accessibles
sans session. Les données réelles sont protégées côté serveur par `requireRole`
et côté PostgreSQL par les politiques RLS en place. Un apprenant ne peut pas
accéder à une action formateur et inversement.

Le code de simulation navigateur, ses missions factices et les anciennes pages
de démonstration ont été retirés. Aucune migration des vrais comptes ni
réinitialisation des livrables, évaluations, badges ou XP n'a été réalisée.

## Navigation de l'apprenant

Les quatre onglets ont chacun un lien distinct (la sélection est conservée
dans le paramètre `onglet`) :

| Onglet | Adresse | Fonctions |
| --- | --- | --- |
| Tableau de bord | `/espace/apprenant` | Synthèse, missions en cours, progression globale et démarrage rapide |
| Mes missions | `/espace/apprenant?onglet=missions` | Toutes les missions groupées par semaine, prérequis, statuts, livrables, accès aux ateliers |
| Ma progression | `/espace/apprenant?onglet=progression` | Coaching et messages, séances de pratique, badges et XP, compétences maîtrisées |
| Programme | `/espace/apprenant?onglet=programme` | Calendrier pédagogique, huit semaines et feuille de route |

Le profil personnel et le mot de passe sont gérés via `/espace/compte`.
Les objectifs personnels restent modifiables depuis `/espace/bienvenue`.
L'accès aux ateliers se fait sur `/espace/atelier/[id]` avec contrôle du rôle.

## Navigation du formateur

| Onglet | Adresse | Fonctions |
| --- | --- | --- |
| Tableau de bord | `/espace/formateur` | Synthèse de cohorte et accès rapides |
| Évaluations | `/espace/formateur?onglet=evaluations` | Soumissions à corriger, grille sur 100, commentaires, historique réel des corrections |
| Mes apprenants | `/espace/formateur?onglet=apprenants` | Suivi individuel, coaching, messages et progrès de la cohorte |
| Programme | `/espace/formateur?onglet=programme` | Date de début, calendrier, feuille de route, brouillons, création et publication de missions, checklist de mise en service |

Les actions serveur ramènent à **l'onglet approprié** après une correction,
l'envoi d'un message, une modification de calendrier ou une publication.

Les vues de l'apprenant et du formateur n'utilisent que les données Supabase.
Le contrôle d'un rôle reste vérifié pour chaque requête sécurisée.

## Recette et limites des tests automatiques

Les tests Node sont exécutés par `npm run test:unit` avant le build Next.js.
Ils couvrent l'absence des routes publiques de démonstration, la continuité
du parcours de connexion, l'organisation des vues, les accès par rôle et les
redirections après les actions.

Une compilation réussie **ne prouve pas** l'ergonomie ni les actions d'une
session réellement authentifiée. À tester avant ouverture à une promotion :

- [ ] Nouveau visiteur : la racine affiche le formulaire de connexion/inscription.
- [ ] Visiteur non authentifié : aucune page ou fonction privée n'est consultable.
- [ ] Nouvel inscrit : confirmation d'e-mail et arrivée dans l'espace apprenant.
- [ ] Apprenant existant : les missions, XP et feedback antérieurs sont conservés.
- [ ] Tous les onglets de l'apprenant : contenu adapté, pas de zones orphelines.
- [ ] Tous les onglets du formateur : correction, historique, messagerie et création.
- [ ] Corriger une soumission réelle et vérifier son XP / feedback côté apprenant.
- [ ] Tester clavier, smartphone et petite largeur sur les cinq entrées du menu.
- [ ] Surveiller les erreurs d'envoi Resend et les messages de confirmation.
