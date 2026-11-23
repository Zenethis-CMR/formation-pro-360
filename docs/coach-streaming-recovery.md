# Coach Qwen3 : correction du blocage navigateur

## Cause probable traitée

Le formulaire précédent utilisait `useActionState(askWorkshopCoach)`. Cette action Next.js attendait le retour complet de CT420, donc potentiellement plus de 60 à 120 secondes avec Qwen3 4B à 2,5 tokens/s. Un délai d'intermédiaire HTTP ou un échec de transport pouvait provoquer un rejet côté navigateur. Les captures montrant « Application error » ne contiennent pas la console JavaScript : elles ne permettent **pas** d'établir formellement une cause unique.

## Nouveau trajet

Le navigateur émet un POST JSON sur `/api/coach`, même origine, avec cookie HttpOnly envoyé automatiquement. Next.js vérifie l'Origin, la session, le rôle et les bornes du payload. CT420 demeure l'autorité finale concernant l'inscription et la leçon ; seul CT420 appelle CT1400. Le serveur Next émet immédiatement un flux SSE avec un événement `ready`, des `heartbeat` toutes les 8 secondes, puis `answer` ou `failure`. Cela permet d'afficher un état de travail honnête pendant que CT420 attend jusqu'à 120 secondes la génération locale.

L'interface interprète les événements sans exposer l'appel CT420 au navigateur. Elle conserve au plus un précédent échange en mémoire React, sans persistance. Les erreurs HTTP, fermetures du flux et problèmes de format sont rendus comme messages dans le coach ; le reste de l'atelier et le carnet restent utilisables.

Une frontière d'erreur propre à l'atelier remplace l'écran blanc si une exception de rendu survient. Le test de déploiement interroge `/api/coach` sans session : il doit répondre 401 et ne doit pas démarrer d'inférence.

## Limites

Le flux envoie des battements et le résultat final, **pas des tokens générés en direct** : l'API CT420 conserve un appel `stream:false`. La réussite de la CI et du contrôle anonyme n'est pas une preuve d'un dialogue authentifié de bout en bout ; cette dernière recette devra être effectuée avec un apprenant inscrit. Aucun modèle ni token payant n'est utilisé dans la CI.
