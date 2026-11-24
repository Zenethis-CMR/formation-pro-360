export type LoadingVariant="dashboard"|"studio"|"product"|"report"|"generic";
export function WorkspaceLoading({variant="generic"}:{variant?:LoadingVariant}){
 const message={dashboard:"Chargement de ton tableau de bord…",studio:"Chargement de l'atelier…",product:"Chargement de l'espace produit…",report:"Chargement du bilan…",generic:"Chargement de ton espace…"}[variant];
 return <div className={"page ux-loading ux-loading-"+variant} role="status" aria-live="polite">
  <p className="ux-loading-label"><span className="ux-spinner" aria-hidden="true"/>{message}</p>
  <div aria-hidden="true" className="ux-skeleton-layout">
   <div className="ux-skeleton ux-sk-heading"/><div className="ux-skeleton ux-sk-subtitle"/>
   <div className="ux-sk-hero"><div><div className="ux-skeleton ux-sk-eyebrow"/><div className="ux-skeleton ux-sk-title"/><div className="ux-skeleton ux-sk-subtitle"/><div className="ux-skeleton ux-sk-button"/></div><div className="ux-skeleton ux-sk-art"/></div>
   {variant==="studio"||variant==="product"?<div className="ux-sk-nav">{Array.from({length:4},(_,i)=><span className="ux-skeleton" key={i}/>)}</div>:<div className="ux-sk-metrics">{Array.from({length:3},(_,i)=><div key={i}><span className="ux-skeleton"/><span className="ux-skeleton"/></div>)}</div>}
   <div className="ux-sk-panel"><div className="ux-skeleton ux-sk-title"/>{Array.from({length:3},(_,i)=><div className="ux-skeleton ux-sk-line" key={i}/>)}</div>
  </div>
 </div>;
}
