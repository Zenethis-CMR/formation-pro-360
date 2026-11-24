export type PedagogicalWorkshop={slug:string;title:string;week:number;href:string};
export type PedagogicalTrack={slug:string;title:string};
export const validPedagogicalSlug=(s:unknown):s is string=>typeof s==="string"&&s.length<=100&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
