# Formation Pro 360 — Exécution V2 synchronisée entre frontend et backend

**Date : 22 novembre 2026.** Relevé établi en inspectant le code sur `main` des deux dépôts et leurs workflows GitHub Actions. Les constats documentent le dépôt et les statuts des builds, pas une recette applicative sur des comptes personnels.

## 1. État exact après la migration Proxmox

| Axe | État constaté dans les dépôts | Conséquence V2 |
| --- | --- | --- |
| Frontend | Next.js 15 / React 19 / PostgREST JS, déploiement CT410 | Optimisation Server Components, navigation par onglet et requêtes ciblées |
| Backend | Fastify 5 / Node.js 22 / PostgreSQL local, déploiement CT420 | Tests de sécurité et performance du proxy, sessions, SMTP |
| Authentification | API Node, cookie opaque, `formation_auth`; plus de Supabase Auth côté frontend | Les tests doivent vérifier Node + RLS ensemble |
| Données | Migrations `000` à `014` dans le dépôt backend, incluant droits PostgREST | Le backend devient **l'unique source de vérité** pour les migrations |
| Infrastructure | Nginx Proxy Manager, deux CT Proxmox, systemd, SSH | Diagnostics de latence réels avant toute décision d'upgrade |
| Livraison | Actions auto sur `main`, frontend GitHub hosted, backend self-hosted | **Aucune staging documentée** : sécuriser d'abord les changements |
| Comptes historiques | `002_import_legacy_accounts.sql` copie les `auth.users` de la **base locale où il s'exécute** | Il faut prouver qu'une sauvegarde de l'ancienne base a été restaurée ; le simple succès des migrations n'y suffit pas |

Les deux derniers workflows disponibles le 22 novembre se terminent avec succès :
- Frontend : `418a2cdccf1b`, [Action 45072814371](https://github.com/Zenethis-CMR/formation-pro-360/actions/runs/45072814371)
- Backend : `6f479299f834`, [Action 45076194767](https://github.com/Zenethis-CMR/formation-pro-backend/actions/runs/45076194767)

**À ne pas conclure** : les données d'origine, la vitesse perçue sur le réseau camerounais, les e-mails sortants et tous les droits RLS ne sont **pas** validés par ces deux builds.

### Flux de référence

```text
Navigateur → Nginx Proxy Manager → CT410 (Next.js)
                                     ↓ HTTP privé + cookie de session
                            CT420 (Fastify /v1/auth)
                                     ↓
                           formation_auth / PostgreSQL
                                     ↓ JWT à courte durée (60 s)
                               PostgREST + RLS
                                     ↓
                  profils, missions, ateliers, soumissions, XP
```

Le frontend appelle l'API en **server-side** via `FORMATION_API_INTERNAL_URL`. Le navigateur n'a pas accès aux secrets de signature, au SMTP ni au mot de passe PostgreSQL.

## 2. Ce qui est déjà acquis

- Connexion, inscription, vérification d'e-mail, récupération de mot de passe et session opaque dans l'API Node.
- Première formation « développement web » sur huit semaines ; 16 missions et ateliers pilotés dans PostgreSQL.
- Espaces apprenant/formateur distincts, suivi, badges, corrections, XP, planning et onboarding intensif.
- Déploiements Proxmox versionnés, sauvegarde préalable avant migrations backend, supervision minimale de disponibilité `/health/ready`.
- Backend avec politiques RLS et privilèges PostgREST explicitement accordés ; le contrôle métier des fonctions doit être testé.

Le plan directeur détaillé sur sept formations et le ratio **30 % raisonnement / 70 % pratique** restent dans `formation-pro-360-master-plan-v2.md`. La suite **ne recrée pas** ces éléments : elle les industrialise.

## 3. Lot A1 — Fiabiliser la session et réparer un parcours cassé (en cours dans les deux PR)

**Défauts observés**
- Middleware Next.js : un appel `/v1/auth/me` par navigation protégée.
- Layout + page : plusieurs `requireRole()` ; double récupération d'identité/profil.
- Chargement de l'accès SQL : appel `/v1/auth/token` séparé du `/me`.
- Page « Mon compte » : le formulaire omet `currentPassword`, alors que `POST /v1/auth/change-password` l'exige. La modification échoue légitimement côté API.

**Correctifs prévus dans les PR couplées**
1. Backend `GET /v1/auth/session-context` retourne `{user,accessToken,expiresIn}` en un seul aller-retour, avec vérification de session et `Cache-Control: no-store`.
2. Frontend réutilise ce contexte **uniquement pendant la requête Server Component** avec `React.cache` ; fallback `/me` + `/token` si l'ancien backend répond 404.
3. Middleware vérifie seulement l'existence du cookie pour rediriger vite. L'identité réelle et le rôle continuent d'être vérifiés dans le layout Next.js et chaque action serveur ; PostgREST conserve RLS.
4. Correction du formulaire et de l'action mot de passe : mot de passe actuel obligatoire pour une modification ; récupération par e-mail pour l'ancien compte sans secret.
5. CI sur chaque PR frontend/backend, tests des signatures JWT et invariants de sécurité.
6. Backend **déployé avant** frontend ou frontend déployé avec fallback de compatibilité. Conserver `/me` et `/token` jusqu'à vérification.

**Acceptation** : changement de mot de passe par compte de test, refus d'un ancien secret erroné, session fermée refusée, rôle apprenant incapable d'accéder aux données formateur, compilation et tests CI verts.

## 4. Lot A2 — Mesurer et supprimer la lenteur (priorité immédiate suivante)

Les requêtes actuelles sont la première piste tangible :
- `src/app/espace/apprenant/page.tsx` : **11 appels** PostgREST indépendants quel que soit l'onglet.
- `src/app/espace/formateur/page.tsx` : **13 appels** PostgREST, dont un historique jusqu'à **500 soumissions**.
- `src/app/espace/layout.tsx` : **5 appels** pour le profil apprenant ou **3** côté formateur, ajoutés sur chaque page.
- Ces chiffres sont **des appels déclarés dans le code**, pas des latences mesurées.

**Travaux** :
1. Instrumenter côté frontend les étapes **auth → profil → PostgREST → rendu** avec durée, route, statut et identifiant de corrélation (sans données personnelles ni secrets dans les logs).
2. Mesurer p50/p75/p95 depuis Douala : connexion, dashboard, changement d'onglet, chargement mission, correction.
3. Charger **seulement** les tables nécessaires au tableau de bord, à la progression, aux missions ou au programme ; ne plus charger badges, messages ou ateliers sur un onglet qui n'en a pas besoin.
4. Paginer les historiques formateur. Remplacer les listes de plusieurs centaines de lignes par compteurs/agrégations et sélections ciblées.
5. Vérifier la latence CT410 → CT420, le temps SQL PostgreSQL, `EXPLAIN (ANALYZE, BUFFERS)` et les politiques RLS des requêtes les plus coûteuses.
6. Ajouter un test de charge sur environnement **isolé** et des budgets Core Web Vitals, sans envoyer d'e-mails ni corriger de vraies soumissions.
7. Corriger les ralentissements confirmés avant tout achat de CPU/RAM ou nouvelle migration.

**Acceptation** : première mesure publiée avant/après et réduction démontrable des appels. Objectifs à valider sur les vrais appareils : LCP p75 sous 2,5 s, INP p75 sous 200 ms, CLS sous 0,1.

## 5. Lot A3 — Données historiques, accès, résilience

**Risque bloquant à clarifier avant recrutement massif** : la documentation backend confirme que l'import des comptes historiques nécessite les données de la source. Le script `002_import_legacy_accounts.sql` ne peut migrer que les identités présentes dans la base locale. **Ne jamais déclarer que les comptes historiques ont été conservés sans comparer les bases.**

Procédure sûre :
- Réaliser deux inventaires agrégés non nominatifs (source de référence et base locale) : `auth.users`, `profiles`, `submissions`, `xp_ledger`, `learner_preferences`.
- Contrôler l'identité des UUID d'une cohorte de test **sans divulguer de noms, e-mails ni tokens**.
- Vérifier les différences sous sauvegarde restaurable et corriger l'import seulement si une différence est prouvée, via procédure migratoire revue.
- Tester email vérification/oubli de mot de passe, anti-énumération et limites d'envoi SMTP.
- Tester RLS en lecture/écriture pour apprenant, formateur et invité, les RPC de notation et le verrouillage des prérequis.
- Préparer un environnement **staging** avec base anonymisée et GitHub Actions séparées : les deux dépôts livrent actuellement sur production lors d'un push `main`.
- Établir une restauration **testée**, une surveillance des processus et des alertes d'échec de sauvegarde.

## 6. Lot B — Moteur pédagogique d'ingénierie produit

La première formation doit remplacer la succession de missions techniques par un **projet fil rouge** passant par le problème utilisateur, les parcours UX, les données, les fonctionnalités, le design, les tests, le déploiement, les intégrations et l'offre commerciale.

**Phase B1 : modèle de contenu** (migration additive côté backend, aucun renommage de tables existantes) :
- `training_tracks` : parcours disponibles et version publiable ;
- `track_modules` : semaines et compétences ;
- `module_lessons` : leçons et ressources versionnées ;
- `enrollments` : accès des apprenants à un ou plusieurs parcours ;
- association non destructive des `missions` existantes aux nouveaux modules.

**Phase B2 : parcours 8 semaines** (enseignements démontrés, 70 % pratique, évaluation critériée) :
- **S1** : découverte produit, user research, carte des besoins, PRD, parcours et prototype.
- **S2** : premier flux métier utile en ligne avec Next.js, PostgreSQL/PostgREST ou API Node, auth et Git.
- **S3** : architecture back/front, qualité, responsive, sécurité, interactions et test.
- **S4** : MVP complet déployé, réellement essayé et documenté.
- **S5–S6** : marque, copywriting, canal d'acquisition, CRM, contenus IA, lancement d'une offre.
- **S7–S8** : tarification, vente, support, amélioration de la qualité et exploitation sur VPS/Proxmox.

**Jalon pédagogique** : MVP utilisable au mois 1, première activité de commercialisation au mois 2 ; aucune garantie de revenus. Objectif de validation : produit livré, tests prouvés, démo et maîtrise démontrée.

## 7. Lot C — Expérience premium et animations

États de mission et jalons visibles ; design system commun apprenant/formateur ; animation contextuelle à la validation **réelle** ; interactions finement animées pour l'accomplissement ; espace portfolio, présentation des livrables, progression visuelle.

**Contraintes** : animations non bloquantes, `prefers-reduced-motion`, accessibilité clavier, charges réseau minimales et aucun affichage de réussite qui contourne le verdict du formateur.

## 8. Lot D — Offres et sept formations 360

Construire d'abord **une formation d'ingénierie produit excellente**. Puis factoriser le moteur de cours et ouvrir séparément UX/UI, communication et copywriting IA, marketing IA, automatisation/agents, infrastructure/DevOps et entrepreneuriat.

Le choix du parcours, les droits d'accès, les paiements et les réductions doivent être gérés par l'API et les règles PostgreSQL, non par des conditions d'affichage frontend. Choisir des passerelles de paiement adaptées aux marchés cibles avant de coder.

## 9. Ordre des PR et critères de publication

| Ordre | Dépôt | Changements | Condition de passage |
| --- | --- | --- | --- |
| A1.1 | Backend | Session unique, signatures testées, PR CI | Build + tests, compatibilité des routes existantes |
| A1.2 | Frontend | Réutilisation session/profil, mot de passe actuel, PR CI | TypeScript + tests + connexion test sans régression |
| A2.1 | Frontend | Découpage des requêtes par onglet | Comparaison du nombre de requêtes, tests utilisateur |
| A2.2 | Backend | Mesures HTTP/SQL, pagination et index justifiés | Analyse de latence et contrôle RLS |
| A3 | Les deux | Staging, sauvegardes, recette de migration des historiques | Sauvegarde restaurée et tests de sécurité |
| B | Backend puis frontend | Catalogue, modules, projets et ateliers 360 | Une cohorte pilote termine un parcours complet |
| C–D | Les deux | Animations, modèles multi-parcours et paiement | Fiabilité, accessibilité et résultats mesurés |

**Définition de terminé** : le code compile, les tests passent, les contrats backend/frontend sont compatibles, les données existantes ne sont pas écrasées, les vérifications de sécurité par rôle sont réalisées et la production est contrôlée après déploiement.

## 10. Informations d'exploitation à confirmer

1. Vérifier la **migration effective des anciennes données Supabase** : le dépôt ne permet pas de la déduire.
2. Confirmer si une **instance staging** distincte peut être provisionnée (recommandé avant nouveaux schémas).
3. Réaliser un relevé chronométré sur une véritable session à Douala avant tout autre jugement sur l'hébergement.

**Note** : ne pas partager de fichiers `.env`, cookies de session, clés de déploiement, JWT, exports de base contenant des informations personnelles ni secrets SMTP dans les issues, PR ou discussions.
