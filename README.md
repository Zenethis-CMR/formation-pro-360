# Formation Pro 360

Plateforme privée de formation pratique. Le frontend utilise **Next.js 15, React 19 et TypeScript** ; l'architecture Proxmox ajoute une API **Node.js/Fastify** pour les comptes et l'authentification.

**Site en production :** https://formation.zenithis.tech/ (frontend CT410, API CT420).

## Accès et profils

La démonstration publique a été supprimée. Les visiteurs doivent **s'inscrire ou se connecter** sur `/login`. La connexion, l'inscription et la récupération du mot de passe passent par l'API Node ; les anciens comptes sans mot de passe peuvent demander une réinitialisation par e-mail.

La racine et les anciens chemins publics `/apprenant` et `/formateur` redirigent vers `/espace`, qui vérifie la session Node et le rôle dans PostgreSQL local. Seul un administrateur peut attribuer le rôle **formateur** ; tout nouveau compte est **apprenant** par défaut.

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

- Le backend Node gère les comptes, sessions, confirmations et récupération par SMTP. Il signe les JWT courts utilisés par les règles RLS.
- Les profils, missions, soumissions, corrections, séances, badges et XP résident dans le PostgreSQL local sur CT420 ; PostgREST applique les politiques RLS derrière le proxy Node. Supabase Auth n'est pas utilisé.
- Seul un formateur authentifié peut corriger ou publier des missions. Une validation d'au moins **80/100** accorde les XP une fois, dans une transaction sécurisée.
- Le moteur de données simulées en `localStorage` a été supprimé.
- Les e-mails d'authentification sont envoyés par l'API avec le SMTP configuré ; vérifier leur réception sur un appareil réel.

**Aucun secret, e-mail de compte, mot de passe, token, clé API ou résultat individuel ne doit être commité dans ce dépôt.**

## Développement local

```bash
npm install
npm run dev
```

Configurer l'URL du backend pour le développement local. Les secrets d'application restent dans le `.env` du backend ; le frontend ne reçoit que des URL et ne contient aucune clé d'authentification.

```bash
npm run test:unit
npm run lint
npm run build
```

Les tests unitaires et la compilation doivent réussir avant publication.

## Lancement intensif et stratégie 360

Les nouveaux apprenants choisissent **3 à 7 jours fixes**, des jours facultatifs, et **5, 6, 8 ou 10 heures** de pratique par jour. Cette disponibilité est distincte du calendrier pédagogique et ne donne aucun XP automatiquement. Les anciennes préférences sont conservées jusqu’à leur mise à jour.

La feuille de route officielle de conception produit, 7 formations spécialisées, objectifs à 1 et 2 mois, architecture, UX/animations et audit Vercel/Proxmox se trouve dans **`docs/formation-pro-360-master-plan-v2.md`**.

## Documentation

- `docs/formation-pro-360-master-plan-v2.md` : vision 360, 7 spécialisations, 8 semaines pratiques, performance et infrastructure
- `docs/private-workspace-navigation.md` : accès privé, onglets des deux rôles et recette
- `docs/auth-signup-compatibility.md` : parcours d'inscription Node, récupération et confirmation des e-mails
- `docs/supabase-setup.md` : historique de l'ancienne architecture Supabase/Vercel
- `docs/proxmox-deployment.md` : conteneurs, réseau, domaines NPM et services systemd
- `docs/auth-migration.md` : sauvegarde préalable et import des comptes Node sans changer leurs UUID
- `docs/programme.md` : objectifs du parcours pédagogique

## Validation avant lancement élargi

Tester la connexion d'un nouvel apprenant, les cinq onglets sur téléphone,
la remise d'un vrai projet, les évaluations, la progression et la séparation
des droits entre un apprenant et un formateur. Les tests de compilation ne
remplacent pas la recette avec de vrais utilisateurs.
