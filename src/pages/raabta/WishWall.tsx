import { useCallback, useEffect, useRef, useState } from 'react'

interface Wish {
  name: string
  message: string
}

const INTERVAL = 4000
const DEMO_WISHES: Wish[] = [
  { name: 'Ayesha', message: 'Wishing you both a lifetime of love, barakah, and quiet joy.' },
  { name: 'The Qureshis', message: 'May God bless this union and fill your home with light.' },
  { name: 'Imran & Sana', message: 'So happy for you two — save us a seat at the walima!' },
  { name: 'Hina', message: 'From classmates to this. Could not be happier for you both.' },
  { name: 'Faisal & Nadia', message: 'Sending all our love from Hyderabad. Have the most beautiful day.' },
  { name: 'The Sheikh Family', message: 'May every year together be brighter than the last.' },
]

function visibleCount() { return typeof window !== 'undefined' && window.innerWidth <= 640 ? 3 : 4 }

export default function WishWall({ wishes: propWishes }: { wishes: Wish[] }) {
  const allWishes = propWishes.length > 0 ? propWishes : DEMO_WISHES
  const wallRef = useRef<HTMLDivElement>(null)
  const [visibleIdxs, setVisibleIdxs] = useState<number[]>([])
  const [, setHiddenIdxs] = useState<number[]>([])
  const [fadingOut, setFadingOut] = useState<number | null>(null)
  const rotSlotRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const initGrid = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    const n = Math.min(visibleCount(), allWishes.length)
    const vis: number[] = []
    const hid: number[] = []
    allWishes.forEach((_, i) => { if (i < n) vis.push(i); else hid.push(i) })
    setVisibleIdxs(vis)
    setHiddenIdxs(hid)
    setFadingOut(null)
    rotSlotRef.current = 0

    if (hid.length > 0) {
      timerRef.current = setInterval(() => {
        setHiddenIdxs(prevHidden => {
          if (!prevHidden.length) return prevHidden
          const inIdx = prevHidden[0]
          const newHidden = prevHidden.slice(1)

          setVisibleIdxs(prevVis => {
            const slot = rotSlotRef.current
            const outIdx = prevVis[slot]
            setFadingOut(outIdx)

            setTimeout(() => {
              setFadingOut(null)
              setVisibleIdxs(prev => {
                const next = [...prev]
                next[slot] = inIdx
                return next
              })
              setHiddenIdxs(h => [...h, outIdx])
              rotSlotRef.current = (slot + 1) % Math.min(visibleCount(), allWishes.length)
            }, 360)

            return prevVis
          })

          return newHidden
        })
      }, INTERVAL)
    }
  }, [allWishes])

  useEffect(() => {
    initGrid()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [initGrid])

  useEffect(() => {
    let lastN = visibleCount()
    const onResize = () => {
      const n = visibleCount()
      if (n === lastN) return
      lastN = n
      initGrid()
    }
    window.addEventListener('resize', onResize, { passive: true } as AddEventListenerOptions)
    return () => window.removeEventListener('resize', onResize)
  }, [initGrid])

  return (
    <>
      <div className="wish-wall" ref={wallRef} data-raabta="wish-wall">
        {allWishes.map((w, i) => {
          const isVisible = visibleIdxs.includes(i)
          const isFading = fadingOut === i
          if (!isVisible && !isFading) return (
            <div key={i} className="raabta-wish wish-hidden">
              <p className="raabta-wish-message">&ldquo;{w.message}&rdquo;</p>
              <span className="raabta-wish-author">&mdash; {w.name}</span>
            </div>
          )
          return (
            <div key={i} className={`raabta-wish${isFading ? ' wish-out' : ''}`}>
              <p className="raabta-wish-message">&ldquo;{w.message}&rdquo;</p>
              <span className="raabta-wish-author">&mdash; {w.name}</span>
            </div>
          )
        })}
      </div>

    </>
  )
}
