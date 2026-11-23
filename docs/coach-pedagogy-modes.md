# Accompagnement pédagogique contextualisé — Formation Pro 360

Le modèle local Qwen3 4B a une vitesse mesurée autour de 2,5 tokens/s. Le coach propose maintenant trois intentions : **Commencer** (une action de 10 minutes et une preuve), **Me débloquer** (diagnostic et test) et **Vérifier mon travail** (deux scénarios de test, un nominal et un cas d'erreur, résultat attendu et preuve). Les questions proposées changent avec l'intention, sans lancer de génération automatique.

L'apprenant peut décrire en 400 caractères maximum ce qu'il a réalisé. **Le texte n'est jamais prélevé dans son carnet**, jamais sauvegardé ni envoyé sans action explicite. Le frontend et CT420 vérifient tous deux la taille et les intentions autorisées. Le backend charge seulement le contenu de la leçon publiée, sa preuve officielle et les critères de qualité publiés disponibles. La description personnelle est traitée comme une déclaration non vérifiée et non comme une preuve.

Les réponses restent courtes (128 tokens au plus), une seule génération simultanée par instance du backend. L'apprenant peut copier manuellement un conseil puis le confronter à son projet, sans l'enregistrer automatiquement. L'évaluation, la validation et les XP restent exclusivement entre les mains du formateur.

Les anciens clients sans choix de mode fonctionnent comme avant grâce au mode `debloquer` par défaut. La route SSE avec heartbeat, les contrôles de session, le verrou d'inscription, les pages de récupération d'erreur et les journaux techniques agrégés sont conservés. Aucun changement de migration.
