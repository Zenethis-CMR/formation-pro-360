# Formation Pro 360 : activation Supabase

## État réel

- Projet Supabase : **Formation Pro 360** (référence `llwuukoqwlwpefgipvgc`), région Paris.
- PostgreSQL actif avec `001_initial.sql`, `002_optimize_rls.sql` et `003_eight_week_curriculum.sql`.
- **16 missions publiées** sur huit semaines, avec prérequis progressifs. La validation d'une mission attribue des XP une seule fois.
- Les cinq tables sont protégées par RLS et quatre missions de départ sont publiées.
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

## Domaine et e-mails (après finalisation)

- Domaine souhaité à la fin du projet : `formation.zenithis.tech`.
- À ce moment, ajouter `https://formation.zenithis.tech` comme URL du site et `https://formation.zenithis.tech/auth/callback` parmi les URL de redirection Supabase.
- Configurer un fournisseur SMTP professionnel, vérifier l'expéditeur/DNS, puis tester la délivrabilité depuis un compte apprenant distinct. Sans SMTP personnalisé, les e-mails d'authentification Supabase sont fortement limités.
- Ne pas modifier l'URL publique de production ni imposer ce domaine avant validation de tous les tests.
