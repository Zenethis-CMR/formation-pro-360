export type Mission = {
  id: string;
  title: string;
  domain: string;
  week: number;
  difficulty: "Débutant" | "Intermédiaire";
  description: string;
  objectives: string[];
  deliverable: string;
  xp: number;
  duration: string;
  prerequisites: string[];
};

export const initialMissions: Mission[] = [
  { id:"M01", title:"Créer une page HTML structurée", domain:"Développement web", week:1,
    difficulty:"Débutant", description:"Construire une page de présentation sémantique, claire et accessible.",
    objectives:["Balises sémantiques","Hiérarchie des titres","Formulaires simples"],
    deliverable:"Lien vers le code et capture ou démo de la page", xp:100, duration:"2–3 h", prerequisites:[] },
  { id:"M02", title:"Transformer la page en interface responsive", domain:"Design & CSS", week:1,
    difficulty:"Débutant", description:"Proposer un design cohérent sur téléphone et ordinateur.",
    objectives:["Flexbox et Grid","Typographie et couleurs","Mise en page mobile"],
    deliverable:"Lien vers la page déployée et son dépôt de code", xp:150, duration:"4 h", prerequisites:["M01"] },
  { id:"M03", title:"Programmer une liste de tâches", domain:"JavaScript", week:2,
    difficulty:"Débutant", description:"Ajouter, terminer et supprimer des tâches sans bibliothèque UI.",
    objectives:["Variables et fonctions","Événements et DOM","Gestion des erreurs"],
    deliverable:"Application interactive et fichier README explicatif", xp:200, duration:"5 h", prerequisites:["M02"] },
  { id:"M04", title:"Sauvegarder les tâches", domain:"Produit & données", week:2,
    difficulty:"Intermédiaire", description:"Conserver les tâches et expliquer les limites du stockage local.",
    objectives:["localStorage","Sérialisation JSON","Tests manuels"],
    deliverable:"Lien de démonstration et scénario de test", xp:250, duration:"4 h", prerequisites:["M03"] },
  { id:"M05", title:"Présenter un mini-produit", domain:"Design & communication", week:3,
    difficulty:"Débutant", description:"Préparer une interface soignée et une courte démonstration du produit.",
    objectives:["Parcours utilisateur","Design de composants","Présentation de valeur"],
    deliverable:"Maquette, démo et courte présentation", xp:300, duration:"6 h", prerequisites:["M04"] },
  { id:"M06", title:"Concevoir les données d’une application", domain:"Architecture & API", week:4,
    difficulty:"Intermédiaire", description:"Définir le modèle de données et les routes nécessaires à une application.",
    objectives:["Schéma de données","API REST","Validation des entrées"],
    deliverable:"Schéma de données et prototype d’API documenté", xp:400, duration:"7 h", prerequisites:["M04"] }
];
