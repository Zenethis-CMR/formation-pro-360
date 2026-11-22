
export type Technology = "HTML5" | "CSS3" | "JavaScript" | "TypeScript" | "React" | "Next.js" | "Node.js" | "PostgreSQL";

const iconPaths: Record<Technology, string> = {
  HTML5: "html5/html5-original.svg",
  CSS3: "css3/css3-original.svg",
  JavaScript: "javascript/javascript-original.svg",
  TypeScript: "typescript/typescript-original.svg",
  React: "react/react-original.svg",
  "Next.js": "nextjs/nextjs-original.svg",
  "Node.js": "nodejs/nodejs-original.svg",
  PostgreSQL: "postgresql/postgresql-original.svg"
};

export function TechnologyBadge({ name, compact = false }: { name: Technology; compact?: boolean }) {
  return (
    <span className={"technology-badge" + (compact ? " is-compact" : "")} title={name}>
      <img src={"https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/" + iconPaths[name]}
        alt="" width={20} height={20} loading="lazy" decoding="async" />
      {!compact && <span>{name}</span>}
    </span>
  );
}

export function technologiesForMission(mission: {id:string;title:string;domain:string}): Technology[] {
  if (mission.id === "M01") return ["HTML5"];
  if (mission.id === "M02") return ["HTML5", "CSS3"];
  if (mission.id === "M03" || mission.id === "M04") return ["JavaScript"];
  const phrase = (mission.title + " " + mission.domain).toLowerCase();
  if (phrase.includes("typescript")) return ["TypeScript"];
  if (phrase.includes("html") && phrase.includes("css")) return ["HTML5", "CSS3"];
  if (phrase.includes("html")) return ["HTML5"];
  if (phrase.includes("css")) return ["CSS3"];
  if (phrase.includes("javascript")) return ["JavaScript"];
  if (phrase.includes("postgresql")) return ["PostgreSQL"];
  if (phrase.includes("next.js")) return ["Next.js"];
  if (phrase.includes("react")) return ["React"];
  if (phrase.includes("node.js")) return ["Node.js"];
  return [];
}

export function displayDomain(domain: string): string {
  const translations: Record<string, string> = {
    "Design & CSS": "Design et CSS",
    "Produit & données": "Produit et données",
    "Design & communication": "Design et communication",
    "Architecture & API": "Architecture et API",
    "Design & UX": "Design et UX",
    "IA & automatisation": "IA et automatisation",
    "Produit & business": "Produit et entrepreneuriat"
  };
  return translations[domain] ?? domain;
}
