import './InvitationSetupPanel.css'

export type InvitationSetupPlan = { name: string; eventIndexes: number[] }
type Props = {
  events: Array<{ title: string }>
  plans: InvitationSetupPlan[]
  disabled: boolean
  onChange: (plans: InvitationSetupPlan[]) => void
}

export default function InvitationSetupPanel({ events, plans, disabled, onChange }: Props) {
  const updatePlan = (planIndex: number, update: (plan: InvitationSetupPlan) => InvitationSetupPlan) =>
    onChange(plans.map((plan, index) => index === planIndex ? update(plan) : plan))

  return <section className="invitation-setup-panel" aria-label="Invitation setup">
    <div className="invitation-setup-panel-heading"><strong>Invitations</strong><span>{plans.length} {plans.length === 1 ? 'invitation' : 'invitations'}</span></div>
    {plans.map((plan, planIndex) => <div className="invitation-setup-plan" key={planIndex}>
      <div className="invitation-setup-plan-heading">
        {planIndex === 0 ? <div className="invitation-setup-default-name"><strong>{plan.name}</strong><span>Default · all events</span></div> : <input aria-label={`Invitation ${planIndex + 1} name`} maxLength={80} placeholder="Invitation name" value={plan.name} disabled={disabled} onChange={event => updatePlan(planIndex, current => ({ ...current, name: event.target.value }))}/>}
        {planIndex > 0 && <button type="button" className="invitation-setup-remove" disabled={disabled} onClick={() => onChange(plans.filter((_, index) => index !== planIndex))}>Remove</button>}
      </div>
      <div className="invitation-setup-events">
        {events.map((item, eventIndex) => planIndex === 0
          ? <span className="invitation-setup-event-tag selected" key={eventIndex}>{item.title}</span>
          : <label className={plan.eventIndexes.includes(eventIndex) ? 'selected' : ''} key={eventIndex}>
              <input type="checkbox" checked={plan.eventIndexes.includes(eventIndex)} disabled={disabled} onChange={event => updatePlan(planIndex, current => ({ ...current, eventIndexes: event.target.checked ? [...current.eventIndexes, eventIndex] : current.eventIndexes.filter(index => index !== eventIndex) }))}/>
              <span>{item.title}</span>
            </label>)}
      </div>
    </div>)}
    {plans.length < 10 && <button type="button" className="invitation-setup-add" disabled={disabled} onClick={() => onChange([...plans, { name: '', eventIndexes: events.length ? [0] : [] }])}>＋ Add invitation</button>}
  </section>
}
