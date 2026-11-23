import {Activity,Clock3,Server,ShieldCheck,Sparkles,TriangleAlert} from "lucide-react";
import {backendRequest} from "@/lib/auth/backend";

type Diagnostics={
  configured:boolean;busy:boolean;since:string;successful:number;failed:number;
  busy_rejections:number;average_duration_ms:number|null;
  last_duration_ms:number|null;last_result:"none"|"success"|"unavailable";
};
function duration(ms:number|null){
  if(ms===null||!Number.isFinite(ms))return "—";
  return (ms/1000).toLocaleString("fr-FR",{maximumFractionDigits:1})+" s";
}
/**
 * No conversation content: these metrics are in-memory aggregate counters from
 * CT420 and reset after its restart. Visible only inside the trainer shell.
 */
export async function LocalCoachDiagnostics(){
  let data:Diagnostics|null=null;
  try{
    const response=await backendRequest("/v1/training/coach/diagnostics");
    if(response.ok)data=await response.json() as Diagnostics;
  }catch{/* avoid displaying fictional statistics */}
  return <section className="trainer-coach-health" aria-labelledby="trainer-coach-health-title">
    <div className="trainer-coach-heading">
      <span><Sparkles size={15}/> INFRASTRUCTURE PÉDAGOGIQUE · IA LOCALE</span>
      <h2 id="trainer-coach-health-title">État du coach Qwen3</h2>
      <p>Indicateurs techniques agrégés depuis le dernier redémarrage de CT420. Aucune question d'apprenant n'est affichée.</p>
    </div>
    {!data?<div className="trainer-coach-warning"><TriangleAlert size={17}/> Indicateurs indisponibles pour cette session.</div>:
    <>
      <div className="trainer-coach-stats">
        <div><span><Server size={15}/> Service</span>
          <strong>{!data.configured?"Non configuré":data.busy?"En génération":"Prêt"}</strong>
          <small>{data.configured?"Serveur de modèle local":"Vérifier la configuration CT420"}</small>
        </div>
        <div><span><ShieldCheck size={15}/> Réponses fournies</span>
          <strong>{data.successful}</strong><small>{data.failed} échec(s) constaté(s)</small>
        </div>
        <div><span><Clock3 size={15}/> Durée moyenne</span>
          <strong>{duration(data.average_duration_ms)}</strong><small>Mesures des réponses réussies</small>
        </div>
        <div><span><Activity size={15}/> Serveur occupé</span>
          <strong>{data.busy_rejections}</strong><small>Demande(s) différée(s) faute de capacité</small>
        </div>
      </div>
      <p className="trainer-coach-note">Dernière génération : {duration(data.last_duration_ms)} · État : {data.last_result==="success"?"réussie":data.last_result==="unavailable"?"non aboutie":"aucune"}.
      Le statut « Prêt » signifie que le coach est configuré et libre, pas qu'une génération vient d'être testée.</p>
    </>}
  </section>;
}
