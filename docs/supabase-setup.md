# Supabase (PostgreSQL + Auth) — branche de développement

## Statut
Cette branche prépare le branchement à Supabase. **Aucune base distante n'est encore créée ni migrée**.
La démonstration actuelle sur `main` reste intacte.

## Déploiement sécurisé
1. Connecter Supabase au compte puis créer un projet dans une région adaptée, en vérifiant les coûts et les exigences de protection des données.
2. Dans SQL Editor du **nouveau projet**, examiner et exécuter `supabase/migrations/001_initial.sql`. Ne pas lancer cette migration non idempotente sur une base existante.
3. Renseigner dans Vercel (Production / Preview) : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL` (URL de l'application), via l'interface sécurisée. Ne pas les committer avec des valeurs réelles.
4. Dans Supabase Authentication > URL Configuration, définir Site URL et la redirection `https://formation-pro-360.vercel.app/auth/callback` (et les URL de prévisualisation si nécessaire).
5. Un compte s'inscrit via email, devenant **learner** par défaut. Pour attribuer le premier rôle formateur, effectuer la commande SQL d'amorçage de la fin de la migration en remplaçant l'adresse du formateur.
6. Vérifier 4 scénarios avec deux comptes distincts : soumission apprenant, correction formateur, refus d'accès formateur par apprenant, isolation des soumissions et XP.
7. Ne fusionner la branche dans `main` qu'après tests et vérification des autorisations.

## Sécurité
Les rôles sont déterminés dans PostgreSQL, jamais par un champ modifiable depuis le navigateur.
RLS est activé sur toutes les tables. La revue et l'attribution des XP se font dans une fonction PostgreSQL autorisée uniquement pour le formateur.
Aucune clé service-role n'est nécessaire dans le front-end ou dans les actions serveur.
