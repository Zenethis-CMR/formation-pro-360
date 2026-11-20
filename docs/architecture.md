# Formation Pro 360 — architecture V1

## Flux pédagogique

```text
Mission publiée
  → prérequis validés ?
    → oui : disponible
    → non : verrouillée
  → soumission d'un livrable (lien + note)
  → statut « en évaluation »
  → correction du formateur (note /100 + commentaire)
    → note >= 80 : validée, XP attribués, nouvelles missions débloquées
    → note < 80 : correction demandée, nouvelle soumission possible
```

Une mission rapporte ses XP **une seule fois**, après validation. Le score ne représente pas un jugement sur la personne : il mesure seulement la réussite d'une mission donnée.

## Structure actuelle (démo)

- Next.js App Router et TypeScript.
- `/apprenant` et `/formateur` sont des **interfaces de démonstration ouvertes**.
- `src/data/missions.ts` contient le modèle de compétence et les missions initiales.
- `src/lib/mission-engine.ts` centralise les règles de progression, des prérequis, des états et des XP.
- `src/context/demo-store.tsx` stocke en local les missions ajoutées, soumissions et évaluations, uniquement dans le navigateur.

**Limites :** aucune authentification, aucun contrôle d'accès serveur, aucune synchronisation inter-appareils, aucune traçabilité immuable, aucune donnée réelle à collecter dans cette V1.

## Architecture cible

1. Authentification vérifiée côté serveur : comptes formateur et apprenant.
2. PostgreSQL :
   - `users` : identités et rôles.
   - `cohorts` et `memberships` : groupes d'apprentissage.
   - `missions` et `mission_prerequisites` : contenu pédagogique et dépendances.
   - `submissions` : liens et preuves déposés par les apprenants.
   - `reviews` : notes, commentaires, date et auteur de l'évaluation.
   - `xp_ledger` : attribution auditée d'XP (une seule fois par validation).
3. Autorisations serveur : seul un apprenant peut modifier ses brouillons/soumissions ; seuls les formateurs autorisés peuvent évaluer ; les documents et résultats ne sont accessibles qu'aux personnes autorisées.
4. Mutations transactionnelles pour évaluation, attribution XP et déblocage de missions.
5. Tests : parcours de bout en bout, permissions, score minimal, prérequis, révisions, cas d'échec.

## Livraison / CI-CD

Le dépôt GitHub est lié au projet Vercel `formation-pro-360`. Chaque push sur `main` crée un déploiement de production. Pour la V1 réelle, ajouter revues GitHub, tests CI et protection de branche afin d'éviter de déployer du code incomplet automatiquement.

## Cadence

- S1 : interfaces et diagnostic des acquis.
- S2 : première mini-application autonome.
- S3–S4 : architecture front-end, tests, premières applications complètes.
- S5–S6 : back-end, données persistantes, contrôle d'accès.
- S7–S8 : lancement d'un MVP démontrable et évaluations.

Les journées de mardi, jeudi et samedi sont dédiées à la pratique ; les cours scolaires restent prioritaires le reste de la semaine, avec une récupération suffisante.
