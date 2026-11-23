import { useRef, useEffect } from 'react'
import type { CoupleInfo } from '../types'
import { OrnamentalDivider, ScrollIndicator } from '../assets'

interface Props {
  couple: CoupleInfo
  videoSrc: string
  videoRef: React.RefObject<HTMLVideoElement | null>
  onVideoEnd?: () => void
}

export default function Opening({ couple, videoSrc, videoRef, onVideoEnd }: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return

    let fallbackTimer: ReturnType<typeof setTimeout> | null = null

    const attemptPlay = () => {
      const playPromise = vid.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          onVideoEnd?.()
        })
      }
    }

    const handleEnded = () => {
      if (fallbackTimer) clearTimeout(fallbackTimer)
      onVideoEnd?.()
    }

    vid.addEventListener('canplay', attemptPlay, { once: true })
    vid.addEventListener('ended', handleEnded, { once: true })

    fallbackTimer = setTimeout(() => {
      onVideoEnd?.()
    }, 12000)

    return () => {
      vid.removeEventListener('canplay', attemptPlay)
      vid.removeEventListener('ended', handleEnded)
      if (fallbackTimer) clearTimeout(fallbackTimer)
    }
  }, [videoRef, onVideoEnd])

  return (
    <section ref={sectionRef} className="tj-opening">
      <video
        ref={videoRef}
        className="tj-opening-video"
        src={videoSrc}
        muted
        playsInline
        preload="auto"
      />

      <div className="tj-opening-overlay" />

      <div className="tj-opening-content">
        <p className="tj-bismillah" dir="rtl" lang="ar">
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>

        <div className="tj-opening-names">
          <span className="tj-name-1 tj-name-shimmer">{couple.brideName}</span>
          <span className="tj-name-connector">&amp;</span>
          <span className="tj-name-2 tj-name-shimmer">{couple.groomName}</span>
        </div>

        <OrnamentalDivider className="tj-opening-divider" motif="none" width="40%" />

        <p className="tj-opening-tagline">
          Request your presence at their Nikah ceremony
        </p>
      </div>

      <ScrollIndicator className="tj-scroll-indicator tj-scroll-indicator--animated" size={24} />
    </section>
  )
}
