"use client";
import Link from "next/link";
import {useEffect} from "react";
import {AlertTriangle,ArrowLeft,RefreshCcw} from "lucide-react";

/** A failed client component should not blank the entire learner workspace. */
export default function WorkshopError({
  error,reset
}:{error:Error&{digest?:string};reset:()=>void}){
  useEffect(()=>{
    // Log only a non-personal error identifier, not any private form field.
    if(error.digest)console.error("Workshop UI error digest",error.digest);
  },[error]);
  return <section className="studio-error-recovery" role="alert">
    <AlertTriangle size={28}/>
    <h1>Impossible d'afficher cet atelier pour le moment.</h1>
    <p>Tes notes déjà enregistrées restent dans ton carnet. Tu peux essayer de recharger
      cet atelier ou revenir au parcours sans envoyer de nouvelle demande au coach.</p>
    <div>
      <button onClick={reset} type="button"><RefreshCcw size={16}/> Réessayer</button>
      <Link href="/espace/parcours/ingenierie-produit-ia">
        <ArrowLeft size={16}/> Retour au parcours
      </Link>
    </div>
  </section>;
}
