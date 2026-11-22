# Déploiement Formation Pro 360 sur Proxmox

## Architecture en production

| Service | CT | Adresse privée | Port | Domaine Nginx Proxy Manager |
| --- | ---: | --- | ---: | --- |
| Frontend Next.js | 410 | `10.0.0.41` | 3000 | `formation.zenithis.tech`, `www.formation.zenithis.tech` |
| API Node.js/Fastify | 420 | `10.0.0.42` | 3000 | `formation-back.zenithis.tech`, `www.formation-back.zenithis.tech` |

Nginx Proxy Manager termine TLS. Les domaines et certificats sont gérés dans NPM. PostgreSQL et PostgREST sont utilisés par l'API sur le CT420 ; l'API contrôle les appels `rest/v1` et relaie les demandes autorisées au service PostgREST privé.

**L'authentification est fournie par l'API Node.js.** Connexion, inscription, session, vérification d'e-mail, réinitialisation du mot de passe et rôles passent par `/v1/auth/*`. Supabase Auth, ses sessions et son SDK navigateur/SSR ne font pas partie du flux de connexion. Le frontend utilise un client PostgREST côté serveur pour interroger l'API privée avec un jeton court émis par Node ; ce client ne gère aucune identité.

## Publication depuis GitHub

Les mises en production partent uniquement de la branche `main` des dépôts GitHub. Un push sur `main` déclenche le workflow correspondant ; `workflow_dispatch` permet aussi un lancement manuel. Il n'existe pas de cible de test.

- Le dépôt frontend construit Next.js sur un runner GitHub hébergé, puis déploie sur CT410 via SSH. Le secret `FORMATION_PRO_DEPLOY_KEY` est enregistré dans les secrets Actions du dépôt frontend.
- Le dépôt backend compile l'API sur le runner Linux auto-hébergé et déploie sur CT420. Son workflow sauvegarde PostgreSQL avant les migrations.
- Chaque livraison est versionnée par SHA GitHub. Le service est redémarré et contrôlé par un endpoint de santé ; le déploiement garde la version précédente pour permettre un retour arrière.

Les modifications applicatives ne se font pas directement sur les CT. Les fichiers d'environnement et les éléments d'exploitation installés une fois sur chaque CT restent gérés sur la machine, et ne contiennent jamais de valeurs secrètes dans Git.

## Configuration des CT

Les services systemd chargent leur configuration depuis :

- CT410 : `/etc/formation-pro-360/frontend.env` (droits `0600`). Il contient uniquement `FORMATION_API_INTERNAL_URL=http://10.0.0.42:3000` et `NEXT_PUBLIC_SITE_URL=https://formation.zenithis.tech`.
- CT420 : `/etc/formation-pro-360/backend.env` (droits `0600`). Il contient `DATABASE_URL`, le secret de signature JWT utilisé par Node et PostgREST, la clé d'accès PostgREST ainsi que la configuration SMTP.

Les noms existants `SUPABASE_JWT_SECRET` et `POSTGREST_ANON_KEY` sont des paramètres techniques du jeton PostgREST et de son rôle anonyme. Leur présence ne signifie pas que Supabase Auth est utilisé : Node signe les jetons de base de données à partir de l'utilisateur et de son rôle. Tous les secrets applicatifs restent dans le fichier d'environnement du backend ; le frontend ne détient que les deux URL ci-dessus.

Le modèle frontend est [`deploy/frontend.env.example`](../deploy/frontend.env.example). Le modèle backend se trouve dans le dépôt [`formation-pro-backend`](https://github.com/Zenethis-CMR/formation-pro-backend/blob/main/deploy/backend.env.example). Ces fichiers d'exemple ne sont pas des configurations de production.

## Nettoyage et conservation

Après un déploiement, chaque CT conserve les cinq dernières versions et supprime les anciennes versions, les archives de livraison temporaires et son cache npm ciblé. Le backend conserve les sauvegardes PostgreSQL pendant 30 jours. Les scripts signalent le manque d'espace disque. Ils ne suppriment pas les données applicatives, les volumes Proxmox, les images système ni les fichiers d'autres services.

## Vérifications après publication

Les Actions contrôlent le démarrage local des services. Les contrôles fonctionnels de production se font ensuite sur les domaines publics :

- `https://formation.zenithis.tech/login` doit afficher connexion et inscription ;
- `https://formation-back.zenithis.tech/health/ready` doit répondre correctement ;
- l'inscription, la vérification d'adresse, la connexion, la récupération de mot de passe et l'accès aux espaces doivent être vérifiés avec les comptes de test autorisés.

Les rôles formateur ne peuvent être attribués que côté administration ; une inscription publique crée un compte apprenant.
