# ARCHIVE — ancienne procédure de migration

> Ce document décrit l'ancienne transition et contient des étapes qui ne doivent plus être suivies en production. L'authentification actuelle est déjà gérée par l'API Node.js. Utiliser [`proxmox-deployment.md`](./proxmox-deployment.md) pour l'architecture active.

# Migration vers l'authentification Node.js

## Compatibilité des données

Les tables métier utilisent `public.profiles.id` comme identifiant apprenant ou formateur et les politiques RLS se basent sur `auth.uid()`. L'API garde ces UUID : elle signe pour chaque requête métier un JWT Supabase de 60 secondes avec `sub=<profiles.id>` et `role=authenticated`. Le secret de signature ne quitte jamais l'API et le frontend ne reçoit qu'un jeton de courte durée côté serveur.

Le nouveau schéma `formation_auth` stocke comptes, sessions et jetons à usage unique. `formation_auth.accounts.id` référence le profil existant. Les nouvelles inscriptions créent un profil `learner` dans la même transaction. Les changements de rôle restent une opération d'administration.

## Import des comptes existants

Avant toute modification : effectuer une sauvegarde PostgreSQL chiffrée, vérifier qu'elle est lisible et noter le point de restauration. Appliquer d'abord `migrations/001_auth.sql` depuis le dépôt backend. Puis, dans une transaction, copier les identités sans changer leurs UUID :

```sql
begin;
insert into formation_auth.accounts (id, email, password_hash, email_verified_at)
select u.id,
       lower(u.email),
       nullif(u.encrypted_password, ''),
       u.email_confirmed_at
  from auth.users u
  join public.profiles p on p.id = u.id
 where u.email is not null
on conflict (id) do nothing;
commit;
```

Les hachages bcrypt existants sont vérifiés par l'API Node ; le premier changement de mot de passe les remplace par scrypt. Les identités sans mot de passe peuvent demander une récupération par e-mail. Les profils, rôles, inscriptions, soumissions, XP et badges ne sont ni renommés ni supprimés.

## Pré-requis avant activation

- Récupérer `DATABASE_URL` et `SUPABASE_JWT_SECRET` depuis la configuration Supabase existante, sans les afficher dans les logs.
- Configurer un SMTP autorisé pour l'expéditeur `SMTP_FROM`, avec SPF/DKIM/DMARC du domaine expéditeur vérifiés. La limite d'envoi dépendra du fournisseur SMTP retenu, pas de Supabase Auth.
- Définir `PUBLIC_APP_URL=https://formation.zenithis.tech`, le backend à `PORT=3000`, et rendre le cookie `Secure` côté frontend.
- Vérifier que les politiques RLS acceptent le rôle `authenticated` et `auth.uid()` pour un JWT signé avec le secret Supabase en place.
- Importer les comptes après sauvegarde et vérifier l'accès pilote apprenant et formateur avant d'ouvrir les inscriptions.

## Retour arrière

La migration ajoute un schéma dédié et ne retire aucune identité Supabase. Pendant la période de validation, garder Vercel et le CT Supabase en fonctionnement. En cas d'échec, remettre le domaine dans NPM vers le service frontend précédent ; les UUID et données métier restent inchangés. Ne désactiver Supabase Auth qu'après confirmation explicite des parcours historiques, nouveaux comptes et récupération d'accès.
