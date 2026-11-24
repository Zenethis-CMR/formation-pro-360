import Link from "next/link";
import type {PedagogicalTrack} from "@/lib/pedagogical-types";
import "@/components/trainer-cockpit.css";
export function PedagogicalTrackSelector({tracks,selected}:{tracks:PedagogicalTrack[];selected:string|undefined}){
 return <nav className="utc-selector" aria-label="Choisir la formation">{tracks.map(t=><Link key={t.slug} href={"?parcours="+encodeURIComponent(t.slug)} aria-current={selected===t.slug?"page":undefined}>{t.title}</Link>)}{!tracks.length&&<p>Aucun parcours accessible confirmé.</p>}</nav>;
}
