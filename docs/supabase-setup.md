# Formation Pro 360 : activation Supabase

## État réel

- Projet Supabase : **Formation Pro 360** (référence `llwuukoqwlwpefgipvgc`), région Paris.
- PostgreSQL actif avec les migrations `001_initial.sql` à `005_restrict_client_writes.sql`.
- **16 missions publiées** sur huit semaines, avec prérequis progressifs. La validation d'une mission attribue des XP une seule fois.
- Les huit tables applicatives sont protégées par RLS : profils, missions, prérequis, soumissions, XP, badges, badges acquis et séances de pratique.
- Vercel possède les variables d'environnement publiques requises (URL, clé publishable, URL du site).
- Les pages de démonstration `/apprenant` et `/formateur` restent séparées des espaces réels protégés `/espace/apprenant` et `/espace/formateur`.

## Configuration Supabase Auth, action manuelle dans le tableau de bord

Dans Supabase, sélectionner **Formation Pro 360**, puis Authentication > URL Configuration.
1. Site URL : `https://formation-pro-360.vercel.app`
2. Ajouter aux URL de redirection : `https://formation-pro-360.vercel.app/auth/callback`
3. Pour tester la branche avant fusion, autoriser également `https://formation-pro-360-git-feat-li-487e0e-raymond-tampgueus-projects.vercel.app/auth/callback` dans les redirections. La variable Vercel `NEXT_PUBLIC_SITE_URL` est surchargée pour cette branche de prévisualisation. Retirer cette URL après les tests.
4. Vérifier qu'un modèle d'e-mail de connexion OTP/magic link est activé. Pour des comptes réels, contrôler les restrictions d'inscription et les limites d'envoi. Ne pas envoyer des e-mails de test à des tiers sans consentement.

## Amorcer le premier compte formateur

1. Une fois les URL de connexion configurées et l'application déployée, se connecter sur `/login` avec l'e-mail du formateur.
2. Le nouveau compte est **learner** par défaut.
3. L'administrateur identifie l'e-mail qu'il est autorisé à promouvoir puis exécute dans SQL Editor :

```sql
update public.profiles set role='trainer'
where id=(select id from auth.users where email='EMAIL_DU_FORMATEUR');
```

L'adresse doit être remplacée localement par celle du formateur réel. Vérifier la ligne modifiée avant de déclarer le compte prêt. Aucun accès formateur n'est accordé automatiquement sur simple indication d'un e-mail.

## Tests avant passage en production

- Déploiement Next.js en preview puis contrôle TypeScript et routes.
- Essai de connexion par lien e-mail avec deux comptes distincts.
- Vérifier qu'un apprenant ne peut pas consulter `/espace/formateur` ni les soumissions des autres.
- Valider un livrable à 85/100 : apparition d'une seule ligne d'XP et déblocage du prérequis suivant.
- Rejeter un livrable avec une note inférieure à 80 : correction possible, pas d'XP attribués.
- Tests mobiles, validation, absence de clés secrètes dans GitHub.

## Sécurité

Les fonctions `public.is_trainer` et `public.review_submission` sont des fonctions SECURITY DEFINER explicitement contrôlées : ce choix déclenche un avertissement du linter Supabase. Toute fonction de correction vérifie le rôle en base avant de modifier les résultats. Ne pas supprimer ces contrôles ni exposer une clé de service dans l'application.

L'application n'utilise que la **clé publishable** autorisée dans le front-end. Aucune clé d'administration ni mot de passe ne doit être commité. La première version de production ne doit pas traiter de données sensibles avant tests complets.

## Parcours pédagogique de 8 semaines

L'apprenant visualise une carte des huit étapes, chaque semaine avec ses compétences et son livrable. Les missions sont regroupées dans des panneaux extensibles ; la semaine correspondant à la première mission non validée s'ouvre par défaut. Les futures étapes peuvent être consultées mais restent verrouillées par les prérequis contrôlés en base.

Le formateur accède au programme, au nombre de comptes apprenants et au total des XP effectivement attribués. La feuille de route est décrite dans `src/lib/curriculum.ts` et les données réelles dans la migration `003_eight_week_curriculum.sql`. Les nouveaux exercices ajoutés via l'interface peuvent être créés en brouillon.

## SMTP à configurer avant ouverture aux apprenants

- Fournisseur retenu : **Resend via SMTP personnalisé**. Guide d'activation : [auth-email-resend.md](./auth-email-resend.md).
- Activer et vérifier l'expéditeur `no-reply@auth.zenithis.tech` dès maintenant, indépendamment du site.
- Domaine de l'application réservé à la fin du projet : `formation.zenithis.tech`. Mettre à jour les URL Vercel, Supabase et les redirections seulement après validation.
- Aucune clé Resend ne doit être écrite dans GitHub, les composants React ou les variables publiques Vercel.
- La limite de 2 e-mails/heure reste en place tant que le SMTP personnalisé n'est pas réellement activé.

## Gamification en données réelles

- Catalogue de six badges déclenchés par 1, 2, 4, 8, 12 et 16 missions **validées**.
- L'attribution est automatique à chaque nouvel XP certifié en base, sans possibilité pour un navigateur d'écrire directement un badge.
- Un défi de pratique différent chaque jour de la semaine. La séance est déclarée par l'apprenant, sans XP, et stockée par jour au fuseau Africa/Douala.
- Statistiques apprenant et suivi de cohorte formateur, basés sur Supabase. Aucun XP n'est attribué par simple clic sur « séance terminée ».

## Contrôles de permissions

La migration `005_restrict_client_writes.sql` révoque explicitement à `authenticated` les écritures directes sur les rôles et les XP. Les clients peuvent toujours enregistrer une pratique quotidienne et soumettre une mission selon les politiques RLS. Les fonctions de validation côté serveur restent seules responsables de la création des récompenses après évaluation.
