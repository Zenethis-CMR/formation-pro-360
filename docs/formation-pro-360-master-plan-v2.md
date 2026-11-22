# Formation Pro 360 — Plan directeur produit, pédagogie et infrastructure (v2)

**Date de cadrage : 22 novembre 2026.** **Statut : vision pédagogique et produit à réaliser progressivement.** L'application a entretemps basculé sur deux CT Proxmox, avec un backend Node/Fastify et PostgreSQL local. Pour les constats validés sur les deux dépôts, les correctifs et l'ordre des livraisons, consulter [l'exécution V2 multi-dépôts](./v2-execution-cross-repo.md). Les plans de migration antérieurs ne sont plus des instructions de déploiement.

## 1. Vision, impératifs et résultats mesurables

Former non pas des « tapeurs de code », mais des **ingénieurs produits polyvalents et des créateurs d'activités** qui savent identifier un problème, concevoir une solution, en maîtriser l'expérience, la développer avec l'assistance de l'IA, la déployer, la rendre visible, puis la vendre et l'améliorer.

Trois jalons du **premier parcours : Ingénierie produit et IA** :
1. **Au jour 14** : un parcours utilisateur de bout en bout fonctionnel, observable et déployé. Ce n'est pas encore un produit complet.
2. **À la fin du premier mois** : un **produit MVP complet et structuré** en ligne, avec sa proposition de valeur, navigation, comptes si nécessaires, données, un flux essentiel testé, suivi des erreurs, déploiement reproductible et premiers retours utilisateurs.
3. **À la fin du deuxième mois** : une **offre commercialisable**, une campagne d'acquisition mesurable, des prospects, une démonstration crédible et les premiers essais de vente. La recette est un objectif à tester et non une garantie.

Un produit complet ici = une fonctionnalité métier centrale **qui fonctionne réellement**, pas vingt modules superficiels. Un MVP peut être petit, mais doit être cohérent, accessible, sécurisé selon son risque, déployable et utilisable par un véritable client.

**Règle transversale : environ 30 % d'apports structurants (raisonnement, analyse, UX, architecture, explication) et 70 % de production pratique** (prototypage, tests, implémentation assistée par IA, validation, déploiement, vente). L'apprenant explique les choix et sait reproduire les étapes : le code généré par l'IA n'exonère ni des contrôles ni de la compréhension.

### Cadence intensive adaptable

- **Jours réguliers : 3 à 4 par semaine par défaut**, avec possibilité de 3 à 7 jours ; les autres jours peuvent être déclarés facultatifs.
- **Durée de séance sélectionnable : 5, 6, 8 ou 10 heures** ; aucun nouvel onboarding ne propose 30 à 120 minutes.
- Exemple d'emploi du temps : **mardi, jeudi, samedi** fixes, **dimanche** en renfort. Ce choix est individuel, jamais appliqué arbitrairement à tous.
- Pour une séance de 5 heures : **1 h 30 maximum d'explication guidée / de réflexion structurée** et **3 h 30 de travaux pratiques**. Pour une séance de 8 heures : 2 h 24 d'apports et 5 h 36 de réalisation.
- Le planning correspond à un engagement **déclaré** et reste modifiable. Les séances à longue amplitude incluent des pauses et des conditions de travail soutenables ; ce sont les livrables, la maîtrise et la qualité qui sont évalués, pas le renoncement au sommeil.
- Le formateur peut convenir d'une disponibilité individuelle, organiser un rattrapage et adapter la charge aux contraintes réelles de l'apprenant.

**Important** : ne pas confondre « temps souhaité », « temps observé » et « compétence maîtrisée ». Pas d'XP automatiques pour avoir déclaré une longue séance.

## 2. Produit pédagogique : architecture 360 en sept formations

Le système doit distinguer trois concepts :
- **Rôle d'accès** : apprenant, formateur, administrateur, puis mentor / organisation.
- **Parcours souscrit** : la formation achetée ou attribuée ; un apprenant peut suivre plusieurs parcours.
- **Compétences / modules** : des unités pédagogiques réutilisables entre parcours.

Sept **formations complètes**, chacune livrant un projet et intégrant les fondamentaux transversaux plutôt qu'un simple catalogue de vidéos :

| Parcours 360 | Approfondissement | Projet final vérifiable |
| --- | --- | --- |
| 1. Ingénierie produit et IA | Discovery, logique produit, UX, front, back, Supabase, sécurité, tests, déploiement, acquisition initiale | Application SaaS ou outil métier en production |
| 2. Design produit, UX/UI et motion | Research, identité visuelle, Figma, design system, micro-interactions, accessibilité, animation responsable | Prototype haute fidélité puis design system livré dans un produit |
| 3. Copywriting, communication et contenu IA | Positionnement, persuasion éthique, marque, storytelling, SEO, automatisation éditoriale | Système éditorial et parcours de conversion mesuré |
| 4. Marketing, acquisition et IA | Segmentation, offres, créatifs, acquisition organique/payant, CRM, attribution, analyse | Campagne multicanal documentée avec indicateurs réels |
| 5. Automatisation, intégrations et agents IA | APIs, webhooks, intégrations, orchestration, agents, évaluation, fiabilité et permissions | Automatisation métier supervisée et observable |
| 6. Infrastructure, DevOps et cybersécurité | Git, CI/CD, Vercel, VPS, Proxmox, Docker, sauvegardes, monitoring, SSL/TLS | Déploiement reproductible et résilient d'un produit |
| 7. Entrepreneuriat numérique et monétisation | Recherche marché, prix, vente, paiement, contrats, relation client, support, croissance | Offre commercialisée avec entonnoir et apprentissages vérifiés |

**Ordre de mise en place** : rendre le parcours n°1 excellent, constituer un noyau partagé (produit, UX, IA, sécurité, vente), puis ouvrir progressivement les six spécialisations. **Pas** sept parcours incomplets lancés simultanément.

Le budget et le profil de l'inscrit influencent son parcours initial ; les droits d'accès, les règlements et les prérequis sont contrôlés côté serveur. La pédagogie inclut le français en priorité, puis les autres langues seulement lorsque le contenu est vérifié.

## 3. Parcours intensif « Ingénierie produit et IA » : 8 semaines / 56 jours calendaires

La formation évolue selon les **jours de séance déclarés**, pas une obligation d'être connecté les 56 jours. Les évaluations s'appuient sur des objectifs hebdomadaires et sur des livrables. Le « jour 14 » est un jalon calendaire à adapter aux 3-4 séances effectivement réalisées.

| Semaine | Ce qui s'apprend | Livrable pratique / critère de passage |
| --- | --- | --- |
| S1 : comprendre le problème | Cible, interviews, problème, PRD court, logique métier, parcours utilisateur, Figma, proposition de valeur | Problème validé, carte de parcours, prototype cliquable, repository Git |
| S2 : premier flux utile | Architecture simple, React/Next.js, Supabase, schéma de données, authentification, IA comme copilote, qualité du code livré | Un scénario utilisateur complet fonctionne sur une URL Vercel |
| S3 : rendre le produit solide | CRUD métier, UX/UI responsive, états vides et d'erreurs, accessibilité, RLS, tests automatiques, notifications/intégrations | Parcours essentiel testé de bout en bout et corrigeable |
| S4 : livrer un MVP complet | Analyse des données, logs, sécurité, gestion des versions, déploiement, performance, support, démo | MVP public ou à accès contrôlé, documentation, test avec utilisateurs réels |
| S5 : trouver son marché | Offre, copywriting, SEO, landing page, analytique, activation, questionnaire clients | Page d'offre, 10 conversations/prospects ciblés, suivi de conversion |
| S6 : attirer et engager | Marketing IA, contenus, créatifs, automatisations supervisées, CRM, e-mails, instrumentation | Une campagne test et un circuit prospect → démonstration mesurés |
| S7 : vendre et apprendre | Pricing, objections, facturation/paiement adaptés au marché, onboarding clients, pilotage | Offre facturable, premiers essais de vente, journal des objections |
| S8 : améliorer et exploiter | Fiabilité, mesures de satisfaction, optimisation, VPS/Proxmox, sauvegardes, runbook, coûts | Produit renforcé, documentation d'exploitation, preuves d'acquisition |

**Revue hebdomadaire obligatoire** : démonstration de l'apprenant, questions d'architecture et de logique, revue du code et des prompts, validation UX, sécurité, test et documentation. Le formateur peut exiger une reprise. Un travail soumis n'équivaut pas à un travail validé.

**Conditions de réussite** : score de 80/100 minimum sur rubriques explicites ; restitution orale ou vidéo courte ; preuve de fonctionnement ; contrôle des prérequis ; feedback reproductible. Aucun crédit fictif pour une tâche simplement cochée.

## 4. Expérience apprenant : une vraie plateforme d'entraînement

### Accueil et personnalisation
- Identité et objectifs, niveau initial, **jours fixes et facultatifs**, durée de séance, contraintes / matériel si utile.
- Choix du parcours (quand plusieurs parcours seront publiés), aperçu transparent des débouchés et engagements.
- Diagnostic pratique initial : raisonnement produit, outils, logique, UX, données, Git, autonomie avec IA.
- Planning personnalisé qui s'adapte aux jours réguliers, sans déclarer du retard sur les jours facultatifs.
- Accès continu aux comptes historiques : les données anciennes ne sont ni inventées ni écrasées.

### Sur chaque atelier
1. Problème utilisateur et résultat attendu.
2. Mini-leçon ciblée avec exemple concret ; objectifs de compréhension mesurables.
3. Exercice guidé → exercice autonome → amélioration à proposer.
4. Outils et assets (Figma, GitHub, VS Code, Supabase, Vercel, IA) ; liens sources à jour.
5. Éditeur de rendu, dépôt GitHub, URL déployée, capture / vidéo, checklist de tests.
6. Grille d'évaluation, commentaires précis, version corrigée et validation définitive.
7. Déblocage du chapitre suivant seulement après maîtrise des prérequis.

### Effets visuels et gamification de qualité
- Design system et tokens partagés ; typographie, hiérarchie, grilles et états cohérents.
- Micro-interactions élégantes (survols, progression animée, transitions de pages, cartes évolutives).
- Animation exceptionnelle **à la validation authentique** d'une mission ou d'un jalon : XP qui montent, badge qui apparaît, célébration brève et contextualisée.
- Respect de « prefers-reduced-motion », évitement du mouvement constant, de l'audio imposé et des animations bloquantes.
- Animation légère via CSS et librairie ciblée uniquement lorsque justifié ; pas de vidéos lourdes en première ouverture.
- Version mobile, clavier, lecteurs d'écran, et dégradation gracieuse sur appareils moins performants.

## 5. Expérience formateur et administration

### Formateur
- Tableau « à corriger aujourd'hui », filtre par cohorte/mission/urgence réelle.
- Dossier apprenant : objectifs, disponibilité, parcours, projets, erreurs récurrentes, feedback et compétences prouvées.
- Constructeur de leçons versionné : objectifs, quiz, défis, supports, grille, prérequis, publication.
- Planning des séances par disponibilité déclarée et capacité du formateur.
- Corrections critériées, demandes de reprise, visioconférences facultatives, commentaires et notifications.
- Tableaux de qualité : délai de correction, abandon de mission, satisfaction, répétition des erreurs, heures de pratique déclarées distinctes des preuves d'activité.

### Administration (nouveau rôle à concevoir)
- Gestion des formations, des versions de cours, des enseignants, de la facturation et des promotions.
- Admission/inscription, affectation de cohorte et attribution de parcours, invitations.
- Droits et permissions par organisation ; journal d'audit sur les actions sensibles.
- Back-office de contenus, modération des livrables, gestion des incidents et tickets de support.
- Tableau de bord économique sans exposer les données privées des apprenants.

## 6. Architecture cible : modularité avant microservices

**Décision confirmée le 22 novembre 2026** : séparer le frontend Next.js et l'API Node.js dans deux CT Proxmox (410 et 420), sans multiplier les services métier. Le backend Node/Fastify prend en charge l'authentification, les sessions et l'envoi d'e-mails via SMTP, à la place de Supabase Auth. La base PostgreSQL Formation Pro doit être identifiée avant sa migration ; l'instance Supabase du CT 550 ne contient pas les tables Formation Pro et n'est pas utilisée sans vérification. L'API conserve les UUID de `profiles` et signe des JWT Supabase très courts pour maintenir l'application des politiques RLS, sous réserve que le projet source expose une clé de signature compatible. La bascule est conditionnée par une sauvegarde restaurable, l'import des comptes et la validation des parcours.

Le monolithe API reste modulaire ; ne pas multiplier les microservices avant d'avoir des charges et des frontières métier documentées.

Modules :
- Identités, rôles et droits ; comptes, organisations, cohor­t­es et droits de formation.
- Catalogue de formations et **versions de contenu**, cours, chapitres, ateliers, dépendances.
- Inscriptions, objectifs, disponibilité hebdomadaire, sessions programmées.
- Soumissions, évaluations, rubriques, XP, badges et portfolio.
- Messagerie pédagogique, rappels, notifications et calendriers.
- Paiements, abonnements/offres, factures et suivi de droits d'accès.
- Analytics produits / pédagogiques, audit sécurité, administration et observabilité.
- Intégrations avec GitHub, environnements de pratique et fournisseurs IA, avec secrets exclusivement serveur.

**Schéma d'évolution proposé, pas encore migré** : `training_tracks`, `track_versions`, `course_modules`, `lesson_versions`, `enrollments`, `cohorts`, `cohort_sessions`, `entitlements`, `orders`, `payment_events`, `audit_log`. Conserver les tables existantes (`missions`, `profiles`, `submissions`, `xp_ledger`, etc.) et introduire des relations de compatibilité plutôt que de renommer/supprimer brutalement.

Intégration IA : tutorat socratique, revue d'architecture, aide UX, génération de cas de test et de variantes de copywriting. Toujours conserver la validation humaine et des jeux de tests. Interdire aux agents de déployer en production, de dépenser en publicité, de contacter des clients ou de modifier des permissions sans contrôle explicite.

## 7. Performance : mesurer et optimiser l'architecture Proxmox désormais active

### Constats vérifiables dans le code actuel
- `src/app/espace/layout.tsx` déclenche **5 requêtes PostgREST** apprenant ou **3** formateur pour le rail. Les pages ajoutent respectivement jusqu'à **11** et **13 requêtes** avant découpage par onglet.
- Les pages de profil réexécutent un `requireRole()` et chargent de **nombreuses tables**, parfois même lorsque l'onglet affiché n'en a pas besoin.
- Il existe donc un surcoût potentiel de latence pour l'authentification, les appels CT410 → CT420, PostgreSQL et le rendu serveur. **Les workflows Proxmox actuels sont verts, mais les latences de production n'ont pas encore été mesurées.**
- Next.js et PostgreSQL sont configurés sur des CT distincts dans le même réseau privé. Il faut mesurer le temps de route, les pools SQL, le proxy PostgREST et les différents profils de réseau externe avant de chercher une nouvelle infrastructure.

### Mesures à recueillir avant toute nouvelle décision d'hébergement
- Depuis Douala et une seconde région : navigation réelle, réseau mobile et bureau, nouveau/ancien visiteur.
- TTFB froid/chaud, p50/p75/p95 des routes, durée de `/v1/auth/session-context`, nombre et durée des requêtes PostgREST/SQL, waterfall des bundles, typographies et images.
- Web Vitals : LCP, INP, CLS, temps de navigation entre onglets.
- Charges : 10, 50 et 200 utilisateurs actifs simulés **uniquement en environnement de test**, sans envoyer d'e-mails réels.
- Analyse des requêtes lentes Supabase et instrumentation des opérations clés.
- Établir un **point zéro mesuré** puis viser LCP p75 < 2,5 s, INP p75 < 200 ms, CLS < 0,1, et un ressenti fluide sur réseau mobile. Ces seuils sont des objectifs, non des résultats déjà atteints.

### Correctifs dans cet ordre
1. Couper les requêtes inutiles **par onglet**, paginer les historiques, limiter les colonnes et la portée des lectures.
2. Mutualiser l'identité de session dans la requête, inspecter les deux contrôles de rôle du layout et de la page.
3. Ajouter des indexes **après EXPLAIN ANALYZE**, pas « à l'aveugle » ; vérifier les politiques RLS et les paramètres de connexion.
4. Corriger les régions d'exécution (Vercel/Supabase), mesurer réseau Douala ↔ datacenter, éviter les appels serveur séquentiels.
5. Optimiser les assets, les polices, le JavaScript client et les animations ; utiliser cache adapté sans mettre les données privées dans un cache public.
6. Définir des budgets de performance bloquants en CI et une surveillance après publication.

### Choix d'hébergement
| Option | Atouts | Contraintes |
| --- | --- | --- |
| Vercel + Supabase géré | Livraison rapide, previews, gestion SSL/CDN, exploitation réduite | Cold starts, région/facturation et plafond de ressources à inspecter |
| VPS OVH / Contabo + Supabase géré | Plus de contrôle sur le runtime, coût potentiellement prévisible | Administration OS, sécurité, sauvegardes, pare-feu, supervision |
| VM sous Proxmox + Supabase géré | Contrôle total des VM, snapshots, réseau et orchestration maison | Infrastructure hôte, disponibilité, Internet, PRA et maintenance à assumer |
| VM Proxmox + base PostgreSQL auto-hébergée | Contrôle complet des données et du déploiement | Risque opérationnel nettement plus élevé : base, réplication, stockage, restore, secrets |

**Proxmox VE est d'abord un hyperviseur, pas un « VPS » en soi.** L'architecture active utilise CT410 et CT420 derrière Nginx Proxy Manager, avec PostgreSQL local. Le maintien effectif d'une solution Vercel de retour arrière doit être vérifié, et non supposé. Priorité : diagnostic, staging et restauration testée.

Une migration vers un serveur physiquement plus proche des apprenants peut accélérer les assets mais ralentir les requêtes vers une base distante : seule la mesure de bout en bout permet de trancher.

## 8. Plan de réalisation de la plateforme (roadmap d'ingénierie)

Les délais ci-dessous sont des **estimations d'ordonnancement à réviser** après mesure du backlog et de la capacité de développement, et sont distincts du parcours de huit semaines suivi par l'apprenant.

### Lot A — Fondations et confiance (priorité immédiate)
- Onboarding intensif : jours fixes/facultatifs, 5–10 h, validation SQL et visibilité formateur. **Déjà versionné dans les deux dépôts**, à confirmer avec un apprenant sur le serveur actuel.
- Recette du parcours Node : inscription, cookie, récupération du mot de passe, SMTP configuré sur CT420, contrôles de rôle RLS, mobile, sauvegarde PostgreSQL et journaux d'erreur.
- Audit de lenteur avec mesures reproductibles et deux optimisations à fort impact.
- Uniformiser les onglets et fiabiliser les états vides/erreurs.

### Lot B — Première formation vraiment complète
- Modèle « formation → modules → ateliers », publication versionnée et suivi des prérequis.
- Transformer l'actuel calendrier en **programme d'ingénierie produit** avec contenu UX, logique métier, IA, back/front, tests, déploiement et vente.
- Éditeur formateur robuste : supports, exercices, démonstration, rubriques et corrections.
- Projet fil rouge choisi par l'apprenant, validation du MVP au mois 1.

### Lot C — Accompagnement et produit final
- Portfolio de projets, vidéos/URL GitHub, preuves de déploiement, revues et feedback.
- Suivi du planning individuel et sessions de cohorte ; rappels utiles sans fausses alertes.
- Expérience visuelle premium avec animations de progression accessibles.
- Mesures pédagogiques réelles, prévention de la fraude aux XP, contrôle des badges.

### Lot D — Business et monétisation
- Offres, tarifs, facturation et droits de formation contrôlés serveur.
- Parcours de paiement adaptés aux pays réellement ciblés (évaluer MTN/Orange Mobile Money et prestataires disponibles avant intégration).
- Premier CRM, intégration des prospects, mini-funnels, page de vente, analytics.
- Validation des transactions, webhooks idempotents, remboursements, audits et protection des données.

### Lot E — Plateforme multi-formations
- Déployer les six autres parcours **après le noyau produit**.
- Multi-cohortes, catalogue public de présentation commerciale (distinct des contenus privés), droits par achat, versions et certificats.
- Productivité IA : studios de contenus, vidéo IA, automatisations et publicité avec consentement et garde-fous budgétaires.

### Lot F — Infrastructure et exploitation industrielle
- Optimisation Vercel+Supabase selon métriques ; POC VPS/VM Proxmox ; décision chiffrée.
- CI/CD, tests E2E, tests de sécurité, monitoring, alertes, back-up et restauration.
- Runbooks, contrôles secrets, durcissement SSH, sauvegardes hors site, rollback et plan de reprise.

## 9. Qualité, critères d'acceptation et gouvernance

**Chaque fonctionnalité** doit être prête pour de vrais utilisateurs, pas seulement pour une capture : vérification des rôles, tests unitaires et E2E, mobile, accessibilité, états vides/erreurs, performance mesurée, logs et documentation de la recette.

**Chaque module pédagogique** doit avoir : une compétence cible, un brief produit, une tâche de 70 % de pratique, un livrable réel, une grille de correction, des exemples de bonnes et mauvaises réponses, les prérequis et une activité de consolidation.

**Tableau d'objectifs opérationnels** :
- Activation : proportion des nouveaux inscrits terminant l'onboarding et ouvrant un premier atelier.
- Pratique : séances prévues vs séances réellement déclarées, avec distinction explicite.
- Apprentissage : maîtrise de chaque compétence, temps de correction, reprises et réussite des missions.
- Produit : part des apprenants qui livrent un MVP fonctionnel avant la fin du mois 1.
- Business : part ayant lancé une offre avant fin mois 2, prospects contactés, essais, taux de conversion, chiffre d'affaires **réel**.
- Technique : p75/p95 de temps de réponse, taux d'erreurs, disponibilité, temps moyen de restauration, coût par utilisateur actif.

**Définition de terminé** pour un lot : code fusionné, build vert, RLS conforme, recette E2E, comportement mobile, métriques observables, instructions documentées, et absence de régression sur les comptes et l'historique.

## 10. Trois décisions à valider

1. Le produit fil rouge commun doit-il être **au choix de chaque apprenant** dans une catégorie approuvée, ou une application métier définie par le formateur pour toute la cohorte ?
2. Pour la V1, quelle cohorte pilote de **3–10 personnes** et quelle méthode de paiement convient au marché cible (Cameroun, Nigeria ou plusieurs pays) ?
3. L'import des identités et progressions de l'ancienne base Supabase vers PostgreSQL local a-t-il été contrôlé par inventaire d'UUID, sauvegarde et parcours pilote ? **Aucun état de build ne peut remplacer cette vérification.**

**Principe de priorité** : ne pas ouvrir sept parcours pour masquer un parcours central incomplet. D'abord construire une excellente école d'ingénierie produit, puis industrialiser la structure pour les autres métiers.
