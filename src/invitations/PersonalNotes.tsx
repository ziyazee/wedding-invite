import { useInvitationDetails } from './context'
import { editableText } from './textLayout'
import { EditableText } from './components/EditableText'
import { InvitationSection } from './components/InvitationSection'
export default function PersonalNotes({family=true,notes=true}:{family?:boolean;notes?:boolean}){
 const d=useInvitationDetails();if(!d)return null
 if(!(family&&(d.groomFamily||d.brideFamily))&&!(notes&&(d.dressCode||d.giftNote))&&!d.gallery)return null
 const text = (field: string, label: string) => editableText(d.template === 1 ? d.template : undefined, 'notes', field, label)
 return <InvitationSection data-invite-section="notes" className="personal-notes">
  {family&&(d.groomFamily||d.brideFamily)&&<div className="personal-family-note"><span className="personal-note-ornament" aria-hidden="true">✧</span><EditableText as="h2" {...text('familyHeading','With our families')}>With our families</EditableText>{d.groomFamily&&<div className="personal-family"><EditableText {...text('groomLabel','Groom’s family · heading')} className="personal-family-label">Groom’s family</EditableText><EditableText as="p" {...text('groomFamily','Groom’s family')}>{d.groomFamily}</EditableText></div>}{d.brideFamily&&<div className="personal-family"><EditableText {...text('brideLabel','Bride’s family · heading')} className="personal-family-label">Bride’s family</EditableText><EditableText as="p" {...text('brideFamily','Bride’s family')}>{d.brideFamily}</EditableText></div>}</div>}
  {notes&&d.dressCode&&<div><EditableText as="h2" {...text('dressHeading','Dress code · heading')}>Dress code</EditableText><EditableText as="p" {...text('dressCode','Dress code')}>{d.dressCode}</EditableText></div>}
  {notes&&d.giftNote&&<div><EditableText as="h2" {...text('giftHeading','A little note · heading')}>A little note</EditableText><EditableText as="p" {...text('giftNote','Gift note')}>{d.giftNote}</EditableText></div>}
  {d.gallery&&<EditableText as="a" {...text('galleryLabel','Our photo gallery')} href={d.gallery} target="_blank" rel="noreferrer">Our photo gallery ↗</EditableText>}
 </InvitationSection>
}
