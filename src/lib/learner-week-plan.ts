type Availability={
  regular_days:number[]|null;
  optional_days:number[];
  minutes_per_day:number;
};
export type PlannedDay={date:string;weekday:number;kind:"regular"|"optional"|"off";minutes:number;learningMinutes:number;practiceMinutes:number};
/** Calendar dates are in Africa/Douala; UTC arithmetic prevents host timezone drift. */
export function doualaCalendarDate(now:Date=new Date()):string {
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Africa/Douala",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now);
  const value=(type:string)=>parts.find(p=>p.type===type)?.value;
  return value("year")+"-"+value("month")+"-"+value("day");
}
/** A proposed schedule, never attendance or a record of completed work. */
export function buildLearnerWeekPlan(preferences:Availability|null,today:string){
  if(!preferences||![300,360,480,600].includes(preferences.minutes_per_day))return null;
  const regular=new Set((preferences.regular_days||[]).filter(n=>Number.isInteger(n)&&n>=1&&n<=7));
  if(regular.size<3)return null;
  const optional=new Set((preferences.optional_days||[]).filter(n=>Number.isInteger(n)&&n>=1&&n<=7&&!regular.has(n)));
  const start=new Date(today+"T12:00:00Z");
  if(!Number.isFinite(start.getTime())||start.toISOString().slice(0,10)!==today)return null;
  const days:PlannedDay[]=Array.from({length:7},(_,i)=>{
    const date=new Date(start);
    date.setUTCDate(start.getUTCDate()+i);
    const weekday=date.getUTCDay()||7;
    const kind=regular.has(weekday)?"regular":optional.has(weekday)?"optional":"off";
    const minutes=kind==="off"?0:preferences.minutes_per_day;
    const learningMinutes=Math.round(minutes*.3);
    return {date:date.toISOString().slice(0,10),weekday,kind,minutes,learningMinutes,practiceMinutes:minutes-learningMinutes};
  });
  const plannedMinutes=days.filter(d=>d.kind==="regular").reduce((sum,d)=>sum+d.minutes,0);
  const optionalMinutes=days.filter(d=>d.kind==="optional").reduce((sum,d)=>sum+d.minutes,0);
  return {days,plannedMinutes,optionalMinutes,regularCount:regular.size,optionalCount:optional.size};
}
