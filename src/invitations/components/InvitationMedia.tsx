import { forwardRef } from 'react'
import type { ImgHTMLAttributes, VideoHTMLAttributes, Ref } from 'react'

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & { kind?: 'image'; priority?: boolean }
type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & { kind: 'video' }

// Opening images explicitly opt into priority. Below-fold images defer their
// downloads, and videos default to metadata until a template requests playback.
export const InvitationMedia = forwardRef<HTMLImageElement | HTMLVideoElement, ImageProps | VideoProps>((props, ref) => {
  if (props.kind === 'video') {
    const { kind: _kind, ...video } = props
    return <video playsInline preload="metadata" {...video} ref={ref as Ref<HTMLVideoElement>} />
  }
  const { kind: _kind, priority = false, ...image } = props
  return <img decoding="async" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} {...image} ref={ref as Ref<HTMLImageElement>} />
})
InvitationMedia.displayName = 'InvitationMedia'
