# Authentification des apprenants | Formation Pro 360

## Objectif et compatibilité

La seule adresse publique à communiquer est **https://formation-pro-360.vercel.app/login**.

Les cinq comptes existants au moment de cette évolution (quatre apprenants et un formateur) sont conservés dans `auth.users` et `public.profiles`. Aucune migration de données, recréation de profil, import CSV ni remise à zéro des XP n'est nécessaire.

Deux méthodes de connexion utilisent le **même identifiant Supabase** :
- E-mail + mot de passe, pour les nouvelles inscriptions ou pour les comptes qui ont déjà défini un mot de passe.
- Lien de connexion par e-mail, maintenu pour les comptes existants sans mot de passe.

Après une connexion par lien, l'utilisateur ouvre **Mon compte** (`/espace/compte`) pour définir un mot de passe sur son compte actuel. Ne pas lui demander de se réinscrire.

## Inscription

La page `/login?mode=inscription` appelle `supabase.auth.signUp({email,password})` via une action serveur. La base Supabase existante gère l'unicité de l'e-mail. Le trigger `on_auth_user_created` crée un profil **apprenant** seulement pour un nouvel utilisateur. Aucun formulaire public ne peut attribuer le rôle `trainer`.

Le mot de passe doit comporter 10 à 128 caractères, au moins une majuscule, une minuscule et un chiffre. Les mots de passe ne sont stockés ni dans le code, ni dans `public.profiles`.

En cas de confirmation par e-mail, le lien retourne sur `/auth/callback?flow=signup` et finalise la session. Les e-mails sont envoyés par le SMTP Resend connecté à Supabase.

## Récupération de mot de passe

La page `/login?mode=recuperation` appelle `resetPasswordForEmail`, dont la destination est `/auth/callback?flow=recovery`. Après échange du code PKCE, l'utilisateur est dirigé vers `/auth/nouveau-mot-de-passe`.

Le compte existant est conservé, sans réinscription. Aucun e-mail n'est révélé comme enregistré ou absent par la réponse du formulaire de récupération.

## Lien magique historique

`/login?mode=lien` appelle `signInWithOtp` avec **`shouldCreateUser:false`**. Une tentative sur une adresse inconnue ne doit pas créer de compte. Après connexion, l'utilisateur peut définir son mot de passe dans son espace sécurisé.

## Configuration Supabase à vérifier

1. **Authentication → Sign In / Providers → Email :** activation du fournisseur Email avec inscription e-mail/mot de passe autorisée.
2. **Authentication → URL Configuration :** site URL `https://formation-pro-360.vercel.app` et redirections autorisées pour le callback `https://formation-pro-360.vercel.app/auth/callback`, notamment pour les variantes `?flow=signup` et `?flow=recovery` si le paramétrage requiert des URL exactes.
3. **Authentication → Emails → SMTP Settings :** Resend doit rester configuré avec `formation@zenithis.tech` ; ne pas copier les secrets dans GitHub.
4. **Authentication → Emails → Templates :** vérifier les modèles de confirmation de compte, mot de passe oublié et lien de connexion. Le callback Next.js attend un code PKCE dans `?code=...`.
5. En cas de navigation par e-mail, ouvrir si possible le lien dans **le même navigateur et sur le même appareil** que celui ayant initié la demande : c'est important pour le vérificateur de code PKCE.
6. Vérifier l'activation de la protection contre les mots de passe compromis si l'option est disponible sur le plan Supabase.
7. L'ancienne clé Resend a été exposée dans une capture lors de la configuration : prévoir sa rotation dans Resend et Supabase, sans la transmettre dans le chat.

## Tests de recette humaine

- [ ] Ancien apprenant : demande un lien sécurisé, se connecte, retrouve ses missions et ses données.
- [ ] Ancien formateur : utilise son accès existant et conserve ses droits.
- [ ] Ancien apprenant : définit un mot de passe dans Mon compte, se déconnecte, se reconnecte avec ce mot de passe.
- [ ] Nouveau : s'inscrit avec une nouvelle adresse, confirme si nécessaire, devient **apprenant** et non formateur.
- [ ] Mot de passe oublié : reçoit un message Resend, suit le callback, crée un nouveau mot de passe.
- [ ] Vérifier les mêmes écrans sur un téléphone et ne pas demander de compte Vercel.
- [ ] Vérifier le nombre d'utilisateurs avant/après et s'assurer que les identifiants des cinq premiers comptes n'ont pas changé.
