import { useInvitationDetails } from './context'
export default function PersonalNotes({family=true,notes=true}:{family?:boolean;notes?:boolean}){
 const d=useInvitationDetails();if(!d)return null
 if(!(family&&(d.groomFamily||d.brideFamily))&&!(notes&&(d.dressCode||d.giftNote))&&!d.gallery)return null
 return <section className="personal-notes">
  {family&&(d.groomFamily||d.brideFamily)&&<div className="personal-family-note"><span className="personal-note-ornament" aria-hidden="true">✧</span><h2>With our families</h2>{d.groomFamily&&<div className="personal-family"><span className="personal-family-label">Groom’s family</span><p>{d.groomFamily}</p></div>}{d.brideFamily&&<div className="personal-family"><span className="personal-family-label">Bride’s family</span><p>{d.brideFamily}</p></div>}</div>}
  {notes&&d.dressCode&&<div><h2>Dress code</h2><p>{d.dressCode}</p></div>}
  {notes&&d.giftNote&&<div><h2>A little note</h2><p>{d.giftNote}</p></div>}
  {d.gallery&&<a href={d.gallery} target="_blank" rel="noreferrer">Our photo gallery ↗</a>}
 </section>
}
