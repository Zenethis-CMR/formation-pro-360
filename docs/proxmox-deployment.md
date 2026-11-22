# Déploiement Formation Pro 360 sur Proxmox

**Décision du 22 novembre 2026** : le frontend et l'API Node sont déployés dans deux CT Debian séparés. Le frontend utilise l'API Node pour les sessions et l'authentification. La base PostgreSQL Formation Pro doit être identifiée avant sa migration ; l'instance Supabase du CT 550 ne contient pas les tables Formation Pro et n'est pas utilisée sans vérification.

## Réseau et conteneurs

| Service | CT | Adresse privée | Port | Domaine Nginx Proxy Manager |
| --- | ---: | --- | ---: | --- |
| Frontend Next.js | 410 | `10.0.0.41/24` | 3000 | `formation.zenithis.tech`, `www.formation.zenithis.tech` |
| API Node.js | 420 | `10.0.0.42/24` | 3000 | `formation-back.zenithis.tech`, `www.formation-back.zenithis.tech` |

Les CT 410 et 420 sont non privilégiés, Debian 12, activés au démarrage et utilisent `vmbr0` avec `10.0.0.1` comme passerelle. Node.js 22 LTS est installé depuis les paquets NodeSource. Nginx Proxy Manager termine TLS ; les services écoutent sur le réseau privé. Les domaines et leurs certificats sont déjà gérés dans NPM.

## Déploiement GitHub Actions

Les workflows `.github/workflows/deploy.yml` des deux dépôts ne s'exécutent que sur `main` (ou par déclenchement manuel). Ils utilisent le runner auto-hébergé d'organisation déjà actif dans le CT 1480 (`Zenithis-Runner`, labels standards `self-hosted`, `Linux`, `X64`). Il n'y a ni branche `dev` ni cible de test. Le runner récupère le commit GitHub, construit le frontend ou l'API, transmet une version immuable au CT dédié puis vérifie le service après redémarrage.

La clé de déploiement SSH reste sur le runner auto-hébergé ; aucun secret SSH de Proxmox ou mot de passe de base n'est stocké dans GitHub Actions. Les secrets d'exécution restent dans les fichiers EnvironmentFile sur les CT. Le backend sauvegarde et vérifie PostgreSQL avant chaque migration.

Après un déploiement, chaque CT conserve cinq versions de l'application et nettoie les anciennes versions, ses fichiers temporaires ciblés et son cache npm local. L'API conserve les sauvegardes PostgreSQL 30 jours. Les scripts vérifient l'espace disque (seuils d'alerte 90 % sur les CT et 95 % sur le volume de sauvegarde). Aucun nettoyage global Docker, Proxmox ou des répertoires d'autres applications n'est exécuté.

## Frontend

`next.config.ts` active la sortie `standalone`. Le service systemd se trouve dans `deploy/formation-pro-360.service` et attend `/etc/formation-pro-360/frontend.env`, mode `0600`, sous un utilisateur système `formation360`.

Variables attendues :

- `SUPABASE_URL=http://10.0.0.42:3000` et `SUPABASE_PUBLISHABLE_KEY` : accès serveur à l'API PostgreSQL exposée par PostgREST derrière l'API Node et aux politiques RLS. Ces variables ne sont pas incluses dans le bundle navigateur.
- `FORMATION_API_INTERNAL_URL=http://10.0.0.42:3000` : appels serveur à l'API dans le réseau privé.
- `NEXT_PUBLIC_SITE_URL=https://formation.zenithis.tech` : liens de vérification et de récupération.

Le modèle prêt à compléter est [`deploy/frontend.env.example`](../deploy/frontend.env.example). `SUPABASE_PUBLISHABLE_KEY` doit contenir le JWT `anon` signé avec `SUPABASE_JWT_SECRET` du CT 420; seule cette clé publique à privilèges limités va dans le frontend. Le secret de signature reste sur le CT backend. Le fichier doit être copié en `/etc/formation-pro-360/frontend.env` puis protégé par `chmod 0640` et le groupe `formation360`.

Le cookie de session est `HttpOnly`, `Secure` en production et `SameSite=Lax`. Les pages Next transmettent ce cookie à l'API uniquement côté serveur.

## API et authentification

L'API Fastify écoute sur `0.0.0.0:3000`, son unité systemd est `deploy/formation-pro-backend.service`. Elle utilise un utilisateur système `formationapi` et `/etc/formation-pro-360/backend.env` en mode `0600`.

Variables sensibles attendues : `DATABASE_URL`, `SUPABASE_JWT_SECRET` et paramètres `SMTP_*`. Ne jamais mettre leurs valeurs dans Git, une image ou les journaux. La clé JWT est partagée avec PostgREST pour vérifier les jetons courts émis par l'API Node ; PostgREST applique les règles RLS existantes sur la base locale.

Le modèle backend à compléter est [`deploy/backend.env.example`](https://github.com/Zenethis-CMR/formation-pro-backend/blob/main/deploy/backend.env.example). Il ne contient aucune valeur de production et ne doit pas être copié tel quel pour démarrer le service.

Routes initiales :

- `GET /health/live` et `GET /health/ready` pour le contrôle de service.
- `POST /v1/auth/register`, `POST /v1/auth/login`, `POST /v1/auth/logout`.
- `POST /v1/auth/verify-email`, `POST /v1/auth/request-password-reset`, `POST /v1/auth/reset-password`, `POST /v1/auth/change-password`.
- `GET /v1/auth/me` pour la session et `GET /v1/auth/token` pour un JWT RLS valable une minute.

Les rôles de nouveaux comptes sont toujours attribués côté serveur (`learner`). Le client ne peut ni choisir ni modifier un rôle. Les jetons de session aléatoires sont stockés sous forme de condensat SHA-256 ; les mots de passe nouveaux sont hachés avec scrypt. Les hachages bcrypt existants sont acceptés pendant la transition.

## Procédure de publication

1. Construire les dépôts dans un checkout propre et copier la sortie standalone frontend, `public/` si présent, ainsi que `dist/`, `package.json` et la production install backend.
2. Créer les utilisateurs système, les répertoires `/opt/formation-pro-360` et `/opt/formation-pro-backend`, et les fichiers d'environnement root-only.
3. Appliquer la migration d'authentification après une sauvegarde PostgreSQL vérifiée. Importer les comptes historiques en conservant les UUID de `public.profiles`.
4. Activer les unités systemd, vérifier `/health/ready`, puis tester connexion, rôle, lecture RLS et récupération d'un compte historique avec un compte pilote.
5. Confirmer les certificats NPM et tester les deux domaines depuis l'extérieur. Garder Vercel comme point de retour jusqu'à validation des parcours et restauration de la sauvegarde.

La configuration NPM observée pointe actuellement vers les deux adresses et ports ci-dessus. Aucune bascule DNS ou suppression de données n'est nécessaire pour cette première publication.
