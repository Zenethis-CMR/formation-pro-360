"use client";
import {AlertCircle,ArrowLeft,RefreshCw} from "lucide-react";
import {useTransition} from "react";
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){
 const [pending,startTransition]=useTransition();
 return <main className="page ux-error-page"><section className="ux-error-card" aria-labelledby="ux-error-title"><span className="ux-error-icon"><AlertCircle size={30}/></span><h1 id="ux-error-title">Cette page n'a pas pu se charger.</h1><p>Le service est peut-être momentanément indisponible. Les données de cette page ne sont pas confirmées. Si tu avais un brouillon non enregistré, vérifie son état après avoir réessayé.</p><div className="ux-error-actions"><button type="button" disabled={pending} onClick={()=>startTransition(()=>reset())}><RefreshCw size={17} className={pending?"ux-spin":undefined}/>{pending?"Nouvelle tentative…":"Réessayer"}</button><a href="/espace"><ArrowLeft size={16}/> Retour à l'accueil</a></div></section></main>;
}
