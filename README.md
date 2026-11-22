# Formation Pro 360

Plateforme privée de formation pratique, propulsée par **Next.js 15, React 19, TypeScript, Supabase et Vercel**.

**Site officiel :** https://formation-pro-360.vercel.app/

## Accès et profils

La démonstration publique a été supprimée. Les visiteurs doivent **s'inscrire ou se connecter** sur `/login`. Les anciens comptes continuent à utiliser leur lien magique, ou définissent un mot de passe depuis « Mon compte ».

La racine et les anciens chemins publics `/apprenant` et `/formateur` redirigent vers `/espace`, qui contrôle l'identité Supabase et le rôle. Seul un administrateur peut attribuer le rôle **formateur** ; tout nouveau compte est **apprenant** par défaut.

### Apprenant

| Onglet | Fonction |
| --- | --- |
| Tableau de bord | Accueil, mission suivante et progression synthétique |
| Mes missions | Ateliers, prérequis, état de chaque soumission et lien vers les livrables |
| Ma progression | XP réellement attribués, badges, compétences, pratique et messages du formateur |
| Programme | Calendrier de formation et feuille de route sur huit semaines |
| Mon compte | Informations de connexion, mot de passe et objectifs personnels |

### Formateur

| Onglet | Fonction |
| --- | --- |
| Tableau de bord | Indicateurs de cohorte et raccourcis |
| Évaluations | Livrables en attente, notes critériées, commentaires et historique |
| Mes apprenants | Coaching, messagerie interne, suivi de cohorte et activité |
| Programme | Calendrier, missions, ateliers, brouillons et publication |
| Mon compte | Informations de connexion et gestion du mot de passe |

Tous les onglets sont des vues distinctes et adaptent leur présentation aux petits écrans.

## Données et sécurité

- **Supabase Auth** gère les sessions, confirmations par e-mail et mots de passe. Les utilisateurs historiques conservent leurs comptes.
- Les profils, les missions, les soumissions, les corrections, les séances, les badges et les XP sont persistants dans **PostgreSQL** et soumis à des **politiques RLS**.
- Seul un formateur authentifié peut corriger ou publier des missions. Une validation d'au moins **80/100** accorde les XP une fois, dans une transaction sécurisée.
- Le moteur de données simulées en `localStorage` a été supprimé.
- Les e-mails d'authentification sont envoyés par Supabase via le SMTP personnalisé Resend ; vérifier leur réception sur un appareil réel.

**Aucun secret, e-mail de compte, mot de passe, token, clé API ou résultat individuel ne doit être commité dans ce dépôt.**

## Développement local

```bash
npm install
npm run dev
```

Définir uniquement les variables Supabase autorisées dans l'environnement local ; ne jamais ajouter une clé de service côté navigateur.

```bash
npm run test:unit
npm run lint
npm run build
```

Les tests sont exécutés automatiquement avant chaque build.

## Documentation

- `docs/private-workspace-navigation.md` : accès privé, onglets des deux rôles et recette
- `docs/auth-signup-compatibility.md` : comptes existants, inscription, récupération et confirmation des e-mails
- `docs/supabase-setup.md` : base de données, migrations, rôles et règles de sécurité
- `docs/programme.md` : objectifs du parcours pédagogique

## Validation avant lancement élargi

Tester la connexion d'un nouvel apprenant, les cinq onglets sur téléphone,
la remise d'un vrai projet, les évaluations, la progression et la séparation
des droits entre un apprenant et un formateur. Les tests de compilation ne
remplacent pas la recette avec de vrais utilisateurs.
