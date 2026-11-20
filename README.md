# Formation Pro 360

Plateforme de formation pratique et gamifiée. Next.js, TypeScript, React.

**Application :** https://formation-pro-360.vercel.app

## Ce que permet la version V1 démo

- Accueil : présentation du parcours et indicateurs de progression.
- `/apprenant` : missions progressives, prérequis, détails, soumission d'un lien vers un livrable.
- `/formateur` : file d'évaluation, note de 0 à 100, commentaire, validation ou demande de correction, création de missions personnalisées.
- XP attribués **uniquement lorsqu'une mission est validée** avec une note d'au moins **80/100**.
- Déblocage des missions suivantes après validation de leurs prérequis.

**Important :** c'est une **simulation non sécurisée** destinée à valider l'interface et le moteur pédagogique. Les deux espaces sont publics, sans comptes, sans séparation réelle de rôles et sans stockage serveur. Les données sont gardées dans le `localStorage` du navigateur utilisé ; le flux apprenant → formateur fonctionne donc dans **le même navigateur**, pas entre appareils. Ne saisir aucune donnée personnelle ou confidentielle.

## Démarrage local

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000. Vérification TypeScript : `npm run lint`, compilation : `npm run build`.

## Structure

- `src/data/missions.ts` : catalogue des missions du parcours.
- `src/lib/mission-engine.ts` : états de missions, prérequis, XP, niveaux, évaluations.
- `src/context/demo-store.tsx` : stockage navigateur pour la démonstration.
- `src/app/apprenant/page.tsx` : parcours et soumissions de missions.
- `src/app/formateur/page.tsx` : validation et création de missions.
- `docs/architecture.md` : architecture et chemin vers la version sécurisée.
- `docs/programme.md` : référentiel pédagogique.

## Prochaines étapes

1. Authentification et rôles sécurisés côté serveur.
2. Base PostgreSQL et autorisations par propriétaire/organisation.
3. Soumissions, corrections et missions persistantes.
4. Tableau de progression, badges, missions supplémentaires et suivi des cohortes.
5. Tests automatisés, validation et surveillance en production.

Aucun secret, identifiant, donnée personnelle ni résultat individuel ne doit être ajouté à ce dépôt public.
