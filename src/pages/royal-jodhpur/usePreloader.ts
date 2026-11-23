import { useEffect, useRef, useState } from 'react'

export function usePreloader() {
  const [phase, setPhase] = useState<'idle' | 'li' | 'ni' | 'away' | 'done'>('idle')
  const plRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('li'), 300)
    const t2 = setTimeout(() => setPhase('ni'), 700)
    const t3 = setTimeout(() => setPhase('away'), 1600)
    const t4 = setTimeout(() => setPhase('done'), 2100)
    const failsafe = setTimeout(() => setPhase('done'), 4000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(failsafe) }
  }, [])

  const plClass = ['preloader', phase === 'li' || phase === 'ni' || phase === 'away' ? 'li' : '', phase === 'ni' || phase === 'away' ? 'ni' : '', phase === 'away' ? 'away' : ''].filter(Boolean).join(' ')
  const hidden = phase === 'done'

  return { plRef, plClass, hidden, heroReady: phase === 'done' }
}
