import { useState, useCallback } from 'react'

type GatePhase = 'closed' | 'opening' | 'open'

export function useDestinationGate() {
  const [phase, setPhase] = useState<GatePhase>('closed')

  const enter = useCallback(() => {
    setPhase('opening')
    setTimeout(() => setPhase('open'), 900)
  }, [])

  return { phase, enter }
}
