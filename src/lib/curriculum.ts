export type CurriculumWeek = {
  week: number;
  title: string;
  outcome: string;
  skills: string[];
  coachTip: string;
};

export const curriculumWeeks: CurriculumWeek[] = [
  {week:1,title:"Les fondations du web",outcome:"Mettre en ligne une première page claire et responsive.",skills:["HTML","CSS","Responsive"],coachTip:"Commence petit : structure une page accessible avant d'ajouter les détails visuels."},
  {week:2,title:"Le premier produit interactif",outcome:"Livrer une mini-application qui conserve ses données.",skills:["JavaScript","DOM","Stockage local"],coachTip:"Teste ton application comme un utilisateur : ajout, modification, suppression et rafraîchissement."},
  {week:3,title:"Les interfaces modernes",outcome:"Construire une interface React réellement interactive.",skills:["React","Composants","Gestion d'état"],coachTip:"Un composant doit répondre à une responsabilité simple. Montre les interactions dans ta démo."},
  {week:4,title:"Les données en mouvement",outcome:"Relier une application React à une API REST.",skills:["API REST","HTTP","Async/Await"],coachTip:"Anticipe les erreurs réseau et affiche clairement les états de chargement."},
  {week:5,title:"Un produit avec comptes",outcome:"Gérer des données persistantes et des accès sécurisés.",skills:["PostgreSQL","Auth","Sécurité"],coachTip:"Vérifie qu'un utilisateur ne peut pas consulter les données privées d'un autre."},
  {week:6,title:"La qualité d'expérience",outcome:"Rendre ton produit fiable, accessible et agréable sur mobile.",skills:["Accessibilité","Tests","UX"],coachTip:"Fais tester le même parcours sur téléphone, au clavier et avec des données vides."},
  {week:7,title:"La mise en ligne",outcome:"Assembler et déployer un produit complet, partageable.",skills:["Intégration","Déploiement","Observabilité"],coachTip:"Prépare une démo courte et garde une procédure de déploiement reproductible."},
  {week:8,title:"Le projet professionnel",outcome:"Livrer, documenter et présenter un produit abouti.",skills:["Performance","Documentation","Présentation"],coachTip:"Explique les choix, les limites et les prochaines améliorations de ton produit."}
];
