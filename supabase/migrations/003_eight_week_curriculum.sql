-- Formation Pro 360: 8-week progressive practical curriculum.
-- Additive and idempotent. Existing mission and submission data remain unchanged.
-- All new missions start unlocked only after prerequisite validation.
with learning_path (title, domain, week, description, deliverable, objectives, duration, xp) as (
  values
  ('Construire une interface avec React', 'React', 3, 'Transformer une interface statique en composants réutilisables et accessibles.', 'Dépôt Git et démo d''une interface React composée d''au moins quatre composants', ARRAY['Composants et propriétés', 'Découpage des interfaces', 'Réutilisation du code']::text[], '6 h', 300),
  ('Gérer les interactions et l''état', 'React', 3, 'Ajouter des formulaires, des filtres et des interactions avec un état React maîtrisé.', 'Application interactive avec scénario de test et démonstration vidéo ou lien public', ARRAY['useState et événements', 'Validation de formulaires', 'Listes et état dérivé']::text[], '7 h', 350),
  ('Créer une API REST documentée', 'Architecture et API', 4, 'Développer une petite API pour créer, consulter, modifier et supprimer des données.', 'Dépôt contenant une API testable, un README et des exemples de requêtes', ARRAY['Routes REST', 'Codes HTTP', 'Validation et gestion d''erreurs']::text[], '7 h', 350),
  ('Relier React à une API', 'Frontend et API', 4, 'Consommer l''API, afficher les états de chargement et traiter les erreurs de manière claire.', 'Lien vers une application React qui lit et modifie les données de l''API', ARRAY['fetch et async/await', 'États de chargement', 'Gestion des erreurs réseau']::text[], '7 h', 400),
  ('Persister les données avec PostgreSQL', 'Base de données', 5, 'Modéliser deux entités reliées et conserver réellement les données dans PostgreSQL.', 'Schéma SQL, données de test et démonstration des opérations CRUD', ARRAY['Tables et relations', 'Requêtes SQL', 'Migrations et contraintes']::text[], '8 h', 400),
  ('Sécuriser l''accès aux données', 'Authentification et sécurité', 5, 'Ajouter des comptes utilisateurs et appliquer les autorisations d''accès aux données.', 'Application avec connexion, pages protégées et preuve de séparation des utilisateurs', ARRAY['Authentification', 'Permissions et RLS', 'Validation côté serveur']::text[], '8 h', 450),
  ('Améliorer l''expérience et l''accessibilité', 'Design et accessibilité', 6, 'Faciliter le parcours mobile et rendre les interactions utilisables au clavier.', 'Lien vers l''application améliorée, avec captures mobile et checklist accessibilité', ARRAY['Design mobile', 'Navigation clavier', 'Retours utilisateurs et états vides']::text[], '6 h', 350),
  ('Tester et fiabiliser son application', 'Qualité et tests', 6, 'Écrire des scénarios de tests, corriger des défauts et documenter les cas limites.', 'Dépôt avec tests reproductibles, corrections et rapport synthétique', ARRAY['Tests unitaires', 'Scénarios fonctionnels', 'Débogage et gestion d''erreurs']::text[], '7 h', 400),
  ('Assembler un produit complet', 'Projet final', 7, 'Réunir l''interface, l''API et les données dans un produit cohérent et démontrable.', 'Version bêta publique, dépôt du projet et liste des fonctionnalités livrées', ARRAY['Architecture de l''application', 'Intégration des modules', 'Parcours utilisateur complet']::text[], '10 h', 500),
  ('Déployer et superviser le produit', 'Déploiement', 7, 'Mettre l''application en ligne, vérifier ses variables d''environnement et gérer les erreurs.', 'URL de production ou de préproduction et procédure de déploiement documentée', ARRAY['Déploiement Vercel', 'Variables d''environnement', 'Suivi des erreurs et journalisation']::text[], '7 h', 450),
  ('Optimiser et documenter le produit', 'Qualité produit', 8, 'Améliorer la performance, la sécurité et la documentation à partir d''une revue structurée.', 'Version corrigée avec liste des améliorations, guide utilisateur et tests de recette', ARRAY['Performance web', 'Revue de sécurité', 'Documentation de livraison']::text[], '8 h', 450),
  ('Présenter son produit final', 'Présentation de projet', 8, 'Démontrer un produit fonctionnel, expliquer ses choix et présenter les perspectives d''évolution.', 'Lien de démonstration, dépôt final et présentation de cinq minutes', ARRAY['Démo structurée', 'Explication technique', 'Bilan des compétences']::text[], '6 h', 550)
)
insert into public.missions (title,domain,week,description,deliverable,objectives,duration,xp,published)
select s.title,s.domain,s.week,s.description,s.deliverable,s.objectives,s.duration,s.xp,true
from learning_path s
where not exists (select 1 from public.missions existing where existing.title=s.title);

with dependency_links (title, prerequisite_title) as (
  values
  ('Construire une interface avec React', 'Sauvegarder les tâches'),
  ('Gérer les interactions et l''état', 'Construire une interface avec React'),
  ('Créer une API REST documentée', 'Gérer les interactions et l''état'),
  ('Relier React à une API', 'Créer une API REST documentée'),
  ('Persister les données avec PostgreSQL', 'Relier React à une API'),
  ('Sécuriser l''accès aux données', 'Persister les données avec PostgreSQL'),
  ('Améliorer l''expérience et l''accessibilité', 'Sécuriser l''accès aux données'),
  ('Tester et fiabiliser son application', 'Améliorer l''expérience et l''accessibilité'),
  ('Assembler un produit complet', 'Tester et fiabiliser son application'),
  ('Déployer et superviser le produit', 'Assembler un produit complet'),
  ('Optimiser et documenter le produit', 'Déployer et superviser le produit'),
  ('Présenter son produit final', 'Optimiser et documenter le produit')
)
insert into public.mission_prerequisites(mission_id,prerequisite_id)
select m.id,p.id from dependency_links d
join public.missions m on m.title=d.title
join public.missions p on p.title=d.prerequisite_title
where m.id<>p.id
on conflict (mission_id,prerequisite_id) do nothing;
