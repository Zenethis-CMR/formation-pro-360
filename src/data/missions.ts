export type Mission = { id: string; title: string; module: string; description: string; xp: number; duration: string };
export const missions: Mission[] = [
  { id: "M01", title: "Construire une page HTML", module: "Fondamentaux", description: "Créer une page structurée et accessible sans générateur automatique.", xp: 100, duration: "2 h" },
  { id: "M02", title: "Rendre la page responsive", module: "Design & Web", description: "Adapter la mise en page aux écrans mobiles et desktop.", xp: 150, duration: "3 h" },
  { id: "M03", title: "Ajouter des interactions", module: "JavaScript", description: "Créer une liste de tâches manipulable en JavaScript.", xp: 200, duration: "4 h" },
  { id: "M04", title: "Livrer une mini-application", module: "Projet", description: "Sauvegarder les tâches localement et défendre les choix techniques.", xp: 300, duration: "6 h" }
];
