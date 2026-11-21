# Formation Pro 360 : activation Supabase

## État réel

- Projet Supabase : **Formation Pro 360** (référence `llwuukoqwlwpefgipvgc`), région Paris.
- PostgreSQL actif avec les migrations `001_initial.sql` à `006_guided_workshops.sql`.
- **16 missions publiées** sur huit semaines, avec prérequis progressifs. La validation d'une mission attribue des XP une seule fois.
- Les dix tables applicatives sont protégées par RLS : profils, missions, prérequis, soumissions, XP, badges, badges acquis, séances de pratique, guides d'ateliers et étapes.
- Vercel possède les variables d'environnement publiques requises (URL, clé publishable, URL du site).
- Les pages de démonstration `/apprenant` et `/formateur` restent séparées des espaces réels protégés `/espace/apprenant` et `/espace/formateur`.

## Configuration Supabase Auth, action manuelle dans le tableau de bord

Dans Supabase, sélectionner **Formation Pro 360**, puis Authentication > URL Configuration.
1. Site URL : `https://formation-pro-360.vercel.app`
2. Ajouter aux URL de redirection : `https://formation-pro-360.vercel.app/auth/callback`
3. Supprimer des redirections autorisées toutes les anciennes URL de prévisualisation après validation. Les utilisateurs accèdent uniquement au domaine public ci-dessus.
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

## Tests de recette sur le domaine public

- Déploiement Next.js sur `https://formation-pro-360.vercel.app` puis contrôle TypeScript, des routes et de l'absence d'authentification Vercel pour les visiteurs.
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
- Domaine d'expédition Resend : `zenithis.tech`, vérifié. Expéditeur : `formation@zenithis.tech`.
- Domaine unique utilisé pour l'application : `https://formation-pro-360.vercel.app`. Ne pas recommander d'autres URL pour accéder au site.
- Aucune clé Resend ne doit être écrite dans GitHub, les composants React ou les variables publiques Vercel.
- SMTP personnalisé activé dans Supabase avec limite de 30 e-mails/heure selon la capture du tableau de bord. La délivrabilité externe doit encore être validée.

## Gamification en données réelles

- Catalogue de six badges déclenchés par 1, 2, 4, 8, 12 et 16 missions **validées**.
- L'attribution est automatique à chaque nouvel XP certifié en base, sans possibilité pour un navigateur d'écrire directement un badge.
- Un défi de pratique différent chaque jour de la semaine. La séance est déclarée par l'apprenant, sans XP, et stockée par jour au fuseau Africa/Douala.
- Statistiques apprenant et suivi de cohorte formateur, basés sur Supabase. Aucun XP n'est attribué par simple clic sur « séance terminée ».

## Contrôles de permissions

La migration `005_restrict_client_writes.sql` révoque explicitement à `authenticated` les écritures directes sur les rôles et les XP. Les clients peuvent toujours enregistrer une pratique quotidienne et soumettre une mission selon les politiques RLS. Les fonctions de validation côté serveur restent seules responsables de la création des récompenses après évaluation.


## Ateliers guidés : apprendre avant d'être noté

Migration `006_guided_workshops.sql` :
- 16 ateliers reliés aux missions existantes, chacun avec un brief, **4 étapes concrètes**, des résultats attendus, une grille de 4 critères, un conseil et un lien de documentation.
- 64 étapes de travail et un suivi individuel `workshop_steps`, sécurisé par RLS et par un trigger qui vérifie les prérequis.
- Atelier accessible depuis une carte de mission via `/espace/atelier/[id]` avec statut de verrouillage, progression des étapes, retour de correction et formulaire de remise.
- Consignes consultables même si les prérequis ne sont pas encore validés ; impossible de cocher ou de soumettre tant que la mission est verrouillée.
- Le formateur voit la même grille de critères directement à côté du projet à corriger.
- **Cocher une étape ne crée jamais d'XP, ne déverrouille aucune mission et n'attribue aucun badge.** Seule la validation de la soumission par un formateur peut le faire.
- Aucun contenu utilisateur existant n'est supprimé.

Contrôles avant publication :
- [ ] Depuis le compte apprenant, marquer une étape du premier atelier puis rafraîchir : l'étape reste cochée.
- [ ] Depuis ce même compte, ouvrir une mission verrouillée : lecture possible, actions bloquées.
- [ ] Soumettre un projet depuis l'atelier accessible : la correction apparaît dans le tableau formateur.
- [ ] Corriger à 85/100 : XP et badge attribués une seule fois.
- [ ] Vérifier mobile, navigation clavier, absence de secrets dans l'application.
