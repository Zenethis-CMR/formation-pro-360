# Formation Pro 360 — Architecture active (novembre 2026)

> Ce document remplace l'ancienne description de démonstration `localStorage`
> et du déploiement Vercel. La référence de livraison est maintenant la
> combinaison des dépôts [frontend](https://github.com/Zenethis-CMR/formation-pro-360)
> et [backend](https://github.com/Zenethis-CMR/formation-pro-backend).
> Ce schéma décrit la configuration versionnée, pas une attestation de tous les
> parcours connectés : la recette avec des comptes réels demeure indispensable.

## Infrastructure et responsabilités

| Élément | Dépôt / service | Rôle |
| --- | --- | --- |
| Frontend | `formation-pro-360`, Next.js 15, CT410 | Interface, Server Components, actions serveur, navigation par rôle |
| API / Auth | `formation-pro-backend`, Fastify, CT420 | Identité, session opaque et JWT court, SMTP, proxy PostgREST |
| Métier | PostgreSQL local, CT420 | Comptes, profils, missions, livrables, correction, XP, planning |
| Exposition SQL | PostgREST sur CT420 | Routes `/rest/v1` et `/rpc`, contrôle RLS |
| TLS / Domaines | Nginx Proxy Manager | Frontend `formation.zenithis.tech`, API `formation-back.zenithis.tech` |
| Livraison | GitHub Actions sur `main` | Build et publication CT410 / CT420, services systemd, rollback ciblé |

Le frontend ne stocke ni clé d'authentification PostgREST ni mot de passe SMTP.
L'API conserve le secret de signature. Les Server Components demandent
l'identité et un jeton court au backend via le réseau privé.

```text
Navigateur
  └── Nginx Proxy Manager / TLS
      └── CT410 · Next.js
           ├── Session opaque HttpOnly
           ├── API interne CT420 · Fastify (/v1/auth/*)
           │    └── PostgreSQL : comptes et sessions
           └── API interne CT420 · /rest/v1/*
                └── PostgREST privé → PostgreSQL / RLS
```

## Parcours de session et autorisations

1. Inscription `POST /v1/auth/register` : création de l'identité puis vérification SMTP.
2. Connexion `POST /v1/auth/login` : mot de passe vérifié par Node,
   cookie de session opaque et HttpOnly.
3. Pages protégées : `requireRole()` vérifie la session et le rôle réel dans `profiles`.
4. Accès aux tables : Jeton JWT HS256 signé côté backend, valide **60 secondes** ;
   PostgREST exécute les policies RLS en fonction de l'utilisateur.
5. Correction : uniquement un rôle formateur peut valider un livrable ; la procédure
   PostgreSQL enregistre le score, le commentaire et les XP au seuil de **80/100**.
6. Les sessions et courriels sensibles ne sont jamais partagés avec les contenus publics.

**Lot V2 en cours** : `GET /v1/auth/session-context` permet de récupérer dans une
même requête l'identité vérifiée et le jeton court, avec `Cache-Control: no-store`.
La récupération `/me` + `/token` reste provisoirement disponible pour faciliter
l'ordre de déploiement. La mise en cache React côté Next.js est limitée à la
requête rendue, et ne remplace ni la vérification réelle ni RLS.

## Modèle pédagogique

```text
Mission publiée
 → Contrôle des prérequis
 → Atelier guidé / exercice autonome
 → Soumission du livrable
 → Correction critériée par un formateur
     ↳ >= 80/100 : XP attribué une seule fois, suite débloquée
     ↳ < 80/100 : reprise et nouvelle soumission
```

Les journées et horaires personnalisés sont stockés dans
`learner_preferences` : jours réguliers et facultatifs, sessions de 5–10 heures.
Les comptes historiques sans nouveau planning restent inchangés.

## Limites prouvées par le code et chantiers suivants

- Le frontend apprenant lance jusqu'à **11 requêtes PostgREST** au niveau de la
  page, en plus des cinq lectures du layout ; le formateur jusqu'à **13**
  lectures de page, plus trois du layout. Le nombre réel varie avec les vues.
- Les onglets sont séparés visuellement mais leurs requêtes ne sont pas encore
  entièrement découpées par usage. Il faut les charger **par onglet**, avec
  pagination pour les historiques.
- Le backend doit faire l'objet de tests d'intégration avec un PostgreSQL isolé
  avant de modifier davantage les contrats de données.
- La réussite d'un workflow GitHub Actions ne démontre pas l'import des comptes
  historiques depuis la base Supabase d'origine. L'import, s'il est requis,
  doit être vérifié séparément avec des sauvegardes et les mêmes UUID.
- Les politiques RLS doivent être testées en actes avec des comptes apprenant,
  formateur et non authentifié, y compris sur les RPC.

Voir [le plan directeur V2](./formation-pro-360-master-plan-v2.md),
[le chantier d'exécution V2](./v2-execution-cross-repo.md),
[les opérations Proxmox](./proxmox-deployment.md) et
[les limites de migration historiques](./auth-migration.md).
