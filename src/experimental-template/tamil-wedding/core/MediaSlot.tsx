/* Golden — the media slot. One component renders an image or a video anywhere.
   Videos: muted, inline, canplay-retry, paused off-screen, poster still under reduced motion. */

import { useEffect, useImperativeHandle, useRef } from 'react'
import type { Ref, VideoHTMLAttributes } from 'react'
import { gsap, ScrollTrigger, useGSAP } from './gsap'
import type { MediaSpec } from './types'

interface Props {
  media: MediaSpec
  reducedMotion: boolean
  /** Opening media loads eagerly. */
  priority?: boolean
  /** Controlled videos never autoplay and don't loop (the Opening drives them). */
  controlled?: boolean
  videoRef?: Ref<HTMLVideoElement>
  videoProps?: VideoHTMLAttributes<HTMLVideoElement>
  className?: string
}

export default function MediaSlot({
  media,
  reducedMotion,
  priority = false,
  controlled = false,
  videoRef,
  videoProps,
  className = '',
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const localVideo = useRef<HTMLVideoElement | null>(null)
  const overlay = media.overlay ?? 'soft'

  // Parallax: transform-only, scrubbed. The inner layer is oversized so edges never show.
  useGSAP(
    () => {
      if (!media.parallax || reducedMotion || !innerRef.current || !wrapRef.current) return
      gsap.fromTo(
        innerRef.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: wrapRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        },
      )
    },
    { scope: wrapRef, dependencies: [media.parallax, reducedMotion] },
  )

  // Ambient videos: play while visible, retry on canplay, pause off-screen.
  useEffect(() => {
    const video = localVideo.current
    if (media.type !== 'video' || !video || controlled || reducedMotion) return
    const play = () => void video.play().catch(() => {})
    video.addEventListener('canplay', play)
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) play()
      else video.pause()
    })
    io.observe(video)
    return () => {
      video.removeEventListener('canplay', play)
      io.disconnect()
    }
  }, [media.type, media.src, controlled, reducedMotion])

  // Refresh trigger maths once the media has dimensions.
  useEffect(() => {
    if (media.parallax) ScrollTrigger.refresh()
  }, [media.parallax, media.src])

  // Expose the <video> element to the parent (the Opening drives it directly).
  useImperativeHandle(videoRef, () => localVideo.current as HTMLVideoElement)

  return (
    <div
      ref={wrapRef}
      className={`tm-media tm-media--${media.slot ?? 'background'} ${className}`}
      style={media.aspect ? { aspectRatio: media.aspect } : undefined}
    >
      <div ref={innerRef} className={`tm-media__inner${media.parallax ? ' is-parallax' : ''}`}>
        {media.type === 'image' ? (
          <img
            className="tm-media__el"
            src={media.src}
            alt={media.alt ?? ''}
            style={{ objectPosition: media.position }}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
          />
        ) : (
          <video
            ref={localVideo}
            className="tm-media__el"
            src={media.src}
            poster={media.poster}
            style={{ objectPosition: media.position }}
            muted
            playsInline
            loop={!controlled}
            preload={priority ? 'auto' : 'metadata'}
            aria-label={media.alt}
            {...videoProps}
          />
        )}
      </div>
      {overlay !== 'none' ? <div className={`tm-media__scrim tm-media__scrim--${overlay}`} /> : null}
    </div>
  )
}
