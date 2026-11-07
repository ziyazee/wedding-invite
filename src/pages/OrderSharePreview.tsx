import type { InvitationData } from '../invitations/model'
import { invitationSharePreview, shareDescriptionLimit, shareTitleLimit } from '../invitations/sharePreview'
import './OrderSharePreview.css'

type Props = {
  details: InvitationData
  disabled: boolean
  onChange: (field: 'shareTitle' | 'shareDescription', value: string | undefined) => void
}

export default function OrderSharePreview({ details, disabled, onChange }: Props) {
  const preview = invitationSharePreview(details)
  const defaults = invitationSharePreview(details, true)
  return <fieldset className="order-share-preview" disabled={disabled}>
    <legend>Link preview</legend>
    <p className="form-note">The first glimpse of your invitation when you share its link.</p>
    <label>Preview title<input maxLength={shareTitleLimit} value={details.shareTitle ?? defaults.title} onChange={event => onChange('shareTitle', event.target.value)} /></label>
    <label>Preview description<textarea rows={3} maxLength={shareDescriptionLimit} value={details.shareDescription ?? defaults.description} onChange={event => onChange('shareDescription', event.target.value)} /></label>
    <button type="button" className="order-share-reset" disabled={details.shareTitle === undefined && details.shareDescription === undefined} onClick={() => { onChange('shareTitle', undefined); onChange('shareDescription', undefined) }}>Use invitation details</button>
    <div className="order-share-sample">
      <span className="order-share-caption">SHARING PREVIEW</span>
      <article className="order-share-card" aria-label="Invitation link preview">
        <img src={preview.image} alt={preview.imageAlt} loading="lazy" />
        <div className="order-share-copy">
          <strong>{preview.title}</strong>
          <p>{preview.description}</p>
          <span>shaadiinvites.in</span>
        </div>
      </article>
      <p className="form-note">Artwork follows your chosen design. The preview layout may vary by app.</p>
    </div>
  </fieldset>
}
