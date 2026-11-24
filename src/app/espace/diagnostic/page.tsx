import Link from "next/link";
import {requireRole} from "@/lib/auth/require-role";
import {LearnerEntryDiagnostic} from "@/components/learner-entry-diagnostic";
export const dynamic="force-dynamic";
export default async function DiagnosticPage(){
 await requireRole("learner");
 return <main className="page">
  <Link href="/espace/apprenant" className="workshop-back">← Mon espace</Link>
  <header className="learner-welcome-hero">
   <span className="journey-overline">ORIENTATION · FACULTATIF</span>
   <h1>Découvre ton point de départ.</h1>
   <p>Sept situations concrètes pour identifier les notions à approfondir avant ou pendant ton parcours. Ce diagnostic de raisonnement ne remplace pas une démonstration pratique corrigée par un formateur.</p>
  </header>
  <LearnerEntryDiagnostic/>
 </main>;
}
