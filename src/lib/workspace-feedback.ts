export type SaveState="readonly"|"saving"|"error"|"dirty"|"saved"|"idle";
export function resolveSaveState({pending,dirty,saved,error,readOnly=false}:{pending:boolean;dirty:boolean;saved:boolean;error:boolean;readOnly?:boolean}):SaveState{
 return readOnly?"readonly":pending?"saving":error?"error":dirty?"dirty":saved?"saved":"idle";
}
