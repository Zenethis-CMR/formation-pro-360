# Revue UX : du premier clic au portfolio professionnel

Cette revue porte sur l'expérience réelle construite par le frontend Formation Pro 360, de la création du compte au dernier atelier et aux réalisations vérifiées. La session privée de l'apprenant n'est pas accessible au robot de CI ; les vérifications du parcours utilisateur sont des vérifications de code et des tests automatisés, **pas** une étude utilisateur en direct.

| Moment | Friction repérée | Correction livrée |
|---|---|---|
| Inscription | Le mot de passe demandait plusieurs types de caractères mais l'écran n'affichait que « 12 caractères ». | Règle complète affichée |
| E-mail de confirmation | Une confirmation réussie redirigeait vers `sent=verified` mais aucun message ne reconnaissait cet état. | Succès confirmé, étapes visibles, bouton de connexion |
| Échec d'inscription | Une erreur `signup` masquait le formulaire sous le formulaire de renvoi de mail. | Correction de l'état et possibilité de ressaisir |
| Tableau de bord initial | Deux programmes concurrents, sans orientation prioritaire de l'apprenant. | Fil conducteur à cinq repères et une action principale vérifiable |
| Onboarding | Les préférences strictes pouvaient paraître obligatoires. | Possibilité visible de passer et de revenir ensuite |
| Inscription au parcours | L'utilisateur doit retrouver la formation et vérifier sa situation. | CTA contextualisé selon les accès autorisés |
| Programme de 16 ateliers | Deux chemins distincts permettaient de remettre un livrable, dont un avant les outils de l'atelier. | Un seul dépôt, dans le studio complet |
| Ouverture d'un atelier | Le CTA primaire « Préparer mon livrable » envoyait directement vers la fin du studio. | CTA conditionnel : lire les consignes, reprendre après correction, suivre ou revoir |
| Correction et XP | L'IA et les coches personnelles ne doivent pas prétendre valider les compétences. | Statut toujours fondé sur la correction humaine et le registre XP |
| Fin | Aucune indication claire que le parcours est réellement accompli. | Célébration et accès au portfolio uniquement pour 16 validations et au moins 1 600 XP vérifiés |

## Matrice de recette manuelle encore nécessaire

Avec un vrai compte apprenant et l'accord des responsables :
1. Créer un compte et vérifier le mail ; entrer avec une session neuve.
2. Comprendre l'onboarding sur téléphone et ordinateur, le passer puis y revenir.
3. Rejoindre le cursus ; commencer l'atelier 1 ; utiliser les cinq étapes, le coach et le carnet.
4. Sauvegarder et recharger le carnet ; soumettre ; suivre une correction ; recevoir une demande d'amélioration et resoumettre.
5. Recevoir une approbation et 100 XP officiels ; terminer réellement 16 ateliers ; observer la fin et le portfolio.
6. Imprimer/exporter le portfolio, créer un partage, ouvrir dans une fenêtre privée, puis révoquer.
7. Vérifier contraste, taille de texte, navigation clavier, défilement, états de chargement, menus mobiles et délais de réponse du coach Qwen3.

**Aucun apprenant fictif, XP artificiel, diplôme ou publication publique n'a été créé par cette modification.**

## Lisibilité du tableau de bord
Les nouveaux comptes voient désormais le parcours principal et l'action du jour en priorité. Les missions complémentaires sont repliées, sans suppression, et se déplient automatiquement lorsqu'un apprenant possède déjà des soumissions ou XP historiques.

## Suite de la recette : accès et reprise après correction (24 novembre 2026)
- Atelier inaccessible : l'action principale revient au parcours pour vérifier les droits, sans ancre vers des consignes masquées.
- Service indisponible : message distinct d'une inscription manquante.
- Correction sans commentaire : afficher le verdict réel et préciser l'absence de commentaire, sans en inventer ; l'action principale retombe sur l'historique si le panneau de correction ne peut pas être rendu.
- Sur mobile et au clavier : vérifier que les liens atteignent bien le retour formateur, le dépôt en attente et les consignes, y compris après rechargement.
- Vérifier en recette authentifiée avec compte de test autorisé les états inscrit, suspendu, en correction, à améliorer et approuvé. Ces vérifications ne sont pas réputées réussies avant exécution.

## Recette 1 — Inscription et première connexion (24 novembre 2026)
Contrôles de code : formulaire, contraintes de mot de passe, redirection après confirmation, récupération et erreurs d'authentification. Une indisponibilité du serveur n'est plus assimilée à des identifiants incorrects ou à un lien expiré. En cas de renvoi non confirmé, l'interface ne prétend pas que le compte a été créé.

| Scénario à exécuter dans le navigateur | Résultat attendu | Statut |
|---|---|---|
| Inscription neuve avec une adresse de test contrôlée | Instructions de confirmation et réception du message | À exécuter |
| Mot de passe trop court, incomplet ou différent | Règle complète et correction possible | À exécuter |
| Lien expiré ou service de vérification indisponible | Messages distincts et chemin de récupération | À exécuter |
| Première connexion après confirmation | Espace apprenant et orientation facultative | À exécuter |
| Retour après déconnexion | Préférences et progression réellement conservées | À exécuter |
| Largeurs 360, 390, 768 et 1440 px, clavier seul | Champs, erreurs et boutons utilisables sans débordement | À exécuter |

L'ouverture du domaine de production depuis l'environnement de contrôle n'a pas abouti ; aucune conclusion sur la disponibilité publique du site, la réception SMTP ni le rendu visuel ne peut en être tirée. Aucun compte réel ou test n'a été créé. Utiliser une session dédiée autorisée et ne jamais enregistrer ses identifiants ou jetons dans le dépôt.

## Lot C — Planning individuel (24 novembre 2026)
Le raccourci du tableau de bord mène à un calendrier des sept prochains jours dans Mes ressources. Il utilise les préférences déjà sauvegardées : jours fixes et facultatifs, 5/6/8/10 heures par séance, date locale de Douala. Les heures facultatives ne sont pas incluses dans l'engagement fixe. La répartition indicative 30/70 et le prochain atelier sont affichés sans créer de présence, retard, événement, ou XP. Les préférences anciennes ou incomplètes donnent une invitation facultative à les compléter.
Recette à effectuer après CI : vérifier le profil à quatre jours fixes de six heures (24 h), modifier un jour, tester la frontière dimanche/lundi et le mobile. Vérifier également les comptes suspendus, achevés et sans préférences. Aucun rappel ni session de cohorte n'est créé par ce lot.
