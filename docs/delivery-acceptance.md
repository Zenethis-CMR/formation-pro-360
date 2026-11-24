# Formation Pro 360 — fiche de clôture et recette

## Ce que couvre le code
- Catalogue public, connexion, confirmation et sélection du parcours.
- Inscription gratuite avec consentement et contrôle formateur; aucune ouverture automatique.
- Onboarding, planning selon charges officielles ou estimations identifiées, dashboard et navigation.
- Studio, carnet, coach, preuves, évaluations, dossier, backlog, portfolio et partage révocable.
- Suivi formateur, séances, défis, blocages, revues, rapports, qualité et publication.

## Preuves automatiques
- Backend: pipeline CT420, tests unitaires et PostgreSQL avec plusieurs formations et permissions.
- Frontend: pipeline CT410, tests unitaires, TypeScript et compilation.
- Browser acceptance: Chromium 390/1440 px, catalogue sept fiches, choix de connexion, gardes anonymes, dashboards apprenant/formateur, onboarding, studio, dossier, backlog, portfolio sur API synthétique locale. Captures en artefact du pipeline. Aucun compte ni contenu réel.
- HTTP smoke post-deploy: accès publics, gardes privés et API sans session.

## Acceptation de production non déductible du CI
| Contrôle | Preuve nécessaire |
|---|---|
| Connexion/inscription/confirmation | Compte de recette dédié et e-mail reçu |
| Onboarding/planning | Sauvegarde réelle et reprise avec la formation active |
| Atelier/carnet/livrable | Dépôt de recette, vérification et correction par formateur |
| Backlog/dossier/revue | Sauvegarde, partage, réponse et révocation |
| Portfolio | Preuve validée réelle et test de lien révoqué |
| Séances/défis/blocages | Publication et échanges avec deux comptes de recette |
| Coach Qwen3 | Réponse réelle via CT420 et vérification de latence |
| UI/UX authentifiée | Desktop/mobile, clavier, contraste, overflow et états d'erreur |
| Six formations non ouvertes | Relecture pédagogique des 16 ateliers de chaque parcours, scellement exact, publication et consentement explicite avant ouverture |

Ce document est une liste de critères, pas un certificat d'acceptation. Les statuts de publication et d'inscription se lisent depuis les API authentifiées. Ne jamais simuler une validation réelle ni ouvrir un parcours depuis une fixture de test.
