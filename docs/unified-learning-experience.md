# Formation Pro 360 — une expérience unifiée

L'apprenant voit désormais un seul produit : son parcours principal, ses autres réalisations, sa progression et ses XP cumulés. Les noms de versions ne figurent plus dans les menus, tableaux de bord, évaluations ou pages du catalogue.

Le score cumulé affiché sur l'accueil additionne les XP du parcours principal et les XP conservés des missions précédentes. Leur provenance reste explicite, sans doubles écritures. Les badges et niveaux des missions précédentes conservent leurs critères historiques : aucune récompense n'a été réattribuée.

La page canonique des corrections est `/espace/formateur/corrections`. L'ancienne adresse demeure accessible via une route de compatibilité. Les liens publics vers les ateliers ne changent pas ; le contrat HTTP et les migrations conservent leurs noms internes afin de préserver les comptes et les sauvegardes.

Le carnet des ateliers est privé et persistant, conservé indépendamment de la correction. La migration 019 ajoute une table sans toucher aux profils, aux comptes, aux soumissions existantes ou aux registres XP. Aucun certificat ou diplôme n'est généré automatiquement par le carnet.

Les six autres spécialisations restent signalées comme non encore ouvertes. Le parcours courant est la seule formation inscrivable, selon le statut d'inscription renvoyé par l'API.
