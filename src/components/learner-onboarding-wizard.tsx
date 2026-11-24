"use client";
import {useEffect,useRef,useState,type FormEvent} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {ArrowLeft,ArrowRight,CheckCircle2,Target,CalendarDays,GraduationCap,UserRound,ShieldCheck} from "lucide-react";
import {learnerGoals,learnerLevels,parseLearnerPreferences,goalLabel,levelLabel,formatWeekdays,plannedWeeklyHours,type LearnerPreferences} from "@/lib/learner-preferences";
import {IntensiveScheduleSelector} from "@/components/intensive-schedule-selector";
import {saveLearnerPreferencesDraft} from "@/app/espace/actions";
const steps=[{label:"Objectif",icon:Target},{label:"Niveau",icon:GraduationCap},{label:"Rythme",icon:CalendarDays},{label:"Récapitulatif",icon:CheckCircle2}];
function readValues(form:HTMLFormElement){
 const data=new FormData(form);
 return parseLearnerPreferences({name:String(data.get("preferredName")||""),goal:String(data.get("goal")||""),experience:String(data.get("experience")||""),minutes:String(data.get("minutesPerDay")||""),dayChoices:Array.from({length:7},(_,i)=>String(data.get("day"+(i+1))||"off"))});
}
export function LearnerOnboardingWizard({current,initialError}:{current:LearnerPreferences|null;initialError:boolean}){
 const router=useRouter(),form=useRef<HTMLFormElement>(null),active=useRef(false),heading=useRef<HTMLHeadingElement>(null);
 const [step,setStep]=useState(0),[name,setName]=useState(current?.preferred_name||""),[goal,setGoal]=useState<string>(current?.goal||""),[level,setLevel]=useState<string>(current?.experience||"");
 const [error,setError]=useState(initialError?"Impossible d'enregistrer tes préférences. Vérifie les champs.":""),[pending,setPending]=useState(false),[dirty,setDirty]=useState(false);
 const [recap,setRecap]=useState<Extract<ReturnType<typeof parseLearnerPreferences>,{valid:true}>["value"]|null>(null);
 useEffect(()=>{if(!dirty)return;const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue="";};window.addEventListener("beforeunload",warn);return()=>window.removeEventListener("beforeunload",warn);},[dirty]);
 function go(next:number){setError("");setStep(next);requestAnimationFrame(()=>{heading.current?.focus();heading.current?.scrollIntoView({block:"nearest",behavior:"auto"});});}
 function advance(){
  if(step===0&&(name.trim().length<2||name.trim().length>60||!goal)){setError("Renseigne ton nom d’usage et sélectionne ton objectif.");return;}
  if(step===1&&!level){setError("Sélectionne le niveau qui correspond à ton expérience actuelle.");return;}
  if(step===2){const parsed=form.current&&readValues(form.current);if(!parsed||!parsed.valid){setError("Choisis au moins trois jours fixes et une durée de séance valide.");return;}setRecap(parsed.value);}
  go(Math.min(step+1,3));
 }
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(active.current)return;if(step<3){advance();return;}
  const data=new FormData(e.currentTarget);if(!readValues(e.currentTarget).valid){setError("Vérifie les informations avant d’enregistrer.");return;}
  active.current=true;setPending(true);setError("");
  try{const result=await saveLearnerPreferencesDraft(data);if(result.ok===true){setDirty(false);router.push("/espace/apprenant?welcome=1");router.refresh();}else setError(result.error==="invalid"?"Vérifie tes informations et ton rythme.":"La sauvegarde est indisponible. Tes choix restent affichés : réessaie.");}
  catch{setError("La sauvegarde est indisponible. Tes choix restent affichés : réessaie.");}finally{active.current=false;setPending(false);}
 }
 return <form ref={form} className="learner-welcome-form onboarding-wizard" onSubmit={submit} onChange={()=>setDirty(true)} noValidate>
  <div className="onboarding-stepper"><div className="onboarding-stepper-top"><span>PERSONNALISATION FACULTATIVE</span><strong>Étape {step+1} sur 4</strong></div><progress value={step+1} max={4} aria-label="Étape de personnalisation"/><ol>{steps.map(({label,icon:Icon},i)=><li key={label}><button type="button" disabled={pending||i>step} aria-current={i===step?"step":undefined} onClick={()=>go(i)}><span>{i<step?<CheckCircle2 size={17}/>:<Icon size={17}/>}</span><strong>{label}</strong></button></li>)}</ol></div>
  <h2 ref={heading} tabIndex={-1} className="onboarding-step-title">{["Construis un parcours qui te ressemble.","Partons de ton expérience actuelle.","Organise ta semaine de pratique.","Ton programme personnel est prêt à être enregistré."][step]}</h2>
  <div hidden={step!==0} className="onboarding-stage"><section className="learner-welcome-card"><div className="onboarding-card-label"><UserRound size={17}/> TON IDENTITÉ</div><label htmlFor="preferredName">Prénom ou nom d’usage</label><input id="preferredName" name="preferredName" type="text" required minLength={2} maxLength={60} autoComplete="nickname" placeholder="Ex. Alex" value={name} onChange={e=>setName(e.target.value)}/><p>Ton formateur utilisera ce nom pour t'identifier dans le suivi.</p></section>
  <fieldset className="learner-welcome-card"><legend className="onboarding-card-label">TON OBJECTIF PRODUIT</legend><h3>Qu'aimerais-tu savoir construire ?</h3><div className="learner-choice-grid">{learnerGoals.map(g=><label className="learner-choice" key={g.value}><input name="goal" type="radio" value={g.value} checked={goal===g.value} onChange={()=>setGoal(g.value)}/><span className="learner-choice-content"><strong>{g.title}</strong><small>{g.detail}</small></span></label>)}</div></fieldset></div>
  <div hidden={step!==1} className="onboarding-stage"><fieldset className="learner-welcome-card"><legend className="onboarding-card-label">TON NIVEAU</legend><h3>D'où pars-tu aujourd'hui ?</h3><div className="learner-choice-grid">{learnerLevels.map(l=><label key={l.value} className="learner-choice"><input name="experience" type="radio" value={l.value} checked={level===l.value} onChange={()=>setLevel(l.value)}/><span className="learner-choice-content"><strong>{l.title}</strong><small>{l.detail}</small></span></label>)}</div><p>Le niveau déclaré sert à préparer l'accompagnement, sans modifier les prérequis ni les validations.</p></fieldset></div>
  <div hidden={step!==2} className="onboarding-stage"><IntensiveScheduleSelector regularDays={current?.regular_days||null} optionalDays={current?.optional_days||[]} initialMinutes={current?.minutes_per_day||300}/></div>
  {step===3&&recap&&<section className="learner-welcome-card onboarding-recap"><span className="onboarding-card-label"><CheckCircle2 size={17}/> TES CHOIX</span><dl><div><dt>Nom d’usage</dt><dd>{recap.preferred_name}</dd></div><div><dt>Objectif</dt><dd>{goalLabel(recap.goal)}</dd></div><div><dt>Niveau</dt><dd>{levelLabel(recap.experience)}</dd></div><div><dt>Jours fixes</dt><dd>{formatWeekdays(recap.regular_days)}</dd></div><div><dt>Jours en renfort</dt><dd>{formatWeekdays(recap.optional_days)||"Aucun"}</dd></div><div><dt>Durée par jour</dt><dd>{recap.minutes_per_day/60} h</dd></div></dl><div className="onboarding-hours"><strong>{plannedWeeklyHours(recap)} h</strong><span>par semaine · jours fixes uniquement</span></div><p>Ce rythme est une cible personnelle, pas une réservation de séances. Ton formateur évalue tes réalisations pratiques.</p></section>}
  {error&&<p role="alert" className="onboarding-error">{error}</p>}
  <div className="onboarding-actions"><button type="button" className="onboarding-secondary" disabled={step===0||pending} onClick={()=>go(step-1)}><ArrowLeft size={16}/> Précédent</button>{step<3?<button type="button" className="learner-welcome-submit" disabled={pending} onClick={advance}>Continuer <ArrowRight size={17}/></button>:<button type="submit" className="learner-welcome-submit" disabled={pending}>{pending?"Enregistrement…":"Enregistrer et accéder à mon parcours"} <ArrowRight size={17}/></button>}</div>
  <div className="onboarding-skip"><ShieldCheck size={16}/><Link href="/espace/apprenant" aria-disabled={pending} onClick={e=>{if(pending||dirty&&!window.confirm("Quitter sans enregistrer tes choix ?"))e.preventDefault();}}>Passer cette étape pour le moment</Link><span>Tu pourras modifier tes préférences plus tard.</span></div>
 </form>;
}
