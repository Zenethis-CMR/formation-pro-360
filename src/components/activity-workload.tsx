import {formatWorkload,type AiActivity} from "@/lib/ai-training-plans";
export function ActivityWorkload({activity}:{activity:AiActivity}){
 return <div className="ai-activity-workload" aria-label="Répartition du temps de travail indicatif"><strong>{formatWorkload(activity.minutes)} · charge indicative</strong><div className="ai-workload-bar" aria-hidden="true"><span style={{flex:activity.understandingMinutes}}/><span style={{flex:activity.productionMinutes}}/><span style={{flex:activity.verificationMinutes}}/></div><div className="ai-workload-legend"><span>Comprendre <b>{formatWorkload(activity.understandingMinutes)}</b></span><span>Produire <b>{formatWorkload(activity.productionMinutes)}</b></span><span>Vérifier <b>{formatWorkload(activity.verificationMinutes)}</b></span></div></div>;
}
