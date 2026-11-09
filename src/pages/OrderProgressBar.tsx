import './OrderProgressBar.css'

const STEPS = ['The couple', 'Wedding details', 'Celebrations', 'Review', 'Personal touches'] as const

export default function OrderProgressBar({ current, onNavigate }: { current: number; onNavigate: (step: number) => void }) {
  const fill = ((current + 1) / STEPS.length) * 100
  return <div className="order-progress-wrapper">
    <nav className="order-progress-steps" aria-label="Order progress">
      {STEPS.map((label, i) => {
        const isActive = i === current
        const isCompleted = i < current
        return <span key={label}>
          {i > 0 && <span className={`order-progress-connector${i <= current ? ' completed' : ''}`} />}
          <button type="button" className={`order-progress-step${isCompleted ? ' completed' : ''}${isActive ? ' active' : ''}`} onClick={() => onNavigate(i)}>
            <span className="order-progress-dot">{isCompleted ? '✓' : i + 1}</span>
            <span className="order-progress-label">{label}</span>
          </button>
        </span>
      })}
    </nav>
    <div className="order-progress-track"><div className="order-progress-fill" style={{ width: `${fill}%` }} /></div>
  </div>
}
