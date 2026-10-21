import { useInvitationDetails } from './context'
import { editableText } from './textLayout'
export default function PersonalNotes({family=true,notes=true}:{family?:boolean;notes?:boolean}){
 const d=useInvitationDetails();if(!d)return null
 if(!(family&&(d.groomFamily||d.brideFamily))&&!(notes&&(d.dressCode||d.giftNote))&&!d.gallery)return null
 const text = (field: string, label: string) => editableText(d.template === 1 ? d.template : undefined, 'notes', field, label)
 return <section data-invite-section="notes" className="personal-notes">
  {family&&(d.groomFamily||d.brideFamily)&&<div className="personal-family-note"><span className="personal-note-ornament" aria-hidden="true">✧</span><h2 {...text('familyHeading','With our families')}>With our families</h2>{d.groomFamily&&<div className="personal-family"><span {...text('groomLabel','Groom’s family · heading')} className="personal-family-label">Groom’s family</span><p {...text('groomFamily','Groom’s family')}>{d.groomFamily}</p></div>}{d.brideFamily&&<div className="personal-family"><span {...text('brideLabel','Bride’s family · heading')} className="personal-family-label">Bride’s family</span><p {...text('brideFamily','Bride’s family')}>{d.brideFamily}</p></div>}</div>}
  {notes&&d.dressCode&&<div><h2 {...text('dressHeading','Dress code · heading')}>Dress code</h2><p {...text('dressCode','Dress code')}>{d.dressCode}</p></div>}
  {notes&&d.giftNote&&<div><h2 {...text('giftHeading','A little note · heading')}>A little note</h2><p {...text('giftNote','Gift note')}>{d.giftNote}</p></div>}
  {d.gallery&&<a {...text('galleryLabel','Our photo gallery')} href={d.gallery} target="_blank" rel="noreferrer">Our photo gallery ↗</a>}
 </section>
}
