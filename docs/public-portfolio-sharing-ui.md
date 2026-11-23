# Public portfolios (opt-in) — user interface and privacy

The private portfolio page now has an explicit **publication** section. No share exists by default. The learner selects 1-16 previously approved submissions, chooses a public-facing title (3-80 characters), and may voluntarily reveal grades and external proof URLs (both defaults are false). Notes, account identity, trainer comments, AI chats and learner journals are never published.

The private client loads `GET /api/portfolio-publication`, and calls `POST` or `DELETE` **only on a user's click**. The Next.js API checks the learner session, same-origin for mutations, and proxies the request via the existing CT420 private cookie. The backend validates enrollment and exact XP-backed approvals and rotates the random token on every publish/update. Revocation is possible even if the enrollment has been paused.

Public URLs `/p/<43-character-token>` are server-rendered separately from `/espace`; there is no login requirement, but guessing the 256-bit URL is infeasible. The public page exposes no owner account identifiers or contact information. Search engines are explicitly instructed not to index the page and the Referrer-Policy prevents the token from being included when opening external links. These are risk reductions, not a guarantee that a recipient won't forward the link.

No diploma or certified identity is claimed. Real grades and external URLs are visible **only after explicit user consent**. A revoked, changed or no-longer-authorized publication returns a generic unavailable page.

Runtime deployment is independent of migrations except that backend migration 020 and its tests **must succeed before the frontend is made available**.

Un échec de chargement de la configuration bloque la publication jusqu'à vérification, avec un bouton « Réessayer ». Une erreur de validation ou réseau pendant la publication reste corrigeable sans masquer le formulaire. Le propriétaire voit l'état `currently_accessible` et peut révoquer le lien même lorsque son inscription est suspendue.
